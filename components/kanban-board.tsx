"use client"

import { useTasks, useUpdateTask } from "@/lib/hooks/use-tasks"
import type { Task, TaskStatus } from "@/lib/types/database"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { useState } from "react"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "To Do", color: "bg-slate-100 dark:bg-slate-800" },
  { id: "doing", title: "Doing", color: "bg-blue-100 dark:bg-blue-900/20" },
  { id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900/20" },
]

export function KanbanBoard() {
  const { data: tasks, isLoading } = useTasks()
  const updateTask = useUpdateTask()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks?.find((t) => t.id === event.active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveTask(null)
      return
    }

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    const task = tasks?.find((t) => t.id === taskId)

    if (task && task.status !== newStatus) {
      await updateTask.mutateAsync({
        id: taskId,
        updates: {
          status: newStatus,
          completed_at: newStatus === "done" ? new Date().toISOString() : null,
        },
      })
    }

    setActiveTask(null)
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks?.filter((task) => task.status === status && !task.is_deleted) || []
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="h-10 w-32 animate-pulse rounded bg-muted" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            tasks={getTasksByStatus(column.id)}
          />
        ))}
      </div>

      <DragOverlay>{activeTask ? <KanbanCard task={activeTask} isDragging /> : null}</DragOverlay>
    </DndContext>
  )
}
