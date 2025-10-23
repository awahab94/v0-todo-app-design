"use client";

import { useUpcomingTasks } from "@/lib/hooks/use-filtered-tasks";
import { TaskGroup } from "@/components/task-group";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "@/components/task-form";
import type { Task } from "@/lib/types/database";
import { Skeleton } from "@/components/ui/skeleton";

export default function UpcomingPage() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { data: groupedTasks, isLoading } = useUpcomingTasks();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Skeleton className="mb-2 h-9 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="space-y-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Upcoming</h1>
        <p className="text-muted-foreground">Tasks scheduled for the coming weeks</p>
      </div>

      <div className="space-y-8">
        {groupedTasks && groupedTasks.length > 0 ? (
          groupedTasks.map(group => <TaskGroup key={group.label} title={group.label} tasks={group.tasks} onEditTask={setEditingTask} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-muted-foreground">No upcoming tasks</p>
            <p className="text-sm text-muted-foreground">Schedule tasks to see them here</p>
          </div>
        )}
      </div>

      <Dialog open={!!editingTask} onOpenChange={open => !open && setEditingTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && <TaskForm task={editingTask} onSuccess={() => setEditingTask(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
