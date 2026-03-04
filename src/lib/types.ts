export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  completed: boolean;
  durationMinutes: number;
}

export interface ScheduledTask {
  id: string;
  description: string;
  start: Date;
  end: Date;
  isBreak?: boolean;
}
