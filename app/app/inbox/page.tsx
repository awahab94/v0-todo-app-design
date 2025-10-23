"use client"

import { useInboxTasks } from "@/lib/hooks/use-filtered-tasks"
import { TaskItem } from "@/components/task-item"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TaskForm } from "@/components/task-form"
import type { Task } from "@/lib/types/database"
import { Skeleton } from "@/components/ui/skeleton"

export default function InboxPage() {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { data: tasks, isLoading } = useInboxTasks()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Skeleton className="mb-2 h-9 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Inbox</h1>
        <p className="text-muted-foreground">Tasks without a due date</p>
      </div>

      <div className="space-y-3">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => <TaskItem key={task.id} task={task} onEdit={setEditingTask} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-muted-foreground">Your inbox is empty</p>
            <p className="text-sm text-muted-foreground">Tasks without due dates will appear here</p>
          </div>
        )}
      </div>

      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && <TaskForm task={editingTask} onSuccess={() => setEditingTask(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
