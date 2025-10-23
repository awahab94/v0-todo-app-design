"use client"

import { createClient } from "@/lib/supabase/client"
import type { UserSettings } from "@/lib/types/database"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useUserSettings() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()

      if (error) throw error
      return data as UserSettings
    },
  })
}

export function useUpdateUserSettings() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<UserSettings>) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("user_settings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] })
    },
  })
}
