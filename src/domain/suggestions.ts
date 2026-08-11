import { differenceInCalendarDays, parseISO } from 'date-fns';
import type { Energy, Task } from './types';

type Context = { minutes: number; energy: Energy; now: Date };
export type SuggestedTask = { task: Task; score: number; reason: string };
const weight = { low: 1, medium: 2, high: 3 } as const;

export function rankNextActions(tasks: Task[], context: Context): SuggestedTask[] {
  return tasks
    .filter(task => !task.archived && task.estimatedMinutes <= context.minutes)
    .map(task => {
      const days = differenceInCalendarDays(parseISO(task.scheduleDate), context.now);
      const urgency = days < 0 ? 4 : days === 0 ? 3 : days <= 2 ? 2 : 0;
      const priority = weight[task.priority];
      const energyFit = task.energy === context.energy ? 3 : Math.abs(weight[task.energy] - weight[context.energy]) === 1 ? 1 : 0;
      const timeFit = task.estimatedMinutes <= context.minutes ? 2 : 0;
      const goalWeight = task.goalId ? 1 : 0;
      const score = urgency * 4 + priority * 3 + energyFit * 2 + timeFit * 2 + goalWeight;
      const reasons = [
        urgency > 0 ? 'due soon' : '',
        timeFit ? `fits ${context.minutes} min` : '',
        energyFit >= 2 ? `${context.energy} energy` : '',
        task.goalId ? 'moves a goal' : '',
      ].filter(Boolean);
      return { task, score, reason: reasons.join(' · ') };
    })
    .sort((a, b) => b.score - a.score || a.task.title.localeCompare(b.task.title));
}
