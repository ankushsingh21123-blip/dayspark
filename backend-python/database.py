import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# In-memory / persistent file store for DaySpark
DATA_FILE = "dayspark_data.json"

class UserPreferences(BaseModel):
    id: str = "user-1"
    email: str = "ankushsingh21123@gmail.com"
    timezone: str = "Asia/Kolkata"
    enabledAreas: List[str] = ["fitness", "learning", "work", "wellbeing"]
    onboardingStep: Optional[str] = None
    displayName: str = "Ankush Singh"
    appearance: str = "dark"
    gardenSeason: str = "dawn"
    voice: str = "gentle"
    focusWindow: str = "morning"
    celebration: str = "full"
    contextualAmbience: bool = True

class TaskModel(BaseModel):
    id: str
    title: str
    notes: str = ""
    priority: str = "medium"
    color: str = "#5B8DEF"
    estimatedMinutes: int = 20
    energy: str = "medium"
    scheduleDate: str
    scheduleTime: Optional[str] = None
    recurrence: Dict[str, Any] = {"type": "one_time"}
    goalId: Optional[str] = None
    proofRequired: bool = False
    archived: bool = False
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    updatedAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class TaskCompletionModel(BaseModel):
    id: str
    taskId: str
    occurrenceDate: str
    completedAt: str
    points: int = 10
    hasProof: bool = False
    status: str = "complete"

class GoalModel(BaseModel):
    id: str
    title: str
    description: str = ""
    area: str = "fitness"
    trackingType: str = "numeric"
    targetValue: float = 50.0
    currentValue: float = 0.0
    unit: str = "sessions"
    deadline: Optional[str] = None
    color: str = "#5B8DEF"
    status: str = "active"
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    updatedAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class DailyCheckinModel(BaseModel):
    id: str
    date: str
    energy: str = "high"
    mood: int = 5
    note: str = ""
    intention: str = ""
    win: str = ""
    gratitude: str = ""

class DaySparkData(BaseModel):
    user: UserPreferences = Field(default_factory=UserPreferences)
    tasks: List[TaskModel] = []
    completions: List[TaskCompletionModel] = []
    goals: List[GoalModel] = []
    checkins: List[DailyCheckinModel] = []
    activities: List[Dict[str, Any]] = []
    proofs: List[Dict[str, Any]] = []

def get_db() -> DaySparkData:
    try:
        with open(DATA_FILE, "r") as f:
            return DaySparkData.model_validate_json(f.read())
    except Exception:
        db = DaySparkData()
        save_db(db)
        return db

def save_db(data: DaySparkData):
    with open(DATA_FILE, "w") as f:
        f.write(data.model_dump_json(indent=2))
