import {
  startOfDay,
  startOfWeek,
  endOfWeek,
  addWeeks,
  isWithinInterval,
  isBefore,
  isToday,
  isTomorrow,
  isThisWeek,
  format,
} from "date-fns"

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false
  return isBefore(new Date(dueDate), startOfDay(new Date()))
}

export function isDueToday(dueDate: string | null): boolean {
  if (!dueDate) return false
  return isToday(new Date(dueDate))
}

export function isDueTomorrow(dueDate: string | null): boolean {
  if (!dueDate) return false
  return isTomorrow(new Date(dueDate))
}

export function isDueThisWeek(dueDate: string | null): boolean {
  if (!dueDate) return false
  return isThisWeek(new Date(dueDate), { weekStartsOn: 1 })
}

export function getWeekLabel(weekOffset: number): string {
  const date = addWeeks(new Date(), weekOffset)
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })

  if (weekOffset === 0) return "This Week"
  if (weekOffset === 1) return "Next Week"

  return `${format(start, "MMM d")} - ${format(end, "MMM d")}`
}

export function getWeekRange(weekOffset: number): { start: Date; end: Date } {
  const date = addWeeks(new Date(), weekOffset)
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  }
}

export function isInWeek(dueDate: string | null, weekOffset: number): boolean {
  if (!dueDate) return false
  const { start, end } = getWeekRange(weekOffset)
  return isWithinInterval(new Date(dueDate), { start, end })
}

export function groupTasksByDate(tasks: any[]) {
  const overdue: any[] = []
  const today: any[] = []
  const tomorrow: any[] = []
  const thisWeek: any[] = []
  const later: any[] = []
  const noDueDate: any[] = []

  tasks.forEach((task) => {
    if (!task.due_date) {
      noDueDate.push(task)
    } else if (isOverdue(task.due_date)) {
      overdue.push(task)
    } else if (isDueToday(task.due_date)) {
      today.push(task)
    } else if (isDueTomorrow(task.due_date)) {
      tomorrow.push(task)
    } else if (isDueThisWeek(task.due_date)) {
      thisWeek.push(task)
    } else {
      later.push(task)
    }
  })

  return { overdue, today, tomorrow, thisWeek, later, noDueDate }
}
