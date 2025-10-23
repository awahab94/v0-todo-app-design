"use client";

import type { Task } from "@/lib/types/database";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MoreVertical, Trash2, Edit, Repeat, Bell, BellOff, Paperclip } from "lucide-react";
import { useUpdateTask, useDeleteTask } from "@/lib/hooks/use-tasks";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format, addHours } from "date-fns";
import { getRecurrenceDescription } from "@/lib/utils/rrule-helpers";
import { safeFormatDate } from "@/lib/utils/timezone-helpers";
import { useState } from "react";

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const toggleComplete = async () => {
    await updateTask.mutateAsync({
      id: task.id,
      updates: {
        status: task.status === "done" ? "todo" : "done",
        completed_at: task.status === "done" ? null : new Date().toISOString(),
      },
      originalTask: task,
    });
  };

  const handleDelete = async () => {
    await deleteTask.mutateAsync(task.id);
  };

  const handleSnooze = async (hours: number) => {
    const snoozeUntil = addHours(new Date(), hours);
    await updateTask.mutateAsync({
      id: task.id,
      updates: {
        snoozed_until: snoozeUntil.toISOString(),
      },
      originalTask: task,
    });
  };

  const handleUnsnooze = async () => {
    await updateTask.mutateAsync({
      id: task.id,
      updates: {
        snoozed_until: null,
      },
      originalTask: task,
    });
  };

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

  const isSnoozed = task.snoozed_until && new Date(task.snoozed_until) > new Date();

  return (
    <>
      <div className={cn("group flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent", task.status === "done" && "opacity-60", isSnoozed && "opacity-50")}>
        <Checkbox checked={task.status === "done"} onCheckedChange={toggleComplete} className="mt-1" />

        <div
          className="flex-1 space-y-2"
          onClick={() => {
            onEdit?.(task);
          }}
          role="button"
          tabIndex={0}>
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn("font-medium leading-tight cursor-pointer hover:text-primary", task.status === "done" && "line-through")}>{task.title}</h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    onEdit?.(task);
                  }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                {isSnoozed ? (
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      handleUnsnooze();
                    }}>
                    <BellOff className="mr-2 h-4 w-4" />
                    Unsnooze
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        handleSnooze(1);
                      }}>
                      <Bell className="mr-2 h-4 w-4" />
                      Snooze 1 hour
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        handleSnooze(3);
                      }}>
                      <Bell className="mr-2 h-4 w-4" />
                      Snooze 3 hours
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        handleSnooze(24);
                      }}>
                      <Bell className="mr-2 h-4 w-4" />
                      Snooze 1 day
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}

          <div className="flex flex-wrap items-center gap-2">
            {task.priority && (
              <Badge variant="secondary" className={getPriorityColor(task.priority)}>
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

            {task.recurrence_rule && (
              <Badge variant="outline" className="gap-1">
                <Repeat className="h-3 w-3" />
                {getRecurrenceDescription(task.recurrence_rule)}
              </Badge>
            )}

            {isSnoozed && (
              <Badge variant="outline" className="gap-1">
                <BellOff className="h-3 w-3" />
                Snoozed
              </Badge>
            )}

            {task.attachments && task.attachments.length > 0 && (
              <Badge variant="outline" className="gap-1">
                <Paperclip className="h-3 w-3" />
                {task.attachments.length}
              </Badge>
            )}

            {task.labels?.map(label => (
              <Badge key={label.id} variant="outline" style={{ borderColor: label.color, color: label.color }}>
                {label.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
