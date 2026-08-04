import { recordOptOut, verifyUnsubscribeToken } from "../_shared/emailOptOut.ts";

const UNSUB_SECRET = Deno.env.get("EMAIL_UNSUB_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const SITE = Deno.env.get("SITE_URL") ?? "https://www.compilearn.com";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function page(title: string, message: string, status = 200): Response {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#070B0A;color:#ECF3EF;
font-family:ui-sans-serif,system-ui,sans-serif;padding:24px}
main{max-width:34rem;text-align:center}
h1{font-size:1.6rem;margin:0 0 12px}
p{line-height:1.7;color:#CBD6D0;margin:0 0 20px}
a{color:#5ED29C}
</style></head><body><main><h1>${title}</h1><p>${message}</p>
<p><a href="${SITE}">Return to Compilearn</a></p></main></body></html>`;
  return new Response(html, { status, headers: { ...cors, "content-type": "text/html; charset=utf-8" } });
}

async function optOut(email: string, token: string): Promise<boolean> {
  if (!email || !token || !UNSUB_SECRET) return false;
  if (!(await verifyUnsubscribeToken(email, token, UNSUB_SECRET))) return false;
  return await recordOptOut(email, SUPABASE_URL, SERVICE_KEY);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const url = new URL(req.url);
  let email = url.searchParams.get("e") ?? "";
  let token = url.searchParams.get("t") ?? "";

  if (req.method === "POST" && !email) {
    try {
      const form = await req.formData();
      email = String(form.get("e") ?? "");
      token = String(form.get("t") ?? "");
    } catch {
      /* one-click POSTs may carry no body; the query string still applies */
    }
  }

  const ok = await optOut(email, token);

  if (req.method === "POST") {
    return new Response(ok ? "unsubscribed" : "invalid", {
      status: ok ? 200 : 400,
      headers: { ...cors, "content-type": "text/plain" },
    });
  }

  return ok
    ? page("You're unsubscribed", "You will no longer receive streak or progress emails from Compilearn. Account and security messages still apply.")
    : page("That link didn't work", "The unsubscribe link is invalid or expired. Email jason.huang317235@gmail.com and we will remove you by hand.", 400);
});
