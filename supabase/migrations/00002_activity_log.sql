-- Activity log for admin actions
create table if not exists public.activity_log (
  id uuid primary key default uuid_generate_v4(),
  admin_email text not null,
  action text not null,
  details text,
  created_at timestamptz not null default now()
);

alter table public.activity_log enable row level security;

create policy "Only admins can view activity log"
  on public.activity_log for select
  using (auth.role() = 'service_role');

create policy "Only admins can insert activity log"
  on public.activity_log for insert
  with check (auth.role() = 'service_role');
