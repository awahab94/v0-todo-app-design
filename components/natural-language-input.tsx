"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { parseNaturalLanguage } from "@/lib/utils/natural-language-parser"
import { useCreateTask } from "@/lib/hooks/use-tasks"
import { useLabels } from "@/lib/hooks/use-labels"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Flag, Tag, Sparkles } from "lucide-react"
import { format } from "date-fns"

export function NaturalLanguageInput() {
  const [input, setInput] = useState("")
  const [preview, setPreview] = useState<ReturnType<typeof parseNaturalLanguage> | null>(null)
  const createTask = useCreateTask()
  const { data: labels } = useLabels()

  const handleInputChange = (value: string) => {
    setInput(value)
    if (value.trim()) {
      const parsed = parseNaturalLanguage(value)
      setPreview(parsed)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const parsed = parseNaturalLanguage(input)

    // Map label names to label IDs
    const labelIds =
      parsed.labels
        ?.map((labelName) => {
          const label = labels?.find((l) => l.name.toLowerCase() === labelName.toLowerCase())
          return label?.id
        })
        .filter(Boolean) || []

    await createTask.mutateAsync({
      title: parsed.title,
      due_date: parsed.due_date ? format(new Date(parsed.due_date), "yyyy-MM-dd") : undefined,
      due_time: parsed.due_time,
      priority: parsed.priority,
      label_ids: labelIds as string[],
    })

    setInput("")
    setPreview(null)
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Try: Pay rent tomorrow 9am #finance !high"
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={!input.trim() || createTask.isPending}>
          Add Task
        </Button>
      </form>

      {preview && preview.title && (
        <div className="rounded-lg border bg-muted/50 p-3">
          <div className="mb-2 text-sm font-medium">Preview:</div>
          <div className="space-y-2">
            <div className="font-medium">{preview.title}</div>
            <div className="flex flex-wrap gap-2">
              {preview.due_date && (
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(preview.due_date), "MMM d, yyyy")}
                </Badge>
              )}
              {preview.due_time && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {preview.due_time}
                </Badge>
              )}
              {preview.priority && (
                <Badge variant="outline" className="gap-1">
                  <Flag className="h-3 w-3" />
                  {preview.priority}
                </Badge>
              )}
              {preview.labels?.map((label) => (
                <Badge key={label} variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
