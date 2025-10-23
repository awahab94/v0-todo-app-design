/**
 * Timezone utility functions for handling UTC conversion
 * All dates are stored in UTC in the database and converted to local time for display
 */

/**
 * Convert a local date to UTC ISO string for database storage
 */
export function toUTC(date: Date | string | null | undefined): string | null {
  if (!date) return null

  const dateObj = typeof date === "string" ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return null

  return dateObj.toISOString()
}

/**
 * Convert a UTC ISO string from database to local Date object
 */
export function fromUTC(utcString: string | null | undefined): Date | null {
  if (!utcString) return null

  const date = new Date(utcString)

  if (isNaN(date.getTime())) return null

  return date
}

/**
 * Combine date and time strings into a single Date object in local timezone
 */
export function combineDateAndTime(dateString: string, timeString: string): Date {
  const date = new Date(dateString)

  if (timeString) {
    const [hours, minutes] = timeString.split(":").map(Number)
    date.setHours(hours, minutes, 0, 0)
  }

  return date
}

/**
 * Format a UTC date string to local date string (YYYY-MM-DD)
 */
export function formatDateForInput(utcString: string | null | undefined): string {
  if (!utcString) return ""

  const date = fromUTC(utcString)
  if (!date) return ""

  return date.toISOString().split("T")[0]
}

/**
 * Format a UTC date string to local time string (HH:MM)
 */
export function formatTimeForInput(utcString: string | null | undefined): string {
  if (!utcString) return ""

  const date = fromUTC(utcString)
  if (!date) return ""

  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  return `${hours}:${minutes}`
}

/**
 * Get the user's timezone offset in minutes
 */
export function getTimezoneOffset(): number {
  return new Date().getTimezoneOffset()
}

/**
 * Get the user's timezone name (e.g., "America/New_York")
 */
export function getTimezoneName(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}
