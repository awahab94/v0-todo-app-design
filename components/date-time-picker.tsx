"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
}

export function DateTimePicker({ value, onChange, placeholder = "Pick a date and time" }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value)
  const [timeValue, setTimeValue] = useState<string>(value ? format(value, "HH:mm") : "")

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined)
      onChange(undefined)
      return
    }

    // Preserve the time if it exists
    if (timeValue) {
      const [hours, minutes] = timeValue.split(":").map(Number)
      date.setHours(hours, minutes, 0, 0)
    }

    setSelectedDate(date)
    onChange(date)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value
    setTimeValue(time)

    if (!selectedDate) return

    const [hours, minutes] = time.split(":").map(Number)
    const newDate = new Date(selectedDate)
    newDate.setHours(hours, minutes, 0, 0)

    setSelectedDate(newDate)
    onChange(newDate)
  }

  const handleClear = () => {
    setSelectedDate(undefined)
    setTimeValue("")
    onChange(undefined)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            <span>
              {format(selectedDate, "PPP")}
              {timeValue && ` at ${timeValue}`}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />

          <div className="space-y-2 border-t pt-3">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time
            </Label>
            <Input id="time" type="time" value={timeValue} onChange={handleTimeChange} className="w-full" />
          </div>

          <div className="flex gap-2 border-t pt-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleClear}>
              Clear
            </Button>
            <Button className="flex-1" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
