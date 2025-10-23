"use client";

import { toast } from "sonner";
import { useNotifications } from "./use-notifications";
import type { Task } from "@/lib/types/database";

interface TaskAlertOptions {
  showToast?: boolean;
  showBrowserNotification?: boolean;
  showStatusChangeAlert?: boolean;
}

export function useTaskAlerts() {
  const { sendTaskReminder, hasPermission } = useNotifications();

  const showTaskAlert = (message: string, type: "success" | "error" | "info" | "warning" = "success", options: TaskAlertOptions = {}) => {
    const { showToast = true, showBrowserNotification = false } = options;

    // Show toast notification using sonner
    if (showToast) {
      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "warning":
          toast.warning(message);
          break;
        case "info":
        default:
          toast.info(message);
          break;
      }
    }

    // Show browser notification if enabled and permission granted
    if (showBrowserNotification && hasPermission) {
      new Notification("TaskFlow Alert", {
        body: message,
        tag: "task-alert",
      });
    }
  };

  const showTaskCreatedAlert = (taskTitle: string, options: TaskAlertOptions = {}) => {
    showTaskAlert(`Task "${taskTitle}" created successfully!`, "success", options);
  };

  const showTaskUpdatedAlert = (taskTitle: string, options: TaskAlertOptions = {}) => {
    showTaskAlert(`Task "${taskTitle}" updated successfully!`, "success", options);
  };

  const showTaskDeletedAlert = (taskTitle: string, options: TaskAlertOptions = {}) => {
    showTaskAlert(`Task "${taskTitle}" moved to trash!`, "info", options);
  };

  const showTaskRestoredAlert = (taskTitle: string, options: TaskAlertOptions = {}) => {
    showTaskAlert(`Task "${taskTitle}" restored from trash!`, "success", options);
  };

  const showTaskStatusChangeAlert = (taskTitle: string, oldStatus: string, newStatus: string, options: TaskAlertOptions = {}) => {
    const statusLabels = {
      todo: "To Do",
      in_progress: "In Progress",
      completed: "Completed",
    };

    const oldLabel = statusLabels[oldStatus as keyof typeof statusLabels] || oldStatus;
    const newLabel = statusLabels[newStatus as keyof typeof statusLabels] || newStatus;

    const message = `Task "${taskTitle}" status changed from ${oldLabel} to ${newLabel}`;

    showTaskAlert(message, "info", { ...options, showStatusChangeAlert: true });

    // Special handling for completed tasks
    if (newStatus === "completed") {
      showTaskAlert(`🎉 Congratulations! You completed "${taskTitle}"`, "success", { ...options, showBrowserNotification: true });
    }
  };

  const showTaskPriorityChangeAlert = (taskTitle: string, oldPriority: string | null, newPriority: string | null, options: TaskAlertOptions = {}) => {
    const priorityLabels = {
      low: "Low",
      medium: "Medium",
      high: "High",
    };

    const oldLabel = oldPriority ? priorityLabels[oldPriority as keyof typeof priorityLabels] || oldPriority : "None";
    const newLabel = newPriority ? priorityLabels[newPriority as keyof typeof priorityLabels] || newPriority : "None";

    const message = `Task "${taskTitle}" priority changed from ${oldLabel} to ${newLabel}`;
    showTaskAlert(message, "info", options);
  };

  const showTaskDueDateChangeAlert = (taskTitle: string, oldDueDate: string | null, newDueDate: string | null, options: TaskAlertOptions = {}) => {
    const formatDate = (date: string | null) => {
      if (!date) return "No due date";
      return new Date(date).toLocaleDateString();
    };

    const message = `Task "${taskTitle}" due date changed from ${formatDate(oldDueDate)} to ${formatDate(newDueDate)}`;
    showTaskAlert(message, "info", options);
  };

  const showTaskErrorAlert = (operation: string, error: string, options: TaskAlertOptions = {}) => {
    showTaskAlert(`Failed to ${operation}: ${error}`, "error", options);
  };

  const showTaskReminderAlert = (taskTitle: string, dueDate?: string) => {
    if (hasPermission) {
      sendTaskReminder(taskTitle, dueDate);
    }
  };

  return {
    showTaskAlert,
    showTaskCreatedAlert,
    showTaskUpdatedAlert,
    showTaskDeletedAlert,
    showTaskRestoredAlert,
    showTaskStatusChangeAlert,
    showTaskPriorityChangeAlert,
    showTaskDueDateChangeAlert,
    showTaskErrorAlert,
    showTaskReminderAlert,
  };
}
