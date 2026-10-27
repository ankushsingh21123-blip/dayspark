# DaySpark Python API Engine ⚡🐍

A high-performance asynchronous RESTful backend service for **DaySpark**, built with **Python 3.12**, **FastAPI**, **Pydantic v2**, and **AsyncIO**.

---

## 🚀 Features

- ⚡ **Asynchronous REST Architecture**: Sub-millisecond response latency using Starlette/FastAPI event loop.
- 🔐 **Session & CSRF Management**: Endpoints for authentication, session verification, and token rotation.
- 📋 **Task & Habit Telemetry**: Complete CRUD lifecycle for tasks, recurrences, and daily completions.
- 🎯 **Goal & Progress Tracking**: Numeric, percentage, and metric tracking endpoints.
- 📸 **Live Camera Proof Pipeline**: Multipart upload verification endpoints for workouts and task proofs.
- 📊 **Unified State Sync**: Single-roundtrip `/api/sync` payload delivering snapshot data for offline IndexedDB sync.

---

## 🛠️ Tech Stack

- **Python**: 3.11+ / 3.12
- **Framework**: FastAPI
- **Validation**: Pydantic v2
- **Server**: Uvicorn ASGI

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the FastAPI server
```bash
uvicorn main:app --reload --port 8080
```

Interactive API documentation available at:
- **Swagger UI**: [http://localhost:8080/docs](http://localhost:8080/docs)
- **ReDoc**: [http://localhost:8080/redoc](http://localhost:8080/redoc)

---

## 👨‍💻 Author

**Ankush Singh**  
- GitHub: [@ankushsingh21123-blip](https://github.com/ankushsingh21123-blip)  
- Email: ankushsingh21123@gmail.com
