"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Task } from "@/lib/types/database"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Repeat, Paperclip } from "lucide-react"
import { format } from "date-fns"
import { getRecurrenceDescription } from "@/lib/utils/rrule-helpers"
import { AttachmentUpload } from "./attachment-upload"
import { Separator } from "@/components/ui/separator"

interface TaskDetailDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {
  if (!task) return null

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-orange-500 text-white"
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Details */}
          <div className="space-y-4">
            {task.description && (
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-2">
              {task.priority && <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>}

              {task.due_date && (
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(task.due_date), "MMM d, yyyy")}
                </Badge>
              )}

              {task.due_time && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {task.due_time}
                </Badge>
              )}

              {task.recurrence_rule && (
                <Badge variant="outline" className="gap-1">
                  <Repeat className="h-3 w-3" />
                  {getRecurrenceDescription(task.recurrence_rule)}
                </Badge>
              )}
            </div>

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Labels</h4>
                <div className="flex flex-wrap gap-2">
                  {task.labels.map((label) => (
                    <Badge key={label.id} variant="outline" style={{ borderColor: label.color, color: label.color }}>
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Attachments */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Attachments
            </h4>
            <AttachmentUpload taskId={task.id} />
          </div>

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-3">
                  Subtasks ({task.subtasks.filter((st) => st.status === "done").length}/{task.subtasks.length})
                </h4>
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2 text-sm">
                      <div
                        className={`h-4 w-4 rounded border ${
                          subtask.status === "done" ? "bg-primary border-primary" : "border-muted-foreground"
                        }`}
                      />
                      <span className={subtask.status === "done" ? "line-through text-muted-foreground" : ""}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
