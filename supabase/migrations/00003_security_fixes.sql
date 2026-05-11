-- Add must_change_password column to profiles (previously done inline in login route)
alter table public.profiles add column if not exists must_change_password boolean not null default false;

-- Activity log is used by the admin panel (MySQL), not Supabase
-- Password resets and sessions are managed via MySQL

-- Rate limiting table is created dynamically in lib/rate-limit.ts
-- Password resets table is created dynamically in app/api/auth/forgot-password/route.ts
