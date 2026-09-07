const encoder = new TextEncoder();

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return bytesToHex(new Uint8Array(sig));
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function unsubscribeToken(email: string, secret: string): Promise<string> {
  return (await hmac(secret, email.trim().toLowerCase())).slice(0, 32);
}

export async function verifyUnsubscribeToken(
  email: string,
  token: string,
  secret: string,
): Promise<boolean> {
  return safeEqual(token, await unsubscribeToken(email, secret));
}

export async function unsubscribeUrl(
  email: string,
  site: string,
  functionsBase: string,
  secret: string,
): Promise<string> {
  const token = await unsubscribeToken(email, secret);
  const base = functionsBase || site;
  return `${base.replace(/\/$/, "")}/unsubscribe?e=${encodeURIComponent(email)}&t=${token}`;
}

export async function isUnsubscribed(
  email: string,
  supabaseUrl: string,
  serviceKey: string,
): Promise<boolean> {
  if (!supabaseUrl || !serviceKey) return false;
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/email_optouts?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&select=email`,
      { headers: { apikey: serviceKey, authorization: `Bearer ${serviceKey}` } },
    );
    if (!res.ok) return false;
    const rows = await res.json();
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

export async function recordOptOut(
  email: string,
  supabaseUrl: string,
  serviceKey: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/email_optouts`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        "content-type": "application/json",
        prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function emailFooter(unsubUrl: string, postalAddress: string): string {
  return [
    `<hr style="border:none;border-top:1px solid #ddd;margin:24px 0">`,
    `<p style="font-size:12px;color:#444;line-height:1.6">`,
    `You are receiving this because you created a Compilearn account. `,
    `<a href="${unsubUrl}">Unsubscribe from these emails</a>. `,
    `You will still receive account and security messages.`,
    `<br>${postalAddress}`,
    `</p>`,
  ].join("");
}
