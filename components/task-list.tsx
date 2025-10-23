"use client"

import { useTasks } from "@/lib/hooks/use-tasks"
import { TaskItem } from "./task-item"
import { Skeleton } from "@/components/ui/skeleton"
import type { Task } from "@/lib/types/database"

interface TaskListProps {
  filters?: { status?: string; includeDeleted?: boolean }
  onEditTask?: (task: Task) => void
}

export function TaskList({ filters, onEditTask }: TaskListProps) {
  const { data: tasks, isLoading } = useTasks(filters)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No tasks found</p>
        <p className="text-sm text-muted-foreground">Create your first task to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={onEditTask} />
      ))}
    </div>
  )
}
