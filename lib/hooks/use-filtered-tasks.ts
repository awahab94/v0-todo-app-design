"use client"

import { useTasks } from "./use-tasks"
import { isOverdue, isDueToday, isInWeek } from "@/lib/utils/date-helpers"
import { useMemo } from "react"

export function useTodayTasks() {
  const { data: tasks, isLoading } = useTasks()

  const filteredTasks = useMemo(() => {
    if (!tasks) return []
    return tasks.filter((task) => task.status !== "done" && (isDueToday(task.due_date) || isOverdue(task.due_date)))
  }, [tasks])

  return { data: filteredTasks, isLoading }
}

export function useUpcomingTasks() {
  const { data: tasks, isLoading } = useTasks()

  const groupedTasks = useMemo(() => {
    if (!tasks) return []

    const weeks: { label: string; tasks: any[] }[] = []
    const incompleteTasks = tasks.filter((task) => task.status !== "done" && task.due_date)

    // Group by next 4 weeks
    for (let i = 0; i < 4; i++) {
      const weekTasks = incompleteTasks.filter((task) => isInWeek(task.due_date, i))
      if (weekTasks.length > 0) {
        weeks.push({
          label: i === 0 ? "This Week" : i === 1 ? "Next Week" : `Week ${i + 1}`,
          tasks: weekTasks,
        })
      }
    }

    return weeks
  }, [tasks])

  return { data: groupedTasks, isLoading }
}

export function useInboxTasks() {
  const { data: tasks, isLoading } = useTasks()

  const filteredTasks = useMemo(() => {
    if (!tasks) return []
    return tasks.filter((task) => task.status !== "done" && !task.due_date)
  }, [tasks])

  return { data: filteredTasks, isLoading }
}

export function useCompletedTasks() {
  const { data: tasks, isLoading } = useTasks()

  const filteredTasks = useMemo(() => {
    if (!tasks) return []
    return tasks.filter((task) => task.status === "done")
  }, [tasks])

  return { data: filteredTasks, isLoading }
}
