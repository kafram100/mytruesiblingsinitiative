-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Contact form submissions
create table if not exists public.contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

alter table public.contacts enable row level security;

create policy "Anyone can insert contacts"
  on public.contacts for insert
  with check (true);

create policy "Only admins can view contacts"
  on public.contacts for select
  using (auth.role() = 'service_role');

-- Donations
create table if not exists public.donations (
  id uuid primary key default uuid_generate_v4(),
  amount_usd numeric(10,2) not null,
  currency text not null default 'USD',
  recurrence text not null default 'once',
  purpose text not null,
  sponsor_tier text,
  status text not null default 'pending',
  stripe_payment_intent_id text,
  donor_email text,
  donor_name text,
  created_at timestamptz not null default now()
);

alter table public.donations enable row level security;

create policy "Anyone can insert donations"
  on public.donations for insert
  with check (true);

create policy "Only admins can view donations"
  on public.donations for select
  using (auth.role() = 'service_role');

-- Users/profiles (extended from Supabase Auth)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Only admins can view all profiles"
  on public.profiles for select
  using (auth.role() = 'service_role');

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
