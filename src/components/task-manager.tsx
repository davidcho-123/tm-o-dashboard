"use client"
import * as React from "react"
import { Task } from "@/lib/types"
import { TaskDialog } from "./task-dialog"
import { Button } from "@/components/ui/button"

export function TaskList({ tasks, onAddTask, onToggleTask, onDeleteTask }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <TaskDialog onAddTask={onAddTask} />
      </div>
      <div className="grid gap-2">
        {tasks.map((t: Task)=> (
          <div key={t.id} className="p-3 border rounded flex justify-between">
            <div>
              <div className={t.completed ? 'line-through' : ''}>{t.description}</div>
              <div className="text-xs">{t.priority} • {t.durationMinutes}m</div>
            </div>
            <div className="flex gap-2">
              <Button onClick={()=> onToggleTask?.(t.id)}>Toggle</Button>
              <Button onClick={()=> onDeleteTask?.(t.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
