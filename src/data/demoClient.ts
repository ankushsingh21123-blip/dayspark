import type { Snapshot, User, Task, TaskCompletion, Goal, Milestone, ProgressEntry, DailyCheckin, ActivityEvent, ProofPhoto } from '../domain/types';
import type { DaySparkClient, Session, ProofOwnerType } from './api';
import type { QueuedMutation } from './offline';

const STORAGE_KEY = 'dayspark-demo-data-v2';

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultUser(): User {
  return {
    id: 'user-ankush',
    email: 'ankushsingh21123@gmail.com',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    enabledAreas: ['fitness', 'learning', 'work', 'wellbeing'],
    onboardingStep: null,
    displayName: 'Ankush Singh',
    appearance: 'dark',
    gardenSeason: 'dawn',
    voice: 'gentle',
    focusWindow: 'morning',
    celebration: 'full',
  };
}

function defaultSnapshot(): Snapshot {
  const today = todayString();
  const sampleTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Morning workout & functional mobility',
      notes: 'Focus on bench press and clean form. Log proof photo.',
      priority: 'high',
      color: '#5B8DEF',
      estimatedMinutes: 45,
      energy: 'high',
      scheduleDate: today,
      scheduleTime: '07:30',
      recurrence: { type: 'daily' },
      goalId: 'goal-1',
      proofRequired: false,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      title: 'Review multi-agent system architecture & PRs',
      notes: 'Verify tool-calling sandbox permissions and latency.',
      priority: 'high',
      color: '#78B98A',
      estimatedMinutes: 60,
      energy: 'high',
      scheduleDate: today,
      scheduleTime: '11:00',
      recurrence: { type: 'daily' },
      goalId: 'goal-2',
      proofRequired: false,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-3',
      title: 'Deep Work: Neural reasoning & context caching',
      notes: 'Read latest research preprints and benchmark inference speed.',
      priority: 'medium',
      color: '#E5A93C',
      estimatedMinutes: 45,
      energy: 'medium',
      scheduleDate: today,
      scheduleTime: '15:00',
      recurrence: { type: 'daily' },
      goalId: 'goal-3',
      proofRequired: false,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-4',
      title: 'Evening mindfulness & gratitude reflection',
      notes: 'Unwind and record wins for the day.',
      priority: 'low',
      color: '#A78BFA',
      estimatedMinutes: 15,
      energy: 'low',
      scheduleDate: today,
      scheduleTime: '21:00',
      recurrence: { type: 'daily' },
      goalId: null,
      proofRequired: false,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const sampleGoals: Goal[] = [
    {
      id: 'goal-1',
      title: 'Gym Strength & Hypertrophy Streak',
      description: 'Consistent strength training 5 days a week with proof logs.',
      area: 'fitness',
      trackingType: 'numeric',
      targetValue: 50,
      currentValue: 24,
      unit: 'sessions',
      deadline: null,
      color: '#5B8DEF',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'goal-2',
      title: 'Autonomous Multi-Agent Architecture',
      description: 'Ship production-ready agent execution kernel & risk scoring.',
      area: 'work',
      trackingType: 'percentage',
      targetValue: 100,
      currentValue: 85,
      unit: '%',
      deadline: null,
      color: '#78B98A',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'goal-3',
      title: 'Read 25 Deep AI & Systems Research Papers',
      description: 'Study foundation models, reasoning, and distributed systems.',
      area: 'learning',
      trackingType: 'numeric',
      targetValue: 25,
      currentValue: 14,
      unit: 'papers',
      deadline: null,
      color: '#E5A93C',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const sampleCheckins: DailyCheckin[] = [
    {
      id: `checkin-${today}`,
      date: today,
      energy: 'high',
      mood: 5,
      note: 'Systems running optimally. High energy for architecture execution.',
      intention: 'Build verifiable, resilient intelligent systems.',
      win: 'Deployed live multi-agent models and streamlined pipelines.',
      gratitude: 'Grateful for deep focus time and continuous momentum.',
    },
  ];

  return {
    serverTime: new Date().toISOString(),
    user: defaultUser(),
    tasks: sampleTasks,
    completions: [],
    goals: sampleGoals,
    milestones: [],
    progressEntries: [],
    checkins: sampleCheckins,
    activities: [
      {
        id: 'act-1',
        type: 'focus',
        message: 'Completed 45m deep focus sprint',
        relatedType: 'task',
        relatedId: 'task-2',
        createdAt: new Date().toISOString(),
      },
    ],
    proofs: [],
    globalSafe: { scope: 'global', stored: 1, qualifyingCount: 4, lastProtectedDate: null },
    gym: { plans: [], routines: [], restEvents: [], safe: { scope: 'gym', stored: 1, qualifyingCount: 3, lastProtectedDate: null } },
    dailyMoment: { settings: { enabled: false, windowStart: '12:00', windowEnd: '17:00', notifications: false }, today: null, days: [], eligiblePrompt: false },
  };
}

function loadData(): Snapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* storage fallback */ }
  const initial = defaultSnapshot();
  saveData(initial);
  return initial;
}

