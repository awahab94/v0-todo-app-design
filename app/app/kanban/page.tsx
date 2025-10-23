"use client"

import { KanbanBoard } from "@/components/kanban-board"

export default function KanbanPage() {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <p className="text-muted-foreground">Drag and drop tasks between columns</p>
      </div>

      <KanbanBoard />
    </div>
  )
}
