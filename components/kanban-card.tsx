"use client";

import type React from "react";

import type { Task } from "@/lib/types/database";
import { useDraggable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { safeFormatDate } from "@/lib/utils/timezone-helpers";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { useDeleteTask } from "@/lib/hooks/use-tasks";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "./task-form";

interface KanbanCardProps {
  task: Task;
  isDragging?: boolean;
}

export function KanbanCard({ task, isDragging }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isCurrentlyDragging,
  } = useDraggable({
    id: task.id,
  });
  const deleteTask = useDeleteTask();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-orange-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteTask.mutateAsync(task.id);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn("group cursor-grab rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md active:cursor-grabbing", (isDragging || isCurrentlyDragging) && "opacity-50")}>
        <div className="flex items-start gap-2">
          <div {...listeners} {...attributes} className="cursor-grab pt-1 active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium leading-tight">{task.title}</h3>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      setIsEditDialogOpen(true);
                    }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {task.description && <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>}

            <div className="flex flex-wrap items-center gap-2">
              {task.priority && (
                <Badge variant="secondary" className={cn("text-xs", getPriorityColor(task.priority))}>
                  {task.priority}
                </Badge>
              )}

              {task.due_date && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {safeFormatDate(task.due_date, "MMM d")}
                </div>
              )}

              {task.due_time && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {task.due_time}
                </div>
              )}
            </div>

            {task.labels && task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.labels.map(label => (
                  <Badge key={label.id} variant="outline" className="text-xs" style={{ borderColor: label.color, color: label.color }}>
                    {label.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm task={task} onSuccess={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