function saveData(snapshot: Snapshot) {
  snapshot.serverTime = new Date().toISOString();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot)); } catch { /* storage full */ }
}

export class DemoClient implements DaySparkClient {
  readonly exportUrl = '#demo';

  setCsrf(_token: string | null) { /* no-op in demo */ }

  async getSetupStatus(): Promise<{ setupRequired: boolean }> {
    return { setupRequired: false };
  }

  async getSession(): Promise<Session> {
    const data = loadData();
    return { user: data.user, csrfToken: 'demo-csrf' };
  }

  async setup(input: { email: string; password: string; timezone: string }): Promise<Session> {
    const data = loadData();
    data.user.email = input.email;
    data.user.timezone = input.timezone;
    saveData(data);
    return { user: data.user, csrfToken: 'demo-csrf' };
  }

  async login(input: { email: string; password: string }): Promise<Session> {
    const data = loadData();
    if (input.email) data.user.email = input.email;
    saveData(data);
    return { user: data.user, csrfToken: 'demo-csrf' };
  }

  async logout(): Promise<{ ok: boolean }> {
    return { ok: true };
  }

  async sync(): Promise<Snapshot> {
    return loadData();
  }

  async mutate(mutation: QueuedMutation): Promise<unknown> {
    if (mutation.kind === 'proof') return this.handleProof(mutation);
    const data = loadData();
    const { method, path, body } = mutation;
    const b = body as Record<string, unknown> | undefined;

    // --- Tasks ---
    if (method === 'POST' && path === '/tasks') {
      const task: Task = {
        id: (b?.id as string) || crypto.randomUUID(),
        title: (b?.title as string) ?? 'New Task',
        notes: (b?.notes as string) ?? '',
        priority: (b?.priority as Task['priority']) ?? 'medium',
        color: (b?.color as string) ?? '#5B8DEF',
        estimatedMinutes: (b?.estimatedMinutes as number) ?? 20,
        energy: (b?.energy as Task['energy']) ?? 'medium',
        scheduleDate: (b?.scheduleDate as string) ?? todayString(),
        scheduleTime: (b?.scheduleTime as string | null) ?? null,
        recurrence: (b?.recurrence as Task['recurrence']) ?? { type: 'one_time' },
        goalId: (b?.goalId as string | null) ?? null,
        proofRequired: (b?.proofRequired as boolean) ?? false,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.tasks.push(task);
      saveData(data);
      return task;
    }

    const taskMatch = path.match(/^\/tasks\/([^/]+)$/);
    if (method === 'PATCH' && taskMatch) {
      data.tasks = data.tasks.map(t => t.id === taskMatch[1] ? { ...t, ...b, updatedAt: new Date().toISOString() } : t);
      saveData(data);
      return { ok: true };
    }

    const completeMatch = path.match(/^\/tasks\/([^/]+)\/complete$/);
    if (method === 'POST' && completeMatch) {
      const taskId = completeMatch[1];
      const date = (b?.date as string) ?? todayString();
      const task = data.tasks.find(t => t.id === taskId);
      const completion: TaskCompletion = {
        id: crypto.randomUUID(),
        taskId,
        occurrenceDate: date,
        completedAt: new Date().toISOString(),
        points: task?.priority === 'high' ? 20 : task?.priority === 'medium' ? 10 : 5,
        hasProof: false,
        status: 'complete',
      };
      data.completions = [...data.completions.filter(c => !(c.taskId === taskId && c.occurrenceDate === date)), completion];
      saveData(data);
      return completion;
    }

    const deleteCompletionMatch = path.match(/^\/tasks\/([^/]+)\/completions\/(.+)$/);
    if (method === 'DELETE' && deleteCompletionMatch) {
      const [, taskId, date] = deleteCompletionMatch;
      data.completions = data.completions.filter(c => !(c.taskId === taskId && c.occurrenceDate === date));
      saveData(data);
      return { ok: true };
    }

    // --- Goals ---
    if (method === 'POST' && path === '/goals') {
      const goal: Goal = {
        id: (b?.id as string) || crypto.randomUUID(),
        title: (b?.title as string) ?? '',
        description: (b?.description as string) ?? '',
        area: (b?.area as Goal['area']) ?? 'fitness',
        trackingType: (b?.trackingType as string) ?? 'numeric',
        targetValue: (b?.targetValue as number) ?? 100,
        currentValue: 0,
        unit: (b?.unit as string) ?? 'units',
        deadline: (b?.deadline as string | null) ?? null,
        color: (b?.color as string) ?? '#78B98A',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.goals.push(goal);
      saveData(data);
      return goal;
    }

    const progressMatch = path.match(/^\/goals\/([^/]+)\/entries$/);
    if (method === 'POST' && progressMatch) {
      const goalId = progressMatch[1];
      const entry: ProgressEntry = {
        id: (b?.id as string) || crypto.randomUUID(),
        goalId,
        area: (b?.area as ProgressEntry['area']) ?? 'fitness',
        entryType: (b?.entryType as string) ?? 'manual',
        metric: (b?.metric as string) ?? '',
        value: (b?.value as number) ?? 0,
        durationMinutes: (b?.durationMinutes as number | null) ?? null,
        details: (b?.details as Record<string, unknown>) ?? {},
        note: (b?.note as string) ?? '',
        occurrenceAt: (b?.occurrenceAt as string) ?? new Date().toISOString(),
        status: 'complete',
        createdAt: new Date().toISOString(),
      };
      data.progressEntries.push(entry);
      const goal = data.goals.find(g => g.id === goalId);
      if (goal && entry.entryType !== 'workout') goal.currentValue += entry.value;
      saveData(data);
      return entry;
    }

    // --- Preferences ---
    if (method === 'PATCH' && path === '/preferences') {
      data.user = { ...data.user, ...b };
      saveData(data);
      return { ok: true };
    }

    // --- Checkins ---
    if (method === 'POST' && path === '/checkins') {
      const date = (b?.date as string) ?? todayString();
      const existing = data.checkins.find(c => c.date === date);
      const checkin: DailyCheckin = {
        id: existing?.id ?? `demo-${date}`,
        date,
        energy: (b?.energy as DailyCheckin['energy']) ?? existing?.energy ?? 'medium',
        mood: (b?.mood as DailyCheckin['mood']) ?? existing?.mood ?? 3,
        note: (b?.note as string) ?? existing?.note ?? '',
        intention: (b?.intention as string) ?? existing?.intention ?? '',
        win: (b?.win as string) ?? existing?.win ?? '',
        gratitude: (b?.gratitude as string) ?? existing?.gratitude ?? '',
      };
      data.checkins = [...data.checkins.filter(c => c.date !== date), checkin];
      saveData(data);
      return checkin;
    }

    // --- Focus ---
    if (method === 'POST' && path === '/focus') {
      const activity: ActivityEvent = {
        id: crypto.randomUUID(),
        type: 'focus',
        message: `Focused for ${b?.minutes ?? 0} minutes`,
        relatedType: 'task',
        relatedId: (b?.taskId as string) ?? '',
        createdAt: new Date().toISOString(),
      };
      data.activities.push(activity);
      saveData(data);
      return { ok: true };
    }

    // --- Proofs delete ---
    const proofDeleteMatch = path.match(/^\/proofs\/([^/]+)$/);
    if (method === 'DELETE' && proofDeleteMatch) {
      data.proofs = data.proofs.filter(p => p.id !== proofDeleteMatch[1]);
      saveData(data);
      return { ok: true };
    }

    // Fallthrough save
    saveData(data);
    return { ok: true };
  }

  private handleProof(mutation: QueuedMutation): unknown {
    const data = loadData();
    const b = mutation.body as { ownerType: ProofOwnerType; ownerId: string; caption?: string };
    const proof: ProofPhoto = {
      id: crypto.randomUUID(),
      ownerType: b.ownerType as ProofPhoto['ownerType'],
      ownerId: b.ownerId,
      caption: b.caption,
      imageUrl: '',
      createdAt: new Date().toISOString(),
      selectedForRecap: false,
    };
    data.proofs.push(proof);
    saveData(data);
    return proof;
  }

  async uploadProof(input: { ownerType: ProofOwnerType; ownerId: string; photo: Blob; mutationId: string; filename?: string; caption?: string }): Promise<unknown> {
    const data = loadData();
    const proof: ProofPhoto = {
      id: crypto.randomUUID(),
      ownerType: input.ownerType as ProofPhoto['ownerType'],
      ownerId: input.ownerId,
      caption: input.caption,
      imageUrl: '',
      createdAt: new Date().toISOString(),
      selectedForRecap: false,
    };
    data.proofs.push(proof);
    saveData(data);
    return proof;
  }
}

export const demoClient = new DemoClient();
