export type Priority = "low" | "medium" | "high"
export type TaskStatus = "todo" | "doing" | "done"
export type ViewType = "today" | "upcoming" | "inbox" | "kanban" | "calendar"
export type Theme = "light" | "dark" | "system"

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Label {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  parent_id: string | null
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority | null
  due_date: string | null
  due_time: string | null
  completed_at: string | null
  is_deleted: boolean
  deleted_at: string | null
  position: number
  recurrence_rule: string | null
  recurrence_parent_id: string | null
  snoozed_until: string | null
  created_at: string
  updated_at: string
  labels?: Label[]
  subtasks?: Task[]
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  task_id: string
  file_name: string
  file_url: string
  file_type: string | null
  file_size: number | null
  created_at: string
}

export interface SavedFilter {
  id: string
  user_id: string
  name: string
  filter_query: Record<string, unknown>
  icon: string | null
  color: string | null
  position: number
  created_at: string
}

export interface UserSettings {
  user_id: string
  theme: Theme
  default_view: ViewType
  quiet_hours_start: string | null
  quiet_hours_end: string | null
  email_digest_enabled: boolean
  email_digest_time: string
  push_notifications_enabled: boolean
  created_at: string
  updated_at: string
}
