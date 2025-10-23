-- Function to create default labels for new users
create or replace function public.create_default_labels(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.labels (user_id, name, color) values
    (p_user_id, 'work', '#3b82f6'),
    (p_user_id, 'personal', '#10b981'),
    (p_user_id, 'finance', '#f59e0b'),
    (p_user_id, 'health', '#ef4444'),
    (p_user_id, 'shopping', '#8b5cf6')
  on conflict do nothing;
end;
$$;
