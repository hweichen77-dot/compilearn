create table if not exists public.rate_limits (
  bucket text primary key,
  count integer not null default 0,
  reset_at timestamptz not null
);

alter table public.rate_limits enable row level security;

create or replace function public.rl_consume(p_bucket text, p_max integer, p_window_ms bigint)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_count integer;
begin
  insert into public.rate_limits as rl (bucket, count, reset_at)
  values (p_bucket, 1, v_now + make_interval(secs => p_window_ms / 1000.0))
  on conflict (bucket) do update
    set count = case when rl.reset_at <= v_now then 1 else rl.count + 1 end,
        reset_at = case when rl.reset_at <= v_now then v_now + make_interval(secs => p_window_ms / 1000.0) else rl.reset_at end
  returning rl.count into v_count;
  return v_count <= p_max;
end;
$$;

revoke all on function public.rl_consume(text, integer, bigint) from public, anon, authenticated;
