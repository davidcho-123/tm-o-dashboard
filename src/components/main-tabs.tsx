"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Wand2, Moon, Sun, BrainCircuit, LayoutDashboard } from "lucide-react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { TaskCalendar } from "@/components/calendar-view"
import { TaskList } from "@/components/task-manager"
import { AIAdvisor } from "@/components/ai-advisor"
import { AIScheduler } from "@/components/ai-scheduler"
import { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"

export function MainTabs() {
  const [activeTab, setActiveTab] = React.useState("calendar")
  const [mounted, setMounted] = React.useState(false)
  const [tasks, setTasks] = React.useState<Task[]>([])

  React.useEffect(() => {
    setMounted(true)
    const storedTasks = [
      { id: '1', description: 'Design Landing Page', dueDate: new Date(), priority: 'high', completed: false, durationMinutes: 120 },
      { id: '2', description: 'Weekly Team Meeting', dueDate: new Date(), priority: 'medium', completed: true, durationMinutes: 60 },
      { id: '3', description: 'Refactor Auth logic', dueDate: new Date(), priority: 'medium', completed: false, durationMinutes: 90 },
      { id: '4', description: 'Plan Weekend Trip', dueDate: new Date(Date.now() + 86400000), priority: 'low', completed: false, durationMinutes: 45 },
    ]
    setTasks(storedTasks)
  }, [])

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const addTask = (newTask: Omit<Task,'id'|'completed'>) => {
    setTasks(prev => [...prev, {...newTask, id: Math.random().toString(36).slice(2,9), completed: false}])
  }

  const deleteTask = (id: string) => setTasks(prev => prev.filter(t=> t.id !== id))

  if (!mounted) return null

  return (
    <div className="flex min-h-screen w-full">
      <div className="w-80 p-4 border-r">
        <div className="mb-4">TM&O</div>
        <div className="flex flex-col gap-2">
          <Button onClick={()=> setActiveTab('calendar')}>Calendar</Button>
          <Button onClick={()=> setActiveTab('tasks')}>Tasks</Button>
          <Button onClick={()=> setActiveTab('scheduler')}>Scheduler</Button>
          <Button onClick={()=> setActiveTab('assistant')}>Assistant</Button>
        </div>
      </div>
      <main className="flex-1 p-6">
        {activeTab === 'calendar' && <TaskCalendar tasks={tasks} onToggleTask={toggleTask} />}
        {activeTab === 'tasks' && <TaskList tasks={tasks} onAddTask={addTask} onToggleTask={toggleTask} onDeleteTask={deleteTask} />}
        {activeTab === 'scheduler' && <AIScheduler tasks={tasks.filter(t=> !t.completed)} />}
        {activeTab === 'assistant' && <AIAdvisor />}
      </main>
    </div>
  )
}
