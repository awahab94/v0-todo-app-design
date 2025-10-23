"use client";

import { createClient } from "@/lib/supabase/client";
import type { Task, Label, Priority } from "@/lib/types/database";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTaskAlerts } from "./use-task-alerts";

export function useTasks(filters?: { status?: string; includeDeleted?: boolean }) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      let query = supabase
        .from("tasks")
        .select(
          `
          *,
          labels:task_labels(label:labels(*)),
          subtasks:tasks!parent_id(*),
          attachments(*)
        `,
        )
        .is("parent_id", null)
        .order("position", { ascending: true });

      if (!filters?.includeDeleted) {
        query = query.eq("is_deleted", false);
      }

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to flatten labels
      return (data || []).map((task: any) => ({
        ...task,
        labels: task.labels?.map((tl: { label: Label }) => tl.label) || [],
      })) as Task[];
    },
  });
}

export function useTask(taskId: string | null) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      if (!taskId) return null;

      const { data, error } = await supabase
        .from("tasks")
        .select(
          `
          *,
          labels:task_labels(label:labels(*)),
          subtasks:tasks!parent_id(*),
          attachments(*)
        `,
        )
        .eq("id", taskId)
        .single();

      if (error) throw error;

      return {
        ...data,
        labels: data.labels?.map((tl: { label: Label }) => tl.label) || [],
      } as Task;
    },
    enabled: !!taskId,
  });
}

export function useCreateTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { showTaskCreatedAlert, showTaskErrorAlert } = useTaskAlerts();

  return useMutation({
    mutationFn: async (task: {
      title: string;
      description?: string;
      status?: string;
      priority?: string;
      due_date?: string;
      due_time?: string;
      parent_id?: string;
      label_ids?: string[];
      recurrence_rule?: string | null;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          title: task.title,
          description: task.description,
          status: task.status || "todo",
          priority: task.priority && task.priority !== "" ? task.priority : null,
          due_date: task.due_date,
          due_time: task.due_time,
          parent_id: task.parent_id,
          recurrence_rule: task.recurrence_rule,
        })
        .select()
        .single();

      if (error) throw error;

      // Add labels if provided
      if (task.label_ids && task.label_ids.length > 0) {
        const labelInserts = task.label_ids.map(label_id => ({
          task_id: data.id,
          label_id,
        }));

        const { error: labelError } = await supabase.from("task_labels").insert(labelInserts);

        if (labelError) throw labelError;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showTaskCreatedAlert(data.title);
    },
    onError: (error) => {
      showTaskErrorAlert("create task", error.message);
    },
  });
}

export function useUpdateTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { 
    showTaskUpdatedAlert, 
    showTaskStatusChangeAlert, 
    showTaskPriorityChangeAlert,
    showTaskDueDateChangeAlert,
    showTaskErrorAlert 
  } = useTaskAlerts();

  return useMutation({
    mutationFn: async ({ id, updates, originalTask }: { 
      id: string; 
      updates: Partial<Task> & { label_ids?: string[] };
      originalTask?: Task;
    }) => {
      const { label_ids, ...taskUpdates } = updates;

      // Handle empty priority values
      const sanitizedUpdates = {
        ...taskUpdates,
        priority: taskUpdates.priority ? (taskUpdates.priority as Priority | null) : null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("tasks").update(sanitizedUpdates).eq("id", id).select().single();

      if (error) throw error;

      // Update labels if provided
      if (label_ids !== undefined) {
        // Delete existing labels
        await supabase.from("task_labels").delete().eq("task_id", id);

        // Insert new labels
        if (label_ids.length > 0) {
          const labelInserts = label_ids.map(label_id => ({
            task_id: id,
            label_id,
          }));

          const { error: labelError } = await supabase.from("task_labels").insert(labelInserts);

          if (labelError) throw labelError;
        }
      }

      return { data, originalTask };
    },
    onSuccess: ({ data, originalTask }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });

      // Show appropriate alerts based on what changed
      if (originalTask) {
        // Check for status change
        if (data.status !== originalTask.status) {
          showTaskStatusChangeAlert(data.title, originalTask.status, data.status);
        }
        
        // Check for priority change
        if (data.priority !== originalTask.priority) {
          showTaskPriorityChangeAlert(data.title, originalTask.priority, data.priority);
        }
        
        // Check for due date change
        if (data.due_date !== originalTask.due_date) {
          showTaskDueDateChangeAlert(data.title, originalTask.due_date, data.due_date);
        }
        
        // Show general update alert if no specific changes detected
        if (data.status === originalTask.status && 
            data.priority === originalTask.priority && 
            data.due_date === originalTask.due_date) {
          showTaskUpdatedAlert(data.title);
        }
      } else {
        // Fallback to general update alert if no original task provided
        showTaskUpdatedAlert(data.title);
      }
    },
    onError: (error) => {
      showTaskErrorAlert("update task", error.message);
    },
  });
}

export function useDeleteTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { showTaskDeletedAlert, showTaskErrorAlert } = useTaskAlerts();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tasks")
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // We'll show the alert with the task title if we can get it from cache
      const tasks = queryClient.getQueryData(["tasks"]) as Task[] | undefined;
      const task = tasks?.find(t => t.id === id);
      if (task) {
        showTaskDeletedAlert(task.title);
      }
    },
    onError: (error) => {
      showTaskErrorAlert("delete task", error.message);
    },
  });
}

export function useRestoreTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { showTaskRestoredAlert, showTaskErrorAlert } = useTaskAlerts();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tasks")
        .update({
          is_deleted: false,
          deleted_at: null,
        })
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // We'll show the alert with the task title if we can get it from cache
      const tasks = queryClient.getQueryData(["tasks"]) as Task[] | undefined;
      const task = tasks?.find(t => t.id === id);
      if (task) {
        showTaskRestoredAlert(task.title);
      }
    },
    onError: (error) => {
      showTaskErrorAlert("restore task", error.message);
    },
  });
}
