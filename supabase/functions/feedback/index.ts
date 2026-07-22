import { checkLimits, callerIp } from "../_shared/rateLimit.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = Deno.env.get("FEEDBACK_FROM") ?? "Compilearn Feedback <onboarding@resend.dev>";
const TO = Deno.env.get("FEEDBACK_TO") ?? "jason.huang317235@gmail.com";



const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const KINDS = new Set(["bug", "idea", "content"]);

Deno.serve(async (req: Request) => {
  const cors = corsHeaders(req.headers.get("Origin"));
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...cors, "content-type": "application/json" } });

  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  if (!RESEND_API_KEY) return json({ configured: false, error: "RESEND_API_KEY not set" });

  let body: { kind?: string; text?: string; page?: string; ua?: string };
  try { body = await req.json(); } catch { return json({ error: "invalid JSON" }, 400); }

  const text = String(body.text ?? "").trim().slice(0, 4000);
  if (!text) return json({ error: "empty feedback" }, 400);
  const kind = KINDS.has(String(body.kind)) ? String(body.kind) : "idea";
  const page = String(body.page ?? "").slice(0, 200);
  const ua = String(body.ua ?? "").slice(0, 300);

  const ip = callerIp(req);
  const limitErr = await checkLimits({ caller: ip, fn: "feedback", perMin: 4, perDay: 20, globalPerMin: 60, globalPerDay: 2000, failClosed: true });
  if (limitErr) return json({ error: limitErr }, 429);

  const html =
    `<p><strong>${escapeHtml(kind)}</strong></p>` +
    `<p style="white-space:pre-wrap">${escapeHtml(text)}</p>` +
    `<hr><p style="color:#888;font-size:12px">Page: ${escapeHtml(page)}<br>UA: ${escapeHtml(ua)}<br>IP: ${escapeHtml(ip)}</p>`;

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        subject: `[Compilearn ${kind}] ${text.slice(0, 60)}${text.length > 60 ? "…" : ""}`,
        html,
      }),
    });
    if (!resp.ok) {
      const detail = await resp.text().catch(() => "");
      console.error("feedback send failed", resp.status, detail.slice(0, 500));
      return json({ error: "could not send your message right now" }, 502);
    }
    return json({ ok: true });
  } catch (e) {
    return json({ error: "send error", detail: String(e).slice(0, 200) }, 502);
  }
});
