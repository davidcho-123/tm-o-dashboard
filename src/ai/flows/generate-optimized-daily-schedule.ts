import { ScheduledTask } from '@/lib/types';

export async function generateOptimizedDailySchedule({ currentDate, tasks, freeTimeSlots, breakFrequencyMinutes, breakDurationMinutes } : any) {
  // Simple stub: schedule tasks back-to-back within the first free slot.
  const slot = freeTimeSlots[0];
  const slotStart = new Date(slot.start);
  let cursor = slotStart.getTime();
  const scheduledTasks = [];
  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i];
    const start = new Date(cursor);
    const end = new Date(cursor + t.durationMinutes * 60000);
    scheduledTasks.push({
      description: t.description,
      start: start.toISOString(),
      end: end.toISOString(),
      isBreak: false
    });
    cursor = end.getTime();
    // insert a break if requested
    if (breakFrequencyMinutes && breakDurationMinutes && ((i+1) % 2 === 0)) {
      const bStart = new Date(cursor);
      const bEnd = new Date(cursor + breakDurationMinutes * 60000);
      scheduledTasks.push({
        description: 'Break',
        start: bStart.toISOString(),
        end: bEnd.toISOString(),
        isBreak: true
      });
      cursor = bEnd.getTime();
    }
  }
  return {
    scheduledTasks,
    notes: "Stubbed schedule — replace with real AI flow when ready."
  };
}

export default generateOptimizedDailySchedule;
