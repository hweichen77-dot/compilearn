import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkLimits, callerIp } from "../_shared/rateLimit.ts";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const HANDLE_PATTERN = /^[A-Za-z0-9_-]{2,20}$/;
const RESERVED = new Set(["admin", "moderator", "compilearn", "official", "staff", "support", "system", "root"]);

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  const cors = corsHeaders(req.headers.get("Origin"));
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "content-type": "application/json" } });

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return json({ configured: false, error: "leaderboard not configured" });

  const ip = callerIp(req);
  const limitErr = await checkLimits({
    caller: ip,
    fn: "lab-score",
    perMin: 3,
    perDay: 40,
    globalPerMin: 60,
    globalPerDay: 3000,
    failClosed: true,
  });
  if (limitErr) return json({ error: limitErr }, 429);

  let body: { labId?: string; handle?: string; promptChars?: number; attacksHeld?: number; claimToken?: string };
  try { body = await req.json(); } catch { return json({ error: "invalid JSON" }, 400); }

  const labId = String(body.labId ?? "").slice(0, 64);
  const handle = String(body.handle ?? "").trim();
  const promptChars = Number(body.promptChars);
  const attacksHeld = Number(body.attacksHeld);
  const claimToken = String(body.claimToken ?? "");

  if (!labId) return json({ error: "missing labId" }, 400);
  if (!HANDLE_PATTERN.test(handle)) return json({ error: "Pick 2 to 20 letters, numbers, dashes or underscores." }, 400);
  if (RESERVED.has(handle.toLowerCase())) return json({ error: "That handle is reserved." }, 400);
  if (!Number.isInteger(promptChars) || promptChars < 1 || promptChars > 4000) return json({ error: "bad promptChars" }, 400);
  if (!Number.isInteger(attacksHeld) || attacksHeld < 0 || attacksHeld > 50) return json({ error: "bad attacksHeld" }, 400);
  if (claimToken.length < 16 || claimToken.length > 200) return json({ error: "bad claim token" }, 400);

  const claimHash = await sha256(claimToken);
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

  const { data: taken } = await admin
    .from("lab_scores")
    .select("handle")
    .eq("lab_id", labId)
    .eq("published", true)
    .ilike("handle", handle)
    .maybeSingle();
  if (taken) return json({ error: "That handle is taken on this lab. Pick another." }, 409);

  const { data: existing, error: readErr } = await admin
    .from("anon_lab_scores")
    .select("prompt_chars, claim_hash")
    .eq("lab_id", labId)
    .eq("handle", handle)
    .maybeSingle();
  if (readErr) return json({ error: "could not reach the board" }, 502);

  if (existing && existing.claim_hash !== claimHash) {
    return json({ error: "That handle is taken on this lab. Pick another." }, 409);
  }
  if (existing && existing.prompt_chars <= promptChars) {
    return json({ stored: false, kept: existing.prompt_chars });
  }

  const { error: writeErr } = await admin.from("anon_lab_scores").upsert({
    lab_id: labId,
    handle,
    prompt_chars: promptChars,
    attacks_held: attacksHeld,
    claim_hash: claimHash,
    updated_at: new Date().toISOString(),
  }, { onConflict: "lab_id,handle" });
  if (writeErr) return json({ error: "could not save your score" }, 502);

  return json({ stored: true, improved: Boolean(existing) });
});
