"use client"

import * as React from "react"
import { Plus, Clock, Target, CalendarDays, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Task } from "@/lib/types"
import { parseNaturalDate } from "@/ai/flows/parse-natural-date"
import { toast } from "@/hooks/use-toast"

const taskSchema = z.object({
  description: z.string().min(1, "Operation description is required"),
  priority: z.enum(["high", "medium", "low"]),
  durationMinutes: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  dateDescription: z.string().min(1, "Target deployment date is required"),
})

interface TaskDialogProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  trigger?: React.ReactNode;
}

export function TaskDialog({ onAddTask, trigger }: TaskDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      description: "",
      priority: "medium",
      durationMinutes: 30,
      dateDescription: "",
    },
  })

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    setIsProcessing(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const result = await parseNaturalDate({
        dateText: values.dateDescription,
        currentDate: today
      })

      const resolvedDate = new Date(result.isoDate + 'T12:00:00')

      onAddTask({
        description: values.description,
        priority: values.priority,
        durationMinutes: values.durationMinutes,
        dueDate: resolvedDate,
      })

      setOpen(false)
      form.reset()
      toast({
        title: "Operation Initialized",
        description: `Deployment set for ${format(resolvedDate, "MMMM do, yyyy")}`,
      })
    } catch (error) {
      toast({
        title: "Temporal Resolution Error",
        description: "The AI could not parse the date. Please try a different format.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="gap-2 h-10 rounded-xl px-6 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/20">
            <Plus className="w-3.5 h-3.5" /> Add Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-primary/20 p-8 bg-background/95 backdrop-blur-xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <DialogTitle className="text-2xl font-black tracking-tighter">New Operation</DialogTitle>
          </div>
          <p className="text-muted-foreground text-[11px] font-medium tracking-tight">Configure parameters for your next strategic objective.</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={(e:any)=>{ e.preventDefault(); onSubmit(form.getValues() as any); }} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Title</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="" 
                        {...field as any} 
                        className="rounded-lg border-primary/10 h-11 pl-10 text-sm font-bold bg-muted/20 focus-visible:ring-primary/30" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[9px] font-bold uppercase" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-lg border-primary/10 h-11 text-sm font-bold bg-muted/20">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-primary/10">
                        <SelectItem value="high" className="font-bold text-red-500">High</SelectItem>
                        <SelectItem value="medium" className="font-bold text-amber-500">Standard</SelectItem>
                        <SelectItem value="low" className="font-bold text-emerald-500">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Time (min)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          {...field as any} 
                          className="rounded-lg border-primary/10 h-11 pl-10 text-sm font-bold bg-muted/20" 
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dateDescription"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Target Deployment (AI Powered)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-60" />
                      <Input 
                        placeholder="" 
                        {...field as any} 
                        className="rounded-lg border-primary/10 h-11 pl-10 text-sm font-bold bg-muted/20" 
                      />
                    </div>
                  </FormControl>
                  <p className="text-[9px] text-muted-foreground font-medium italic">Temporal Processor will automatically resolve your input.</p>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button 
                type="submit" 
                disabled={isProcessing}
                className="w-full h-12 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Resolving...
                  </>
                ) : (
                  "Commit Operation"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
