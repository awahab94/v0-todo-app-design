"use client"

import type { Task, TaskStatus } from "@/lib/types/database"
import { useDroppable } from "@dnd-kit/core"
import { KanbanCard } from "./kanban-card"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  id: TaskStatus
  title: string
  color: string
  tasks: Task[]
}

export function KanbanColumn({ id, title, color, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-3 rounded-lg p-4 transition-colors",
          color,
          isOver && "ring-2 ring-primary ring-offset-2",
        )}
      >
        {tasks.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25">
            <p className="text-sm text-muted-foreground">Drop tasks here</p>
          </div>
        ) : (
          tasks.map((task) => <KanbanCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}
