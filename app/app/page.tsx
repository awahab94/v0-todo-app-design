"use client"

import { useTodayTasks } from "@/lib/hooks/use-filtered-tasks"
import { TaskGroup } from "@/components/task-group"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TaskForm } from "@/components/task-form"
import type { Task } from "@/lib/types/database"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

export default function TodayPage() {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { data: tasks, isLoading } = useTodayTasks()

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

  const overdueTasks = tasks?.filter((task) => {
    if (!task.due_date) return false
    return new Date(task.due_date) < new Date(new Date().setHours(0, 0, 0, 0))
  })

  const todayTasks = tasks?.filter((task) => {
    if (!task.due_date) return false
    const taskDate = new Date(task.due_date).setHours(0, 0, 0, 0)
    const today = new Date().setHours(0, 0, 0, 0)
    return taskDate === today
  })

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Today</h1>
        <p className="text-muted-foreground">Tasks due today and overdue items</p>
      </div>

      <div className="space-y-8">
        {overdueTasks && overdueTasks.length > 0 && (
          <TaskGroup
            title="Overdue"
            tasks={overdueTasks}
            onEditTask={setEditingTask}
            badge={
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Overdue
              </Badge>
            }
          />
        )}

        {todayTasks && todayTasks.length > 0 && (
          <TaskGroup title="Today" tasks={todayTasks} onEditTask={setEditingTask} />
        )}

        {(!tasks || tasks.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-muted-foreground">No tasks due today</p>
            <p className="text-sm text-muted-foreground">You're all caught up!</p>
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
