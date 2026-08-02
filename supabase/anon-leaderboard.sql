create table if not exists public.anon_lab_scores (
  lab_id text not null,
  handle text not null check (handle ~ '^[A-Za-z0-9_-]{2,20}$'),
  prompt_chars integer not null check (prompt_chars > 0 and prompt_chars <= 4000),
  attacks_held integer not null check (attacks_held >= 0 and attacks_held <= 50),
  claim_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (lab_id, handle)
);

create index if not exists anon_lab_scores_board_idx
  on public.anon_lab_scores (lab_id, prompt_chars);

alter table public.anon_lab_scores enable row level security;

revoke all on public.anon_lab_scores from anon, authenticated;

create unique index if not exists lab_scores_handle_uq
  on public.lab_scores (lab_id, lower(handle))
  where published and handle is not null;

drop function if exists public.lab_leaderboard(text, integer);

create function public.lab_leaderboard(p_lab_id text, p_limit integer default 20)
returns table (rank bigint, handle text, prompt_chars integer, attacks_held integer, anonymous boolean)
language sql
security definer
set search_path = public
stable
as $$
  with entries as (
    select s.handle, s.prompt_chars, s.attacks_held, s.updated_at, false as anonymous
    from public.lab_scores s
    where s.lab_id = p_lab_id and s.published and s.handle is not null
    union all
    select a.handle, a.prompt_chars, a.attacks_held, a.updated_at, true as anonymous
    from public.anon_lab_scores a
    where a.lab_id = p_lab_id
  )
  select
    row_number() over (order by e.prompt_chars asc, e.updated_at asc) as rank,
    e.handle,
    e.prompt_chars,
    e.attacks_held,
    e.anonymous
  from entries e
  order by e.prompt_chars asc, e.updated_at asc
  limit least(greatest(coalesce(p_limit, 20), 1), 50);
$$;

revoke all on function public.lab_leaderboard(text, integer) from public;
grant execute on function public.lab_leaderboard(text, integer) to anon, authenticated;
