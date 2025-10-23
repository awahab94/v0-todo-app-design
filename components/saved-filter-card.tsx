"use client"

import type { SavedFilter } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Filter } from "lucide-react"
import { useDeleteSavedFilter } from "@/lib/hooks/use-saved-filters"
import Link from "next/link"

interface SavedFilterCardProps {
  filter: SavedFilter
}

export function SavedFilterCard({ filter }: SavedFilterCardProps) {
  const deleteFilter = useDeleteSavedFilter()

  const handleDelete = async () => {
    await deleteFilter.mutateAsync(filter.id)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Filter className="h-4 w-4" style={{ color: filter.color || undefined }} />
          {filter.name}
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
            {JSON.stringify(filter.filter_query, null, 2)}
          </pre>
        </div>
        <Link href={`/app/filters/${filter.id}`}>
          <Button variant="outline" size="sm" className="mt-3 w-full bg-transparent">
            View Tasks
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
