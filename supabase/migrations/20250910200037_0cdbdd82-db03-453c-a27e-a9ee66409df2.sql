-- Schema for Urban Clean Hub MVP - Final tables and policies
-- 1) Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  phone text,
  zone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) User roles using existing enum
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- 3) Zones table
create table if not exists public.zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  supervisor_id uuid references public.profiles(id) on delete set null,
  boundaries jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4) Reports table
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  citizen_id uuid not null references public.profiles(id) on delete cascade,
  type report_type not null,
  description text,
  location_lat double precision not null,
  location_lng double precision not null,
  location_address text,
  photos text[] not null default '{}',
  status report_status not null default 'pendiente',
  priority priority not null default 'media',
  zone_id uuid references public.zones(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  assigned_by uuid references public.profiles(id) on delete set null,
  assigned_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5) Tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  supervisor_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  type report_type not null,
  location_lat double precision not null,
  location_lng double precision not null,
  location_address text,
  status task_status not null default 'pendiente',
  priority priority not null default 'media',
  assigned_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6) Evidences table
create table if not exists public.evidences (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now()
);

-- 7) Helper functions
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = _user_id and ur.role = _role
  );
$$;

create or replace function public.is_zone_supervisor(_user_id uuid, _zone_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.zones z
    where z.id = _zone_id and z.supervisor_id = _user_id
  );
$$;

-- 8) Auto-create profile trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 9) Updated_at trigger function
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

-- 10) Apply triggers
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_zones_updated_at on public.zones;
create trigger trg_zones_updated_at
before update on public.zones
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_reports_updated_at on public.reports;
create trigger trg_reports_updated_at
before update on public.reports
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
before update on public.tasks
for each row execute function public.update_updated_at_column();

-- 11) Indexes
create index if not exists idx_reports_zone_status on public.reports (zone_id, status);
create index if not exists idx_reports_assigned_to on public.reports (assigned_to);
create index if not exists idx_tasks_worker_status on public.tasks (worker_id, status);
create index if not exists idx_tasks_report on public.tasks (report_id);

-- 12) Enable RLS
alter table public.user_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.zones enable row level security;
alter table public.reports enable row level security;
alter table public.tasks enable row level security;
alter table public.evidences enable row level security;

-- 13) Storage buckets
insert into storage.buckets (id, name, public)
values ('reports','reports', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('evidences','evidences', false)
on conflict (id) do nothing;