import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useNotifications() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Request notification permission
  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("This browser does not support notifications");
      return false;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      toast.success("Notification permission granted!");
    } else {
      toast.error("Notification permission denied");
    }
    return permission === "granted";
  };

  // Send a task reminder notification
  const sendTaskReminder = (taskTitle: string, dueDate?: string) => {
    if (Notification.permission === "granted") {
      const message = dueDate ? `Reminder: "${taskTitle}" is due ${dueDate}` : `Reminder: "${taskTitle}" is due soon`;

      new Notification("Task Reminder", {
        body: message,
        tag: `task-reminder-${taskTitle}`,
      });
    }
  };

  // Get notification settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single();

      if (error) throw error;
      return data;
    },
  });

  // Update notification settings
  const updateSettings = useMutation({
    mutationFn: async (updates: any) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.from("user_settings").update(updates).eq("user_id", user.id).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
      toast.success("Notification settings updated");
    },
    onError: () => {
      toast.error("Failed to update notification settings");
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
    requestPermission,
    sendTaskReminder,
    hasPermission: typeof window !== "undefined" && Notification.permission === "granted",
  };
}
