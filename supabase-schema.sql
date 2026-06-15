-- CodeFlow Database Schema
-- Run in Supabase SQL editor: Settings > SQL Editor

-- User profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Challenge catalog (global)
create table public.challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  difficulty text check (difficulty in ('easy', 'medium', 'hard', 'expert')),
  category text,
  tags text[],
  url text,
  description text,
  created_at timestamptz default now()
);
alter table public.challenges enable row level security;
create policy "Anyone can read challenges" on public.challenges for select using (true);

-- User challenge progress
create table public.user_challenges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  challenge_id uuid references public.challenges(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  completed_at timestamptz,
  notes text,
  solution_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, challenge_id)
);
alter table public.user_challenges enable row level security;
create policy "Users manage own challenge progress" on public.user_challenges using (auth.uid() = user_id);

-- Portfolio projects
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  tech_stack text[],
  repo_url text,
  demo_url text,
  thumbnail_url text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.projects enable row level security;
create policy "Users manage own projects" on public.projects using (auth.uid() = user_id);
create policy "Anyone can view public projects" on public.projects for select using (is_public = true);

-- Learning tracks (global catalog)
create table public.tracks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  lessons jsonb not null default '[]'::jsonb,
  order_index int default 0,
  created_at timestamptz default now()
);
alter table public.tracks enable row level security;
create policy "Anyone can read tracks" on public.tracks for select using (true);

-- User track progress
create table public.user_tracks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  track_id uuid references public.tracks(id) on delete cascade,
  current_lesson_index int not null default 0,
  completed boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, track_id)
);
alter table public.user_tracks enable row level security;
create policy "Users manage own track progress" on public.user_tracks using (auth.uid() = user_id);
