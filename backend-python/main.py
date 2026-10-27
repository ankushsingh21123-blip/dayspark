import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import get_db, save_db, DaySparkData, TaskModel, TaskCompletionModel, GoalModel, DailyCheckinModel

app = FastAPI(
    title="DaySpark Python Core API",
    description="High-performance asynchronous Python/FastAPI backend engine for DaySpark life planner and habit telemetry.",
    version="1.0.0",
)

# Enable CORS for local Vite and production clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "DaySpark Python Engine",
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "author": "Ankush Singh"
    }

@app.get("/api/setup/status")
def setup_status():
    return {"setupRequired": False}

@app.get("/api/session")
def get_session():
    db = get_db()
    return {"user": db.user.model_dump(), "csrfToken": "py-csrf-token-token"}

@app.post("/api/login")
def login(payload: Dict[str, str]):
    db = get_db()
    if payload.get("email"):
        db.user.email = payload["email"]
        save_db(db)
    return {"user": db.user.model_dump(), "csrfToken": "py-csrf-token-token"}

@app.post("/api/logout")
def logout():
    return {"ok": True}

@app.get("/api/sync")
def sync():
    db = get_db()
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    return {
        "serverTime": datetime.utcnow().isoformat() + "Z",
        "user": db.user.model_dump(),
        "tasks": [t.model_dump() for t in db.tasks],
        "completions": [c.model_dump() for c in db.completions],
        "goals": [g.model_dump() for g in db.goals],
        "milestones": [],
        "progressEntries": [],
        "checkins": [c.model_dump() for c in db.checkins],
        "activities": db.activities,
        "proofs": db.proofs,
        "globalSafe": {"scope": "global", "stored": 1, "qualifyingCount": 4, "lastProtectedDate": None},
        "gym": {
            "plans": [],
            "routines": [],
            "restEvents": [],
            "safe": {"scope": "gym", "stored": 1, "qualifyingCount": 3, "lastProtectedDate": None}
        },
        "dailyMoment": {
            "settings": {"enabled": False, "windowStart": "12:00", "windowEnd": "17:00", "notifications": False},
            "today": None,
            "days": [],
            "eligiblePrompt": False
        }
    }

@app.post("/api/tasks")
def create_task(payload: Dict[str, Any]):
    db = get_db()
    task_id = payload.get("id") or str(uuid.uuid4())
    task = TaskModel(
        id=task_id,
        title=payload.get("title", "New Task"),
        notes=payload.get("notes", ""),
        priority=payload.get("priority", "medium"),
        color=payload.get("color", "#5B8DEF"),
        estimatedMinutes=payload.get("estimatedMinutes", 20),
        energy=payload.get("energy", "medium"),
        scheduleDate=payload.get("scheduleDate", datetime.utcnow().strftime("%Y-%m-%d")),
        scheduleTime=payload.get("scheduleTime"),
        recurrence=payload.get("recurrence", {"type": "one_time"}),
        goalId=payload.get("goalId"),
        proofRequired=payload.get("proofRequired", False),
    )
    db.tasks.append(task)
    save_db(db)
    return task.model_dump()

@app.patch("/api/tasks/{task_id}")
def update_task(task_id: str, patch: Dict[str, Any]):
    db = get_db()
    for t in db.tasks:
        if t.id == task_id:
            for k, v in patch.items():
                if hasattr(t, k):
                    setattr(t, k, v)
            t.updatedAt = datetime.utcnow().isoformat() + "Z"
            save_db(db)
            return t.model_dump()
    raise HTTPException(status_code=404, detail="Task not found")

@app.post("/api/tasks/{task_id}/complete")
def complete_task(task_id: str, payload: Dict[str, Any]):
    db = get_db()
    occurrence_date = payload.get("date", datetime.utcnow().strftime("%Y-%m-%d"))
    task = next((t for t in db.tasks if t.id == task_id), None)
    points = 20 if task and task.priority == "high" else (10 if task and task.priority == "medium" else 5)
    
    # Filter out existing completion for same date
    db.completions = [c for c in db.completions if not (c.taskId == task_id and c.occurrenceDate == occurrence_date)]
    comp = TaskCompletionModel(
        id=str(uuid.uuid4()),
        taskId=task_id,
        occurrenceDate=occurrence_date,
        completedAt=datetime.utcnow().isoformat() + "Z",
        points=points,
        hasProof=False,
        status="complete"
    )
    db.completions.append(comp)
    save_db(db)
    return comp.model_dump()

@app.delete("/api/tasks/{task_id}/completions/{date}")
def delete_completion(task_id: str, date: str):
    db = get_db()
    db.completions = [c for c in db.completions if not (c.taskId == task_id and c.occurrenceDate == date)]
    save_db(db)
    return {"ok": True}

@app.post("/api/goals")
def create_goal(payload: Dict[str, Any]):
    db = get_db()
    goal = GoalModel(
        id=payload.get("id") or str(uuid.uuid4()),
        title=payload.get("title", ""),
        description=payload.get("description", ""),
        area=payload.get("area", "fitness"),
        targetValue=float(payload.get("targetValue", 50)),
        currentValue=0.0,
        unit=payload.get("unit", "units"),
        color=payload.get("color", "#78B98A")
    )
    db.goals.append(goal)
    save_db(db)
    return goal.model_dump()

@app.post("/api/checkins")
def save_checkin(payload: Dict[str, Any]):
    db = get_db()
    date = payload.get("date", datetime.utcnow().strftime("%Y-%m-%d"))
    db.checkins = [c for c in db.checkins if c.date != date]
    checkin = DailyCheckinModel(
        id=f"chk-{date}",
        date=date,
        energy=payload.get("energy", "high"),
        mood=int(payload.get("mood", 5)),
        note=payload.get("note", ""),
        intention=payload.get("intention", ""),
        win=payload.get("win", ""),
        gratitude=payload.get("gratitude", "")
    )
    db.checkins.append(checkin)
    save_db(db)
    return checkin.model_dump()

@app.post("/api/proofs")
async def upload_proof(
    ownerType: str = Form(...),
    ownerId: str = Form(...),
    caption: Optional[str] = Form(None),
    photo: UploadFile = File(...)
):
    db = get_db()
    proof = {
        "id": str(uuid.uuid4()),
        "ownerType": ownerType,
        "ownerId": ownerId,
        "caption": caption or "",
        "filename": photo.filename,
        "createdAt": datetime.utcnow().isoformat() + "Z"
    }
    db.proofs.append(proof)
    save_db(db)
    return proof
