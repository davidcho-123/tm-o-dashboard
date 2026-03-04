"use client"

import * as React from "react"
import { Wand2, Clock, CheckCircle2, Coffee, Settings2, Timer } from "lucide-react"
import { format, startOfDay, setHours, setMinutes } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Task, ScheduledTask } from "@/lib/types"
import { generateOptimizedDailySchedule } from "@/ai/flows/generate-optimized-daily-schedule"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface AISchedulerProps {
  tasks: Task[];
}

interface UserAvailability {
  start: string;
  end: string;
}

export function AIScheduler({ tasks }: AISchedulerProps) {
  const [scheduledTasks, setScheduledTasks] = React.useState<ScheduledTask[]>([])
  const [loading, setLoading] = React.useState(false)
  const [notes, setNotes] = React.useState("")

  const [availability, setAvailability] = React.useState<UserAvailability>({ start: "09:00", end: "18:00" })
  const [breakFrequency, setBreakFrequency] = React.useState<number | string>(90)
  const [breakDuration, setBreakDuration] = React.useState<number | string>(15)

  const handleBlur = (field: 'freq' | 'dur') => {
    if (field === 'freq' && breakFrequency === "") {
      setBreakFrequency(0)
    } else if (field === 'dur' && breakDuration === "") {
      setBreakDuration(0)
    }
  }

  const generateSchedule = async () => {
    const activeTasks = tasks.filter(t => !t.completed)
    if (activeTasks.length === 0) {
      toast({
        title: "No active tasks",
        description: "Add some active tasks before generating a schedule.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    const todayStr = format(new Date(), 'yyyy-MM-dd')

    const [startH, startM] = availability.start.split(":").map(Number)
    const [endH, endM] = availability.end.split(":").map(Number)

    const baseDate = startOfDay(new Date())
    const freeSlots = [
      {
        start: setMinutes(setHours(baseDate, startH), startM).toISOString(),
        end: setMinutes(setHours(baseDate, endH), endM).toISOString(),
      }
    ]

    try {
      const result = await generateOptimizedDailySchedule({
        currentDate: todayStr,
        tasks: activeTasks.map(t => ({
          description: t.description,
          durationMinutes: t.durationMinutes,
          priority: t.priority
        })),
        freeTimeSlots: freeSlots,
        breakFrequencyMinutes: Number(breakFrequency),
        breakDurationMinutes: Number(breakDuration)
      })

      const newScheduledTasks = result.scheduledTasks.map((t, idx) => ({
        id: `sch-${idx}-${Date.now()}`,
        description: t.description,
        start: new Date(t.start),
        end: new Date(t.end),
        isBreak: t.isBreak
      }))

      setScheduledTasks(newScheduledTasks)
      setNotes(result.notes)

      toast({
        title: "Strategy Optimized",
        description: `Successfully scheduled ${result.scheduledTasks.filter(t => !t.isBreak).length} operations.`,
      })
    } catch (error: any) {
      toast({
        title: "Optimization Failed",
        description: error.message || "The strategy core encountered an error.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-24">
      <section className="animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <Settings2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter">Optimization Parameters</h2>
            <p className="text-muted-foreground font-medium tracking-tight">Configure your availability and physiological needs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-[2rem] border-primary/10 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-primary">
                <Clock className="w-4 h-4" />
                <CardTitle className="text-sm font-black uppercase tracking-widest">Active Window</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Start Time</Label>
                  <Input 
                    type="time" 
                    value={availability.start}
                    onChange={(e: any) => setAvailability((prev: any) => ({ ...prev, start: e.target.value }))}
                    className="rounded-xl border-primary/10 focus-visible:ring-primary h-12 text-lg font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">End Time</Label>
                  <Input 
                    type="time" 
                    value={availability.end}
                    onChange={(e: any) => setAvailability((prev: any) => ({ ...prev, end: e.target.value }))}
                    className="rounded-xl border-primary/10 focus-visible:ring-primary h-12 text-lg font-bold"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-primary/10 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-primary">
                <Timer className="w-4 h-4" />
                <CardTitle className="text-sm font-black uppercase tracking-widest">Break Frequency</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Every (minutes)</Label>
                <Input 
                  type="number" 
                  value={breakFrequency as any}
                  onChange={(e: any) => setBreakFrequency(e.target.value)}
                  onBlur={() => handleBlur('freq')}
                  className="rounded-xl border-primary/10 focus-visible:ring-primary h-12 text-lg font-bold"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-primary/10 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-primary">
                <Coffee className="w-4 h-4" />
                <CardTitle className="text-sm font-black uppercase tracking-widest">Break Duration</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Duration (minutes)</Label>
                <Input 
                  type="number" 
                  value={breakDuration as any}
                  onChange={(e: any) => setBreakDuration(e.target.value)}
                  onBlur={() => handleBlur('dur')}
                  className="rounded-xl border-primary/10 focus-visible:ring-primary h-12 text-lg font-bold"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="border-none bg-primary shadow-2xl shadow-primary/20 overflow-hidden rounded-[3rem]">
        <CardContent className="p-10 md:p-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 text-primary-foreground">
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <Wand2 className="w-10 h-10 text-white" />
                <CardTitle className="text-5xl font-black tracking-tighter">TM&O Strategy Build</CardTitle>
              </div>
              <p className="text-primary-foreground/80 font-medium text-xl max-w-xl">Initialize the Strategy Core to synthesize your active window and break parameters into a peak-efficiency timeline.</p>
            </div>
            <Button 
              size="lg" 
              onClick={generateSchedule} 
              disabled={loading} 
              className="h-20 px-14 rounded-full text-xl font-black uppercase tracking-[0.2em] bg-white text-primary hover:bg-white/90 shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Clock className="w-8 h-8 animate-spin mr-3" /> : <Wand2 className="w-8 h-8 mr-3" />}
              {loading ? "Synthesizing..." : "Initiate Build"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {scheduledTasks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in">
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-3xl font-black tracking-tighter flex items-center gap-4 px-4">
              <div className="w-2 h-8 bg-primary rounded-full" />
              Strategic Timeline
            </h3>
            <div className="space-y-6">
              {scheduledTasks.map((st) => (
                <div 
                  key={st.id} 
                  className={cn(
                    "group relative pl-8 border-l-4 transition-all duration-500",
                    st.isBreak ? "border-muted-foreground/20" : "border-primary/30 hover:border-primary"
                  )}
                >
                  <div className={cn(
                    "p-8 rounded-[2.5rem] border transition-all duration-300 shadow-sm hover:shadow-xl",
                    st.isBreak 
                      ? "bg-muted/10 border-dashed border-muted-foreground/30 opacity-70" 
                      : "bg-card border-primary/10 hover:border-primary/30"
                  )}>
                    <div className="flex justify-between items-center">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          {st.isBreak && <Coffee className="w-5 h-5 text-muted-foreground" />}
                          <h4 className={cn(
                            "text-2xl font-black tracking-tight",
                            st.isBreak ? "text-muted-foreground italic" : "text-foreground"
                          )}>
                            {st.description}
                          </h4>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em]">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            {format(st.start, "h:mm a")} — {format(st.end, "h:mm a")}
                          </div>
                          <Badge variant="outline" className="rounded-full px-4 border-primary/10">
                            {Math.round((st.end.getTime() - st.start.getTime()) / 60000)}m
                          </Badge>
                        </div>
                      </div>
                      {!st.isBreak && (
                        <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center text-primary/20 group-hover:text-primary transition-colors">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <Card className="bg-primary shadow-2xl shadow-primary/20 text-primary-foreground border-none rounded-[3rem] overflow-hidden">
              <div className="p-10 space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Operational Insight</span>
                <p className="text-2xl font-bold leading-relaxed tracking-tight italic">
                  &ldquo;{notes}&rdquo;
                </p>
              </div>
            </Card>

            <Card className="bg-muted/30 border-none rounded-[3rem] p-10">
              <div className="space-y-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Efficiency Metrics</span>
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-border/40 pb-6">
                    <span className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Active Ops</span>
                    <span className="text-4xl font-black tracking-tighter">{scheduledTasks.filter(t => !t.isBreak).length}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-border/40 pb-6">
                    <span className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Reset Phases</span>
                    <span className="text-4xl font-black tracking-tighter">{scheduledTasks.filter(t => t.isBreak).length}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Work Volume</span>
                    <span className="text-4xl font-black tracking-tighter">
                      {Math.round(scheduledTasks.filter(t => !t.isBreak).reduce((acc, st) => acc + (st.end.getTime() - st.start.getTime()) / 60000, 0))}
                      <span className="text-lg font-bold opacity-30 ml-2">min</span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center rounded-[4rem] border-4 border-dashed border-border/40 bg-muted/5">
          <div className="bg-muted/30 rounded-full p-12 mb-8 shadow-inner animate-pulse">
            <Clock className="w-16 h-16 text-muted-foreground/30" />
          </div>
          <h3 className="text-3xl font-black text-muted-foreground/60 tracking-tighter">Strategy Core Awaiting Input</h3>
          <p className="text-muted-foreground/40 max-w-md mt-4 font-medium text-xl leading-relaxed px-8">
            Configure your parameters above and initialize the Strategy Build to generate your peak-efficiency operational timeline.
          </p>
        </div>
      )}
    </div>
  )
}
