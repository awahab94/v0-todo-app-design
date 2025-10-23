"use client"

import { CalendarView } from "@/components/calendar-view"

export default function CalendarPage() {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">View and organize tasks by date</p>
      </div>

      <CalendarView />
    </div>
  )
}
