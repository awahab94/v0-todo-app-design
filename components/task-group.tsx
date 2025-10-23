import type React from "react"
import { TaskItem } from "./task-item"
import type { Task } from "@/lib/types/database"

interface TaskGroupProps {
  title: string
  tasks: Task[]
  onEditTask?: (task: Task) => void
  badge?: React.ReactNode
}

export function TaskGroup({ title, tasks, onEditTask, badge }: TaskGroupProps) {
  if (tasks.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {badge}
        <span className="text-sm text-muted-foreground">({tasks.length})</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  )
}
