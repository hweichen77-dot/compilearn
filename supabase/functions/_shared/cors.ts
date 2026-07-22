const DEFAULT_ORIGINS = [
  "https://compilearn.com",
  "https://www.compilearn.com",
  "https://compilearn.vercel.app",
  "https://hweichen77-dot.github.io",
];

function configured(): string[] {
  const raw = Deno.env.get("ALLOWED_ORIGINS") ?? Deno.env.get("ALLOWED_ORIGIN") ?? "";
  const list = raw.split(",").map((o) => o.trim().replace(/\/+$/, "")).filter(Boolean);
  return list.length > 0 ? list : DEFAULT_ORIGINS;
}

function isDesktopOrLocal(origin: string): boolean {
  return (
    origin === "tauri://localhost" ||
    origin === "http://tauri.localhost" ||
    /^http:\/\/localhost(:\d+)?$/.test(origin) ||
    /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
  );
}

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  const clean = origin.replace(/\/+$/, "");
  return configured().includes(clean) || isDesktopOrLocal(clean);
}

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = isAllowedOrigin(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : configured()[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}
