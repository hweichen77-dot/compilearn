import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkLimits, callerIp } from "../_shared/rateLimit.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { authenticate } from "../_shared/auth.ts";
import { gradeOutput, type Rules } from "../_shared/grade.ts";
import LAB_RULES from "../_shared/labRules.json" with { type: "json" };

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const GROQ_API_KEY = Deno.env.get("PLAYGROUND_GROQ_API_KEY") ?? Deno.env.get("GROQ_API_KEY");
const MODEL = Deno.env.get("GROQ_MODEL") ?? "openai/gpt-oss-120b";

const HANDLE_PATTERN = /^[A-Za-z0-9_-]{2,20}$/;
const RESERVED = new Set(["admin", "moderator", "compilearn", "official", "staff", "support", "system", "root"]);
const MAX_SYSTEM_CHARS = 4000;

type Attack = { text: string; rules: Rules };
const LABS = LAB_RULES as Record<string, Attack[]>;

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function runAttack(systemPrompt: string, input: string): Promise<string> {
  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${GROQ_API_KEY}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ],
      max_tokens: 200,
      temperature: 0.7,
      reasoning_effort: "low",
    }),
  });
  if (!resp.ok) throw new Error(`groq ${resp.status}`);
  const data = await resp.json();
  return (data?.choices?.[0]?.message?.content || "").trim();
}

Deno.serve(async (req: Request) => {
  const cors = corsHeaders(req.headers.get("Origin"));
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "content-type": "application/json" } });

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return json({ configured: false, error: "leaderboard not configured" });
  if (!GROQ_API_KEY) return json({ configured: false, error: "scoring is not configured" });

  const userId = await authenticate(req);
  const caller = userId ? `user:${userId}` : `ip:${callerIp(req)}`;
  const limitErr = await checkLimits({
    caller,
    fn: "lab-score",
    perMin: 2,
    perDay: userId ? 30 : 15,
    globalPerMin: 40,
    globalPerDay: 2000,
    failClosed: true,
  });
  if (limitErr) return json({ error: limitErr }, 429);

  let body: { labId?: string; handle?: string; systemPrompt?: string; claimToken?: string };
  try { body = await req.json(); } catch { return json({ error: "invalid JSON" }, 400); }

  const labId = String(body.labId ?? "").slice(0, 64);
  const handle = String(body.handle ?? "").trim();
  const systemPrompt = String(body.systemPrompt ?? "");
  const claimToken = String(body.claimToken ?? "");

  const attacks = LABS[labId];
  if (!attacks) return json({ error: "unknown lab" }, 400);
  if (!HANDLE_PATTERN.test(handle)) return json({ error: "Pick 2 to 20 letters, numbers, dashes or underscores." }, 400);
  if (RESERVED.has(handle.toLowerCase())) return json({ error: "That handle is reserved." }, 400);
  if (!systemPrompt.trim()) return json({ error: "missing systemPrompt" }, 400);
  if (systemPrompt.length > MAX_SYSTEM_CHARS) return json({ error: "systemPrompt too long" }, 413);
  if (!userId && (claimToken.length < 16 || claimToken.length > 200)) return json({ error: "bad claim token" }, 400);

  let held = 0;
  try {
    const outputs = await Promise.all(attacks.map((a) => runAttack(systemPrompt, a.text)));
    held = outputs.filter((out, i) => gradeOutput(out, attacks[i].rules).pass).length;
  } catch {
    return json({ error: "could not score your prompt right now" }, 502);
  }

  if (held < attacks.length) {
    return json({ stored: false, verified: true, held, total: attacks.length, error: `Your prompt held ${held} of ${attacks.length} when we re-ran it. The board only takes a clean sweep.` }, 409);
  }

  const promptChars = systemPrompt.trim().length;
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

  if (userId) {
    const { data: clash } = await admin
      .from("lab_scores").select("user_id").eq("lab_id", labId).eq("published", true)
      .ilike("handle", handle).neq("user_id", userId).maybeSingle();
    if (clash) return json({ error: "That handle is taken on this lab. Pick another." }, 409);

    const { data: mine } = await admin
      .from("lab_scores").select("prompt_chars").eq("user_id", userId).eq("lab_id", labId).maybeSingle();
    if (mine && mine.prompt_chars <= promptChars) {
      return json({ stored: false, verified: true, held, total: attacks.length, kept: mine.prompt_chars });
    }
    const { error: writeErr } = await admin.from("lab_scores").upsert({
      user_id: userId, lab_id: labId, prompt_chars: promptChars, attacks_held: held,
      handle, published: true, updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,lab_id" });
    if (writeErr) return json({ error: "could not save your score" }, 502);
    return json({ stored: true, verified: true, held, total: attacks.length, improved: Boolean(mine) });
  }

  const { data: takenByUser } = await admin
    .from("lab_scores").select("handle").eq("lab_id", labId).eq("published", true)
    .ilike("handle", handle).maybeSingle();
  if (takenByUser) return json({ error: "That handle is taken on this lab. Pick another." }, 409);

  const claimHash = await sha256(claimToken);
  const { data: existing, error: readErr } = await admin
    .from("anon_lab_scores").select("prompt_chars, claim_hash").eq("lab_id", labId).eq("handle", handle).maybeSingle();
  if (readErr) return json({ error: "could not reach the board" }, 502);
  if (existing && existing.claim_hash !== claimHash) {
    return json({ error: "That handle is taken on this lab. Pick another." }, 409);
  }
  if (existing && existing.prompt_chars <= promptChars) {
    return json({ stored: false, verified: true, held, total: attacks.length, kept: existing.prompt_chars });
  }

  const { error: writeErr } = await admin.from("anon_lab_scores").upsert({
    lab_id: labId, handle, prompt_chars: promptChars, attacks_held: held,
    claim_hash: claimHash, updated_at: new Date().toISOString(),
  }, { onConflict: "lab_id,handle" });
  if (writeErr) return json({ error: "could not save your score" }, 502);

  return json({ stored: true, verified: true, held, total: attacks.length, improved: Boolean(existing) });
});
