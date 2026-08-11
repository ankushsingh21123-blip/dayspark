import { useEffect, useState } from 'react';
import type { GymDayState, GymRoutine, ProgressEntry, WorkoutDetails, WorkoutSet } from '../domain/types';
import { CameraCapture } from './CameraCapture';

export const ACTIVE_WORKOUT_KEY = 'dayspark-active-workout';
export const activeWorkoutKey = (userId: string) => `${ACTIVE_WORKOUT_KEY}:${userId}`;
export type GymWorkoutDraft = Omit<WorkoutDetails, 'startedAt'> & { id: string; entrySaved: boolean; note: string };
export type GymWorkoutEntry = { id: string; body: Omit<GymWorkoutDraft, 'id' | 'entrySaved'> & { id: string; goalId: string; date: string; durationMinutes: number; occurrenceAt: string; startedAt: string } };

export function GymWorkout({ userId, routine, entries, goalId, date, plannedState, onSaveEntry, onSaveProof, onClose }: { userId: string; routine: GymRoutine | null; entries: ProgressEntry[]; goalId: string; date: string; plannedState: GymDayState['kind']; onSaveEntry(value: GymWorkoutEntry): Promise<void>; onSaveProof(value: { id: string; photo: File }): Promise<void>; onClose(): void }) {
  const storageKey = activeWorkoutKey(userId);
  const [{ draft, startedAt }, setWorkout] = useState(() => readActiveWorkout(storageKey) ?? createWorkout(routine, entries, plannedState));
  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workingSet = draft.sets.some(set => !set.warmup);

  useEffect(() => { writeActiveWorkout(storageKey, { draft, startedAt }); }, [draft, startedAt, storageKey]);

  function updateSet(index: number, patch: Partial<WorkoutSet>) {
    setWorkout(value => ({ ...value, draft: { ...value.draft, sets: value.draft.sets.map((set, item) => item === index ? { ...set, ...patch } : set) } }));
  }

  async function finish() {
    if (!photo || !workingSet) return;
    const id = draft.id;
    const occurrenceAt = new Date().toISOString();
    const durationMinutes = Math.max(1, Math.ceil((Date.now() - Date.parse(startedAt)) / 60_000));
    setBusy(true);
    setError(null);
    try {
      if (!draft.entrySaved) {
        const { id: _id, entrySaved: _entrySaved, ...details } = draft;
        await onSaveEntry({ id, body: { ...details, id, goalId, date, durationMinutes, occurrenceAt, startedAt } });
        const saved = { ...draft, entrySaved: true };
        setWorkout(value => ({ ...value, draft: saved }));
        writeActiveWorkout(storageKey, { draft: saved, startedAt });
      }
      await onSaveProof({ id, photo });
      removeActiveWorkout(storageKey);
      onClose();
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'The workout could not be saved.'); }
    finally { setBusy(false); }
  }

  return <section className="gym-workout">
    <header><button className="back-button" type="button" onClick={onClose}>‹ Back to gym</button><p className="eyebrow">Active workout</p><h1>{draft.routineName || 'Open'} workout</h1></header>
    <div className="workout-sets">{draft.sets.map((set, index) => {
      const setNumber = draft.sets.slice(0, index + 1).filter(item => item.exercise === set.exercise).length;
      return <article key={`${set.exercise}-${index}`}><header><strong>{set.exercise}</strong><span>{set.warmup ? 'Warm-up' : 'Working set'}</span></header><div className="workout-set-fields">
        <label>Reps<input aria-label={`${set.exercise} set ${setNumber} reps`} type="number" min="1" value={set.reps} onChange={event => updateSet(index, { reps: Number(event.target.value) })} /></label>
        <label>Load<input aria-label={`${set.exercise} set ${setNumber} load`} type="number" min="0" step="0.1" value={set.load} onChange={event => updateSet(index, { load: Number(event.target.value) })} /></label>
        <label>RPE<input aria-label={`${set.exercise} set ${setNumber} RPE`} type="number" min="1" max="10" value={set.rpe ?? ''} onChange={event => updateSet(index, { rpe: event.target.value ? Number(event.target.value) : null })} /></label>
      </div><label className="working-toggle"><input aria-label="Working set" type="checkbox" checked={!set.warmup} onChange={event => updateSet(index, { warmup: !event.target.checked })} /> Count as working set</label></article>;
    })}</div>
    <label className="field"><span>Notes</span><textarea value={draft.note} onChange={event => setWorkout(value => ({ ...value, draft: { ...value.draft, note: event.target.value } }))} /></label>
    <section className="workout-proof"><h2>Workout proof</h2><p>Capture one private live photo. The workout counts after it is stored.</p><CameraCapture onSave={setPhoto} onDiscard={() => setPhoto(null)} /></section>
    {error && <p className="form-error">{error}</p>}
    <button className="primary-button finish-workout" type="button" disabled={!workingSet || !photo || busy} onClick={() => void finish()}>{busy ? 'Saving workout…' : 'Finish with proof'}</button>
  </section>;
}

function createWorkout(routine: GymRoutine | null, entries: ProgressEntry[], plannedState: GymDayState['kind']): { draft: GymWorkoutDraft; startedAt: string } {
  const previous = [...entries].filter(entry => entry.entryType === 'workout' && entry.status === 'complete' && (!routine || entry.details.routineId === routine.id)).sort((a, b) => b.occurrenceAt.localeCompare(a.occurrenceAt))[0];
  const previousSets = Array.isArray(previous?.details.sets) ? previous.details.sets as WorkoutSet[] : [];
  const sets = routine ? routine.exercises.flatMap(exercise => {
    const performed = previousSets.filter(set => set.exercise.trim().toLowerCase() === exercise.name.trim().toLowerCase());
    return (performed.length ? performed : exercise.sets.map(set => ({ ...set, exercise: exercise.name }))).map(set => ({ ...set }));
  }) : [{ exercise: 'Exercise', reps: 8, load: 0, warmup: true, rpe: null }];
  return { startedAt: new Date().toISOString(), draft: { id: crypto.randomUUID(), entrySaved: false, routineId: routine?.id ?? null, routineName: routine?.name ?? 'Open', sets, plannedState: plannedState === 'training' || plannedState === 'rest' || plannedState === 'open' ? plannedState : 'open', note: '' } };
}

function readActiveWorkout(key: string): { draft: GymWorkoutDraft; startedAt: string } | null {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? 'null') as { draft?: GymWorkoutDraft; startedAt?: string } | null;
    return value?.draft && Array.isArray(value.draft.sets) && typeof value.startedAt === 'string' && Number.isFinite(Date.parse(value.startedAt)) ? { draft: { ...value.draft, id: value.draft.id || crypto.randomUUID(), entrySaved: value.draft.entrySaved === true }, startedAt: value.startedAt } : null;
  } catch { return null; }
}

function writeActiveWorkout(key: string, value: { draft: GymWorkoutDraft; startedAt: string }) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private browsing can deny storage */ }
}

function removeActiveWorkout(key: string) {
  try { localStorage.removeItem(key); } catch { /* private browsing can deny storage */ }
}
