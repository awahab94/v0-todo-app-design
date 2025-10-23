"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTask, useUpdateTask } from "@/lib/hooks/use-tasks";
import { useLabels } from "@/lib/hooks/use-labels";
import type { Priority, Task } from "@/lib/types/database";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import { RecurrenceSelector } from "./recurrence-selector";
import { AttachmentUpload } from "./attachment-upload";
import { DateTimePicker } from "./date-time-picker";
import { toUTC, fromUTC } from "@/lib/utils/timezone-helpers";

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
  parentId?: string;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  due_date: string;
  due_time: string;
  label_ids: string[];
  recurrence_rule: string;
}

export function TaskForm({ task, onSuccess, parentId }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "",
      due_date: "",
      due_time: "",
      label_ids: task?.labels?.map(l => l.id) || [],
      recurrence_rule: task?.recurrence_rule || "",
    },
  });

  const [selectedLabels, setSelectedLabels] = useState<string[]>(task?.labels?.map(l => l.id) || []);
  const [dueDateTime, setDueDateTime] = useState<Date | undefined>(task?.due_date ? fromUTC(task.due_date) || undefined : undefined);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { data: labels } = useLabels();

  const onSubmit = async (data: TaskFormData) => {
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        due_date: toUTC(dueDateTime),
        due_time: dueDateTime ? dueDateTime.toTimeString().slice(0, 5) : null,
        label_ids: selectedLabels,
        recurrence_rule: data.recurrence_rule,
      };

      if (task) {
        await updateTask.mutateAsync({
          id: task.id,
          updates: {
            ...taskData,
            priority: taskData.priority as Priority,
          },
          originalTask: task,
        });
      } else {
        await createTask.mutateAsync({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority as Priority,
          due_date: taskData.due_date as string,
          due_time: taskData.due_time as string,
          parent_id: parentId,
          label_ids: taskData.label_ids,
          recurrence_rule: taskData.recurrence_rule,
        });
      }
      onSuccess?.();
    } catch (error) {
      console.error("[v0] Error saving task:", error);
    }
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev => (prev.includes(labelId) ? prev.filter(id => id !== labelId) : [...prev, labelId]));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title", { required: "Title is required" })} placeholder="Task title" />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} placeholder="Add details..." rows={3} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select defaultValue={task?.priority || ""} onValueChange={value => register("priority").onChange({ target: { value } })}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Due Date & Time</Label>
          <DateTimePicker value={dueDateTime} onChange={setDueDateTime} placeholder="Pick a date and time" />
        </div>
      </div>

      <RecurrenceSelector value={watch("recurrence_rule") || undefined} onChange={value => setValue("recurrence_rule", value || "")} />

      <div className="space-y-2">
        <Label>Labels</Label>
        <div className="flex flex-wrap gap-2">
          {labels?.map(label => {
            const isSelected = selectedLabels.includes(label.id);
            return (
              <Badge
                key={label.id}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer"
                style={
                  isSelected
                    ? {
                        backgroundColor: label.color,
                        borderColor: label.color,
                        color: "#ffffff",
                      }
                    : { borderColor: label.color, color: label.color }
                }
                onClick={() => toggleLabel(label.id)}>
                {label.name}
                {isSelected && <X className="ml-1 h-3 w-3" />}
              </Badge>
            );
          })}
        </div>
      </div>

      {task && (
        <div className="space-y-2">
          <Label>Attachments</Label>
          <AttachmentUpload taskId={task.id} />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={createTask.isPending || updateTask.isPending}>
          {task ? "Update" : "Create"} Task
        </Button>
      </div>
    </form>
  );
}
