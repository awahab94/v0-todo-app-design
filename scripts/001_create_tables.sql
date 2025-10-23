-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users profile table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create labels table
create table if not exists public.labels (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#3b82f6',
  created_at timestamp with time zone default now()
);

-- Create tasks table
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.tasks(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  priority text check (priority in ('low', 'medium', 'high')),
  due_date timestamp with time zone,
  due_time time,
  completed_at timestamp with time zone,
  is_deleted boolean default false,
  deleted_at timestamp with time zone,
  position integer not null default 0,
  recurrence_rule text, -- RRULE format
  recurrence_parent_id uuid references public.tasks(id) on delete set null,
  snoozed_until timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create task_labels junction table
create table if not exists public.task_labels (
  task_id uuid not null references public.tasks(id) on delete cascade,
  label_id uuid not null references public.labels(id) on delete cascade,
  primary key (task_id, label_id)
);

-- Create attachments table
create table if not exists public.attachments (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text,
  file_size integer,
  created_at timestamp with time zone default now()
);

-- Create saved_filters table (smart lists)
create table if not exists public.saved_filters (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  filter_query jsonb not null,
  icon text,
  color text,
  position integer not null default 0,
  created_at timestamp with time zone default now()
);

-- Create user_settings table
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text not null default 'light' check (theme in ('light', 'dark', 'system')),
  default_view text not null default 'today' check (default_view in ('today', 'upcoming', 'inbox', 'kanban', 'calendar')),
  quiet_hours_start time,
  quiet_hours_end time,
  email_digest_enabled boolean default true,
  email_digest_time time default '09:00:00',
  push_notifications_enabled boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.labels enable row level security;
alter table public.tasks enable row level security;
alter table public.task_labels enable row level security;
alter table public.attachments enable row level security;
alter table public.saved_filters enable row level security;
alter table public.user_settings enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Labels policies
create policy "Users can view their own labels"
  on public.labels for select
  using (auth.uid() = user_id);

create policy "Users can insert their own labels"
  on public.labels for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own labels"
  on public.labels for update
  using (auth.uid() = user_id);

create policy "Users can delete their own labels"
  on public.labels for delete
  using (auth.uid() = user_id);

-- Tasks policies
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- Task labels policies
create policy "Users can view their own task labels"
  on public.task_labels for select
  using (exists (
    select 1 from public.tasks
    where tasks.id = task_labels.task_id
    and tasks.user_id = auth.uid()
  ));

create policy "Users can insert their own task labels"
  on public.task_labels for insert
  with check (exists (
    select 1 from public.tasks
    where tasks.id = task_labels.task_id
    and tasks.user_id = auth.uid()
  ));

create policy "Users can delete their own task labels"
  on public.task_labels for delete
  using (exists (
    select 1 from public.tasks
    where tasks.id = task_labels.task_id
    and tasks.user_id = auth.uid()
  ));

-- Attachments policies
create policy "Users can view their own attachments"
  on public.attachments for select
  using (exists (
    select 1 from public.tasks
    where tasks.id = attachments.task_id
    and tasks.user_id = auth.uid()
  ));

create policy "Users can insert their own attachments"
  on public.attachments for insert
  with check (exists (
    select 1 from public.tasks
    where tasks.id = attachments.task_id
    and tasks.user_id = auth.uid()
  ));

create policy "Users can delete their own attachments"
  on public.attachments for delete
  using (exists (
    select 1 from public.tasks
    where tasks.id = attachments.task_id
    and tasks.user_id = auth.uid()
  ));

-- Saved filters policies
create policy "Users can view their own saved filters"
  on public.saved_filters for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved filters"
  on public.saved_filters for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own saved filters"
  on public.saved_filters for update
  using (auth.uid() = user_id);

create policy "Users can delete their own saved filters"
  on public.saved_filters for delete
  using (auth.uid() = user_id);

-- User settings policies
create policy "Users can view their own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_parent_id on public.tasks(parent_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_due_date on public.tasks(due_date);
create index if not exists idx_tasks_is_deleted on public.tasks(is_deleted);
create index if not exists idx_labels_user_id on public.labels(user_id);
create index if not exists idx_attachments_task_id on public.attachments(task_id);
create index if not exists idx_saved_filters_user_id on public.saved_filters(user_id);
