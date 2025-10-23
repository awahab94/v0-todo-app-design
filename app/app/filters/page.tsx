"use client"

import { useSavedFilters, useCreateSavedFilter } from "@/lib/hooks/use-saved-filters"
import { SavedFilterCard } from "@/components/saved-filter-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function FiltersPage() {
  const { data: filters, isLoading } = useSavedFilters()
  const createFilter = useCreateSavedFilter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterName, setFilterName] = useState("")
  const [filterColor, setFilterColor] = useState("#3b82f6")

  const handleCreateFilter = async () => {
    if (!filterName.trim()) return

    await createFilter.mutateAsync({
      name: filterName,
      filter_query: {
        priority: "high",
        status: "todo",
      },
      color: filterColor,
    })

    setFilterName("")
    setFilterColor("#3b82f6")
    setIsDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Skeleton className="mb-2 h-9 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Smart Filters</h1>
          <p className="text-muted-foreground">Create custom views with saved filters</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Filter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Smart Filter</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="filter-name">Filter Name</Label>
                <Input
                  id="filter-name"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="e.g., High Priority Work Tasks"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-color">Color</Label>
                <Input
                  id="filter-color"
                  type="color"
                  value={filterColor}
                  onChange={(e) => setFilterColor(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateFilter} className="w-full" disabled={createFilter.isPending}>
                Create Filter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {filters && filters.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filters.map((filter) => (
            <SavedFilterCard key={filter.id} filter={filter} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg text-muted-foreground">No saved filters yet</p>
          <p className="text-sm text-muted-foreground">Create custom filters to organize your tasks</p>
        </div>
      )}
    </div>
  )
}
