-- Schema for Urban Clean Hub MVP (fixed policies & triggers)
-- 1) Enums
create type public.app_role as enum ('ciudadano','supervisor','trabajador');
create type public.report_type as enum ('barrido','residuos_solidos','maleza');
create type public.report_status as enum ('pendiente','en_proceso','resuelto');
create type public.priority as enum ('baja','media','alta');
create type public.task_status as enum ('pendiente','en_proceso','completada');

-- 2) Utility function for updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

-- 3) Roles table and helper
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
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

-- 4) Profiles and trigger on auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  phone text,
  zone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5) Zones
create table public.zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  supervisor_id uuid references public.profiles(id) on delete set null,
  boundaries jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

-- 6) Reports
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  citizen_id uuid not null references public.profiles(id) on delete cascade,
  type public.report_type not null,
  description text,
  location_lat double precision not null,
  location_lng double precision not null,
  location_address text,
  photos text[] not null default '{}',
  status public.report_status not null default 'pendiente',
  priority public.priority not null default 'media',
  zone_id uuid references public.zones(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  assigned_by uuid references public.profiles(id) on delete set null,
  assigned_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7) Tasks
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  supervisor_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  type public.report_type not null,
  location_lat double precision not null,
  location_lng double precision not null,
  location_address text,
  status public.task_status not null default 'pendiente',
  priority public.priority not null default 'media',
  assigned_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8) Evidences (photos linked to tasks)
create table public.evidences (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now()
);

-- 9) Triggers for updated_at
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

create trigger trg_zones_updated_at
before update on public.zones
for each row execute function public.update_updated_at_column();

create trigger trg_reports_updated_at
before update on public.reports
for each row execute function public.update_updated_at_column();

create trigger trg_tasks_updated_at
before update on public.tasks
for each row execute function public.update_updated_at_column();

-- 10) Indexes
create index idx_reports_zone_status on public.reports (zone_id, status);
create index idx_reports_assigned_to on public.reports (assigned_to);
create index idx_tasks_worker_status on public.tasks (worker_id, status);
create index idx_tasks_report on public.tasks (report_id);

-- 11) RLS
alter table public.user_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.zones enable row level security;
alter table public.reports enable row level security;
alter table public.tasks enable row level security;
alter table public.evidences enable row level security;

-- user_roles policies
create policy "Users can view their roles"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid());

create policy "Users can set their own role (MVP)"
  on public.user_roles for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own roles (MVP)"
  on public.user_roles for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- profiles policies
create policy "Profiles viewable by authenticated"
  on public.profiles for select to authenticated using (true);

create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- zones policies
create policy "Zones are viewable by authenticated"
  on public.zones for select to authenticated using (true);

create policy "Supervisors can manage their zones"
  on public.zones for insert to authenticated
  with check (supervisor_id = auth.uid());

create policy "Supervisors can update their zones"
  on public.zones for update to authenticated
  using (public.is_zone_supervisor(auth.uid(), id))
  with check (public.is_zone_supervisor(auth.uid(), id));

-- reports policies
create policy "Citizens, workers and zone supervisors can view relevant reports"
  on public.reports for select to authenticated
  using (
    citizen_id = auth.uid()
    or assigned_to = auth.uid()
    or (zone_id is not null and public.is_zone_supervisor(auth.uid(), zone_id))
  );

create policy "Citizens can create their own reports"
  on public.reports for insert to authenticated
  with check (
    citizen_id = auth.uid() and public.has_role(auth.uid(), 'ciudadano')
  );

create policy "Authorized users can update relevant reports"
  on public.reports for update to authenticated
  using (
    citizen_id = auth.uid()
    or assigned_to = auth.uid()
    or (zone_id is not null and public.is_zone_supervisor(auth.uid(), zone_id))
  )
  with check (
    citizen_id = auth.uid()
    or assigned_to = auth.uid()
    or (zone_id is not null and public.is_zone_supervisor(auth.uid(), zone_id))
  );

-- tasks policies
create policy "Workers and supervisors can view tasks"
  on public.tasks for select to authenticated
  using (
    worker_id = auth.uid()
    or supervisor_id = auth.uid()
  );

create policy "Supervisors can create tasks"
  on public.tasks for insert to authenticated
  with check (
    supervisor_id = auth.uid() and public.has_role(auth.uid(), 'supervisor')
  );

create policy "Workers or supervisors can update tasks"
  on public.tasks for update to authenticated
  using (
    worker_id = auth.uid() or supervisor_id = auth.uid()
  )
  with check (
    worker_id = auth.uid() or supervisor_id = auth.uid()
  );

-- evidences policies
create policy "Workers and supervisors can view evidences of their tasks"
  on public.evidences for select to authenticated
  using (
    exists (
      select 1 from public.tasks t
      where t.id = evidences.task_id and (t.worker_id = auth.uid() or t.supervisor_id = auth.uid())
    )
  );

create policy "Assigned worker can upload evidences"
  on public.evidences for insert to authenticated
  with check (
    uploaded_by = auth.uid() and exists (
      select 1 from public.tasks t where t.id = evidences.task_id and t.worker_id = auth.uid()
    )
  );

-- 12) Storage buckets and policies
insert into storage.buckets (id, name, public)
values ('reports','reports', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('evidences','evidences', false)
on conflict (id) do nothing;

-- storage policies: reports (public read), evidences (private per user folder)
create policy "Public can view report images"
  on storage.objects for select to public
  using (bucket_id = 'reports');

create policy "Users can upload report images to their folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'reports' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their report images"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'reports' and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'reports' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view their own evidence images"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'evidences' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Workers can upload evidence images to their folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'evidences' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Workers can update their evidence images"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'evidences' and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'evidences' and auth.uid()::text = (storage.foldername(name))[1]
  );