import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const supabase = createBrowserClient()

export function useAttachments(taskId: string) {
  const queryClient = useQueryClient()

  // Fetch attachments for a task
  const { data: attachments, isLoading } = useQuery({
    queryKey: ["attachments", taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attachments")
        .select("*")
        .eq("task_id", taskId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!taskId,
  })

  // Upload attachment
  const uploadAttachment = useMutation({
    mutationFn: async ({ file, taskId }: { file: File; taskId: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${taskId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("attachments").upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("attachments").getPublicUrl(fileName)

      // Create attachment record
      const { data, error } = await supabase
        .from("attachments")
        .insert({
          task_id: taskId,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", taskId] })
      toast.success("File uploaded successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload file")
    },
  })

  // Delete attachment
  const deleteAttachment = useMutation({
    mutationFn: async (attachmentId: string) => {
      const { error } = await supabase.from("attachments").delete().eq("id", attachmentId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", taskId] })
      toast.success("Attachment deleted")
    },
    onError: () => {
      toast.error("Failed to delete attachment")
    },
  })

  return {
    attachments,
    isLoading,
    uploadAttachment: uploadAttachment.mutate,
    deleteAttachment: deleteAttachment.mutate,
    isUploading: uploadAttachment.isPending,
  }
}
