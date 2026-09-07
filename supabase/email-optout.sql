-- Email opt-outs (CAN-SPAM suppression list).
-- Written by the unsubscribe edge function using the service role and checked
-- before any retention email is sent. No policy is granted to end users, since
-- opting out happens through the signed unsubscribe link rather than the client.

create table if not exists public.email_optouts (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.email_optouts enable row level security;
