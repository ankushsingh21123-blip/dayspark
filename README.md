# DaySpark

A mobile-first, private PWA for recurring tasks, one-time plans, goals, gym progress, photo memories, streaks, focus, meditation, and reflection. Data syncs through a PHP/MySQL API and photos are stored outside the public web root.

## Highlights

- Daily, weekly, monthly, and one-time tasks with calendar and progress views
- Guided Gym goals, routines, planned or flexible rest, records, live-camera proof, and Gym Streak Safe
- Separate private photo libraries for Gym, Goals, Tasks, and Daily Moments
- Optional Daily Moment reminders capped at two per day, plus voluntary camera capture at any time
- Saved workout places, nearby start prompts, and optional time/weather ambience
- Synced app-wide Streak Safe, Pomodoro presets, guided meditation, and light/dark themes

## Local checks

```sh
npm install
docker compose up -d db
npm test -- --run
npm run test:php
npm run typecheck
npm run build
npm run package:hostinger
```

The generated `release/` folder mirrors the safe Hostinger layout. Copy `public_html/` to the domain root, keep `dayspark-private/` beside it, import `database/schema.sql`, and fill the private `config.php` from its example.

## Gym upgrade

DaySpark now has five primary tabs: Today, Calendar, Gym, Goals, and Log. On the first Gym visit, choose a primary goal, fixed or flexible rest, training weekdays and weekly target, a routine, and metric or imperial units. Fixed rest marks the chosen weekdays; flexible rest can replace a training or open day until its weekly allowance is used.

Completed workouts require a live-camera proof photo. Photos remain private in `dayspark-private/proofs`; there is no device-gallery or file-upload fallback. Each seven qualifying, proof-backed workouts grows at most one Gym Streak Safe; seven productive days also grow a separate app-wide Safe.

For an existing installation, back up the database and private proof directory, deploy the new files without replacing `dayspark-private/config.php`, then import every unapplied SQL file in `database/migrations/` in filename order. New installations only need `database/schema.sql`.
