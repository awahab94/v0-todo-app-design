"use client";

import { useTasks, useUpdateTask } from "@/lib/hooks/use-tasks";
import { useState } from "react";
import { startOfWeek, addDays, format, isSameDay, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types/database";
import { CalendarTaskCard } from "./calendar-task-card";
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { fromUTC, toUTC } from "@/lib/utils/timezone-helpers";

export function CalendarView() {
  const { data: tasks, isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const getTasksForDay = (day: Date) => {
    return (
      tasks?.filter(task => {
        if (!task.due_date || task.is_deleted) return false;

        // Convert UTC date to local date for comparison
        const taskDate = fromUTC(task.due_date);
        if (!taskDate) return false;

        // Compare only the date part (ignore time)
        return isSameDay(taskDate, day);
      }) || []
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks?.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const newDateString = over.id as string; // This is in "yyyy-MM-dd" format

    const task = tasks?.find(t => t.id === taskId);

    if (task && task.due_date !== newDateString) {
      // Convert the date string to a proper Date object in local timezone
      const newDate = new Date(newDateString + "T00:00:00");

      await updateTask.mutateAsync({
        id: taskId,
        updates: {
          due_date: toUTC(newDate),
        },
      });
    }

    setActiveTask(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-10 w-20 animate-pulse rounded bg-muted" />
            <div className="h-10 w-10 animate-pulse rounded bg-muted" />
            <div className="h-10 w-10 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-16 animate-pulse rounded bg-muted" />
              <div className="h-32 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {format(currentWeekStart, "MMMM yyyy")} - Week {format(currentWeekStart, "w")}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDays.map(day => {
            const dayTasks = getTasksForDay(day);
            const isToday = isSameDay(day, new Date());

            return <CalendarDay key={day.toISOString()} day={day} tasks={dayTasks} isToday={isToday} />;
          })}
        </div>
      </div>

      <DragOverlay>{activeTask ? <CalendarTaskCard task={activeTask} isDragging /> : null}</DragOverlay>
    </DndContext>
  );
}

interface CalendarDayProps {
  day: Date;
  tasks: Task[];
  isToday: boolean;
}

function CalendarDay({ day, tasks, isToday }: CalendarDayProps) {
  const dateString = format(startOfDay(day), "yyyy-MM-dd");
  const { setNodeRef, isOver } = useDroppable({
    id: dateString,
  });

  return (
    <div ref={setNodeRef} className={cn("flex min-h-[200px] flex-col rounded-lg border bg-card p-3 transition-colors", isOver && "ring-2 ring-primary ring-offset-2")}>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium", isToday && "bg-primary text-primary-foreground")}>{format(day, "d")}</div>
        </div>
        {tasks.length > 0 && <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">{tasks.length}</span>}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {tasks.map(task => (
          <CalendarTaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
