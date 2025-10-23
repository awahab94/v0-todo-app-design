"use client"

import { createClient } from "@/lib/supabase/client"
import type { SavedFilter } from "@/lib/types/database"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useSavedFilters() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["saved-filters"],
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_filters").select("*").order("position", { ascending: true })

      if (error) throw error
      return data as SavedFilter[]
    },
  })
}

export function useCreateSavedFilter() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (filter: {
      name: string
      filter_query: Record<string, unknown>
      icon?: string
      color?: string
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("saved_filters")
        .insert({
          user_id: user.id,
          name: filter.name,
          filter_query: filter.filter_query,
          icon: filter.icon,
          color: filter.color,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-filters"] })
    },
  })
}

export function useDeleteSavedFilter() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("saved_filters").delete().eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-filters"] })
    },
  })
}
