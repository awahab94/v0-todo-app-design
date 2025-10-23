import { addDays, addWeeks, addMonths, startOfDay } from "date-fns"
import { toUTC } from "./timezone-helpers"

export interface ParsedTask {
  title: string
  due_date?: string
  due_time?: string
  priority?: "low" | "medium" | "high"
  labels?: string[]
}

export function parseNaturalLanguage(input: string): ParsedTask {
  let title = input
  let due_date: string | undefined
  let due_time: string | undefined
  let priority: "low" | "medium" | "high" | undefined
  const labels: string[] = []

  // Extract priority (!high, !medium, !low)
  const priorityMatch = input.match(/!(high|medium|low)/i)
  if (priorityMatch) {
    priority = priorityMatch[1].toLowerCase() as "low" | "medium" | "high"
    title = title.replace(priorityMatch[0], "").trim()
  }

  // Extract labels (#label)
  const labelMatches = input.matchAll(/#(\w+)/g)
  for (const match of labelMatches) {
    labels.push(match[1].toLowerCase())
    title = title.replace(match[0], "").trim()
  }

  // Extract date and time patterns
  const now = new Date()

  // Time patterns (9am, 14:30, 2:30pm)
  const timeMatch = input.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i)
  if (timeMatch) {
    let hours = Number.parseInt(timeMatch[1])
    const minutes = timeMatch[2] ? Number.parseInt(timeMatch[2]) : 0
    const meridiem = timeMatch[3]?.toLowerCase()

    if (meridiem === "pm" && hours < 12) hours += 12
    if (meridiem === "am" && hours === 12) hours = 0

    due_time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    title = title.replace(timeMatch[0], "").trim()
  }

  // Date patterns
  if (/\btoday\b/i.test(input)) {
    due_date = toUTC(startOfDay(now)) || undefined
    title = title.replace(/\btoday\b/i, "").trim()
  } else if (/\btomorrow\b/i.test(input)) {
    due_date = toUTC(startOfDay(addDays(now, 1))) || undefined
    title = title.replace(/\btomorrow\b/i, "").trim()
  } else if (/\bnext week\b/i.test(input)) {
    due_date = toUTC(startOfDay(addWeeks(now, 1))) || undefined
    title = title.replace(/\bnext week\b/i, "").trim()
  } else if (/\bnext month\b/i.test(input)) {
    due_date = toUTC(startOfDay(addMonths(now, 1))) || undefined
    title = title.replace(/\bnext month\b/i, "").trim()
  } else {
    // Try to parse specific dates (e.g., "Dec 25", "12/25", "2024-12-25")
    const dateMatch = input.match(/\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?\b/)
    if (dateMatch) {
      const month = Number.parseInt(dateMatch[1]) - 1
      const day = Number.parseInt(dateMatch[2])
      const year = dateMatch[3] ? Number.parseInt(dateMatch[3]) : now.getFullYear()
      const parsedDate = new Date(year, month, day)
      if (!isNaN(parsedDate.getTime())) {
        due_date = toUTC(startOfDay(parsedDate)) || undefined
        title = title.replace(dateMatch[0], "").trim()
      }
    }
  }

  // Clean up extra spaces
  title = title.replace(/\s+/g, " ").trim()

  return {
    title,
    due_date,
    due_time,
    priority,
    labels: labels.length > 0 ? labels : undefined,
  }
}
