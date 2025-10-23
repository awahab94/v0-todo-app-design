"use client"

import type { Task } from "@/lib/types/database"
import { useDraggable } from "@dnd-kit/core"
import { Badge } from "@/components/ui/badge"
import { Clock, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarTaskCardProps {
  task: Task
  isDragging?: boolean
}

export function CalendarTaskCard({ task, isDragging }: CalendarTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isCurrentlyDragging,
  } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "high":
        return "border-l-destructive"
      case "medium":
        return "border-l-orange-500"
      case "low":
        return "border-l-blue-500"
      default:
        return "border-l-muted"
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group cursor-grab rounded border-l-4 bg-background p-2 text-xs shadow-sm transition-all hover:shadow-md active:cursor-grabbing",
        getPriorityColor(task.priority),
        (isDragging || isCurrentlyDragging) && "opacity-50",
        task.status === "done" && "opacity-60 line-through",
      )}
    >
      <div className="flex items-start gap-1">
        <div {...listeners} {...attributes} className="cursor-grab pt-0.5 active:cursor-grabbing">
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>

        <div className="flex-1 space-y-1">
          <p className="font-medium leading-tight">{task.title}</p>

          <div className="flex flex-wrap items-center gap-1">
            {task.due_time && (
              <div className="flex items-center gap-0.5 text-muted-foreground">
                <Clock className="h-2.5 w-2.5" />
                <span>{task.due_time}</span>
              </div>
            )}

            {task.labels && task.labels.length > 0 && (
              <div className="flex flex-wrap gap-0.5">
                {task.labels.slice(0, 2).map((label) => (
                  <Badge
                    key={label.id}
                    variant="outline"
                    className="h-4 px-1 text-[10px]"
                    style={{ borderColor: label.color, color: label.color }}
                  >
                    {label.name}
                  </Badge>
                ))}
                {task.labels.length > 2 && <span className="text-muted-foreground">+{task.labels.length - 2}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
