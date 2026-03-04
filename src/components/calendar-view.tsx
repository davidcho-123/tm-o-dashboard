"use client"

import * as React from "react"
import { Task } from "@/lib/types"
import { format, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface Props { tasks: Task[], onToggleTask?: (id:string)=>void }

export function TaskCalendar({ tasks, onToggleTask }: Props) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const start = startOfWeek(startOfMonth(currentMonth))
  const end = endOfWeek(endOfMonth(currentMonth))
  const days = eachDayOfInterval({ start, end })

  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const selectedTasks = tasks.filter(t=> isSameDay(t.dueDate, selectedDate))

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{format(currentMonth,'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <Button onClick={()=> setCurrentMonth(d=> new Date(d.getFullYear(), d.getMonth()-1))}>Prev</Button>
          <Button onClick={()=> setCurrentMonth(d=> new Date(d.getFullYear(), d.getMonth()+1))}>Next</Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d,i)=> (
          <div key={i} className="p-2 border rounded" onClick={()=> setSelectedDate(d)}>
            <div className="text-sm font-bold">{format(d,"d")}</div>
            <div className="text-xs mt-2">{tasks.filter(t=> isSameDay(t.dueDate, d)).length} tasks</div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="font-bold">Tasks on {format(selectedDate,'MMM d')}</h3>
        <div className="grid gap-2 mt-2">
          {selectedTasks.length ? selectedTasks.map(t=> (
            <div key={t.id} className="p-2 border rounded flex justify-between items-center">
              <div>
                <div className={t.completed ? 'line-through' : ''}>{t.description}</div>
                <div className="text-xs">{t.durationMinutes} min</div>
              </div>
              <div onClick={(e)=>{ e.stopPropagation(); onToggleTask?.(t.id); }}>
                <Checkbox checked={t.completed} />
              </div>
            </div>
          )) : <div className="p-4 text-sm text-muted">No tasks</div>}
        </div>
      </div>
    </div>
  )
}
