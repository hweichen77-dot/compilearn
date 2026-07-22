import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

let dbClient: SupabaseClient | null | undefined;
function getDb(): SupabaseClient | null {
  if (dbClient === undefined) {
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    dbClient = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  }
  return dbClient;
}

async function dbConsume(bucket: string, max: number, windowMs: number): Promise<boolean | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const { data, error } = await db.rpc("rl_consume", { p_bucket: bucket, p_max: max, p_window_ms: windowMs });
    if (error || typeof data !== "boolean") return null;
    return data;
  } catch {
    return null;
  }
}

let kvPromise: Promise<Deno.Kv | null> | null = null;
function getKv(): Promise<Deno.Kv | null> {
  if (kvPromise === null) {
    kvPromise = (async () => {
      try {
        return await Deno.openKv();
      } catch {
        return null;
      }
    })();
  }
  return kvPromise;
}

const mem = new Map<string, { c: number; r: number }>();
function memConsume(bucket: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const e = mem.get(bucket);
  if (!e || now >= e.r) {
    mem.set(bucket, { c: 1, r: now + windowMs });
    if (mem.size > 5000) {
      for (const [k, v] of mem) if (now >= v.r) mem.delete(k);
    }
    return true;
  }
  if (e.c >= max) return false;
  e.c += 1;
  return true;
}

const MAX_BUCKET_LEN = 200;

async function consume(bucket: string, max: number, windowMs: number): Promise<boolean | null> {
  const key = bucket.slice(0, MAX_BUCKET_LEN);
  const db = await dbConsume(key, max, windowMs);
  if (db !== null) return db;

  const kv = await getKv();
  if (!kv) return null;
  const kvKey = ["rl", key];
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await kv.get<{ c: number; r: number }>(kvKey);
    const now = Date.now();
    const v = res.value;
    if (!v || now >= v.r) {
      const ok = await kv.atomic().check(res).set(kvKey, { c: 1, r: now + windowMs }, { expireIn: windowMs }).commit();
      if (ok.ok) return true;
      continue;
    }
    if (v.c >= max) return false;
    const ok = await kv.atomic().check(res).set(kvKey, { c: v.c + 1, r: v.r }, { expireIn: Math.max(1000, v.r - now) }).commit();
    if (ok.ok) return true;
  }
  return null;
}

export function callerIp(req: Request): string {
  const direct = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-real-ip");
  if (direct?.trim()) return direct.trim();
  const chain = req.headers.get("x-forwarded-for") ?? "";
  const hops = chain.split(",").map(h => h.trim()).filter(Boolean);
  return hops.length > 0 ? hops[hops.length - 1] : "unknown";
}

export interface RateOpts {
  caller: string;
  fn: string;
  perMin: number;
  perDay?: number;
  globalPerMin: number;
  globalPerDay: number;
  failClosed?: boolean;
}

export async function checkLimits(o: RateOpts): Promise<string | null> {
  const unavailable = o.failClosed
    ? "rate limiting is unavailable right now — please try again shortly"
    : null;

  const checks: Array<[Promise<boolean | null>, string]> = [
    [consume(`u:${o.fn}:${o.caller}`, o.perMin, 60_000), "rate limit exceeded — slow down and try again in a minute"],
  ];
  if (o.perDay) {
    checks.push([consume(`ud:${o.fn}:${o.caller}`, o.perDay, 86_400_000), "daily limit reached for this account — try again tomorrow"]);
  }
  checks.push([consume(`g:${o.fn}`, o.globalPerMin, 60_000), "service is busy right now — try again shortly"]);
  checks.push([consume(`d:${o.fn}`, o.globalPerDay, 86_400_000), "daily capacity reached — please try again tomorrow"]);

  for (const [pending, message] of checks) {
    const allowed = await pending;
    if (allowed === false) return message;
    if (allowed === null && unavailable) return unavailable;
    if (allowed === null && !o.failClosed && !memConsume(`${o.fn}:${o.caller}`, o.perMin, 60_000)) {
      return message;
    }
  }
  return null;
}
