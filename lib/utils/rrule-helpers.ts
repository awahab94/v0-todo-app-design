export type RecurrenceFrequency = "daily" | "weekly" | "monthly"

export interface RecurrenceRule {
  frequency: RecurrenceFrequency
  interval: number
  daysOfWeek?: number[] // 0-6, where 0 is Sunday
  dayOfMonth?: number
}

export function generateRRule(rule: RecurrenceRule): string {
  const parts = [`FREQ=${rule.frequency.toUpperCase()}`]

  if (rule.interval > 1) {
    parts.push(`INTERVAL=${rule.interval}`)
  }

  if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
    const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]
    const selectedDays = rule.daysOfWeek.map((d) => days[d]).join(",")
    parts.push(`BYDAY=${selectedDays}`)
  }

  if (rule.dayOfMonth) {
    parts.push(`BYMONTHDAY=${rule.dayOfMonth}`)
  }

  return parts.join(";")
}

export function parseRRule(rrule: string): RecurrenceRule | null {
  try {
    const parts = rrule.split(";")
    const rule: Partial<RecurrenceRule> = {}

    for (const part of parts) {
      const [key, value] = part.split("=")

      if (key === "FREQ") {
        rule.frequency = value.toLowerCase() as RecurrenceFrequency
      } else if (key === "INTERVAL") {
        rule.interval = Number.parseInt(value)
      } else if (key === "BYDAY") {
        const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]
        rule.daysOfWeek = value.split(",").map((d) => days.indexOf(d))
      } else if (key === "BYMONTHDAY") {
        rule.dayOfMonth = Number.parseInt(value)
      }
    }

    if (!rule.frequency) return null

    return {
      frequency: rule.frequency,
      interval: rule.interval || 1,
      daysOfWeek: rule.daysOfWeek,
      dayOfMonth: rule.dayOfMonth,
    }
  } catch {
    return null
  }
}

export function getRecurrenceDescription(rrule: string): string {
  const rule = parseRRule(rrule)
  if (!rule) return "Custom recurrence"

  const { frequency, interval, daysOfWeek } = rule

  if (frequency === "daily") {
    return interval === 1 ? "Daily" : `Every ${interval} days`
  }

  if (frequency === "weekly") {
    if (interval === 1 && !daysOfWeek) return "Weekly"
    if (daysOfWeek && daysOfWeek.length > 0) {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const days = daysOfWeek.map((d) => dayNames[d]).join(", ")
      return `Weekly on ${days}`
    }
    return `Every ${interval} weeks`
  }

  if (frequency === "monthly") {
    return interval === 1 ? "Monthly" : `Every ${interval} months`
  }

  return "Custom recurrence"
}
