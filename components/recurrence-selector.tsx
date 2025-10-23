"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { generateRRule, parseRRule, type RecurrenceFrequency } from "@/lib/utils/rrule-helpers";
import { useState } from "react";

interface RecurrenceSelectorProps {
  value?: string;
  onChange: (rrule: string | null) => void;
}

export function RecurrenceSelector({ value, onChange }: RecurrenceSelectorProps) {
  const [frequency, setFrequency] = useState<RecurrenceFrequency | "none">(value ? parseRRule(value)?.frequency || "none" : "none");
  const [selectedDays, setSelectedDays] = useState<number[]>(value ? parseRRule(value)?.daysOfWeek || [] : []);

  const handleFrequencyChange = (newFrequency: string) => {
    if (newFrequency === "none") {
      setFrequency("none");
      onChange(null);
      return;
    }

    const freq = newFrequency as RecurrenceFrequency;
    setFrequency(freq);

    const rrule = generateRRule({
      frequency: freq,
      interval: 1,
      daysOfWeek: freq === "weekly" ? selectedDays : undefined,
    });

    onChange(rrule);
  };

  const handleDayToggle = (day: number) => {
    const newDays = selectedDays.includes(day) ? selectedDays.filter(d => d !== day) : [...selectedDays, day];

    setSelectedDays(newDays);

    if (frequency === "weekly") {
      const rrule = generateRRule({
        frequency: "weekly",
        interval: 1,
        daysOfWeek: newDays,
      });
      onChange(rrule);
    }
  };

  console.log("frequency", value, frequency);

  const weekDays = [
    { label: "Sun", value: 0 },
    { label: "Mon", value: 1 },
    { label: "Tue", value: 2 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 4 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 6 },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Repeat</Label>
        <Select value={frequency} onValueChange={handleFrequencyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Does not repeat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Does not repeat</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {frequency === "weekly" && (
        <div className="space-y-2">
          <Label>Repeat on</Label>
          <div className="flex flex-wrap gap-2">
            {weekDays.map(day => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox id={`day-${day.value}`} checked={selectedDays.includes(day.value)} onCheckedChange={() => handleDayToggle(day.value)} />
                <label htmlFor={`day-${day.value}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {day.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
