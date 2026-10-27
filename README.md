# DaySpark ✦

**A calm, private Progressive Web App for recurring tasks, fitness progress, focus sprints, and reflection.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-dayspark--pwa.netlify.app-00C7B7?style=for-the-badge&logo=netlify)](https://dayspark-pwa.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-ankushsingh21123--blip%2Fdayspark-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ankushsingh21123-blip/dayspark)

🌐 **Live Application:** [dayspark-pwa.netlify.app](https://dayspark-pwa.netlify.app)

<br/>

A mobile-first, private PWA for recurring tasks, one-time plans, goals, gym progress, photo memories, streaks, focus, meditation, and reflection. Includes offline IndexedDB sync and ambient environment lighting.

## Highlights

- Daily, weekly, monthly, and one-time tasks with calendar and progress views
- Guided Gym goals, routines, planned or flexible rest, records, live-camera proof, and Gym Streak Safe
- Separate private photo libraries for Gym, Goals, Tasks, and Daily Moments
- Optional Daily Moment reminders capped at two per day, plus voluntary camera capture at any time
- Saved workout places, nearby start prompts, and optional time/weather ambience
- Synced app-wide Streak Safe, Pomodoro presets, guided meditation, and light/dark themes

## 🛠️ Multi-Language Architecture & Tech Stack

- **Frontend Client**: React 18, Vite 6, TypeScript, IndexedDB Offline Sync, Lucide Icons, Mobile-First PWA
- **Python Backend Service (`backend-python/`)**: Python 3.12, FastAPI, Uvicorn, SQLite Async Persistence, REST API Endpoints (`/api/sync`, `/api/login`, `/api/habits`, `/api/tasks`)
- **C++ Native Verification Core (`core-cpp/`)**: Modern C++20, CMake, Zero-Copy Perceptual Hashing (pHash), Physical Sensor Coherence Validation, 128-bit Cryptographic Proof Digesting
- **PHP Legacy Engine (`dayspark-private/` + `public_html/`)**: Hostinger MySQL sync engine for traditional cPanel deployments

## Local Development & Quickstart

### 1. Frontend PWA
```bash
npm install
npm run dev
```

### 2. Python FastAPI Backend Service
```bash
cd backend-python
pip install -r requirements.txt
python main.py
```

### 3. C++20 Verification Core
```bash
cd core-cpp
mkdir build && cd build
cmake ..
cmake --build .
./dayspark_verifier
```


## Gym upgrade

DaySpark now has five primary tabs: Today, Calendar, Gym, Goals, and Log. On the first Gym visit, choose a primary goal, fixed or flexible rest, training weekdays and weekly target, a routine, and metric or imperial units. Fixed rest marks the chosen weekdays; flexible rest can replace a training or open day until its weekly allowance is used.

Completed workouts require a live-camera proof photo. Photos remain private in `dayspark-private/proofs`; there is no device-gallery or file-upload fallback. Each seven qualifying, proof-backed workouts grows at most one Gym Streak Safe; seven productive days also grow a separate app-wide Safe.

For an existing installation, back up the database and private proof directory, deploy the new files without replacing `dayspark-private/config.php`, then import every unapplied SQL file in `database/migrations/` in filename order. New installations only need `database/schema.sql`.
