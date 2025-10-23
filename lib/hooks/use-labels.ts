"use client"

import { createClient } from "@/lib/supabase/client"
import type { Label } from "@/lib/types/database"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useLabels() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["labels"],
    queryFn: async () => {
      const { data, error } = await supabase.from("labels").select("*").order("name", { ascending: true })

      if (error) throw error
      return data as Label[]
    },
  })
}

export function useCreateLabel() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (label: { name: string; color: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("labels")
        .insert({
          user_id: user.id,
          name: label.name,
          color: label.color,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] })
    },
  })
}

export function useUpdateLabel() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Label> }) => {
      const { data, error } = await supabase.from("labels").update(updates).eq("id", id).select().single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] })
    },
  })
}

export function useDeleteLabel() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("labels").delete().eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] })
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}
