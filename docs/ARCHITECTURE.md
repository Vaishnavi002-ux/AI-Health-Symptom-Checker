# Architecture Documentation

## System Architecture

```
Browser (React SPA)
        │
        │ HTTP/JSON (axios)
        ▼
Flask Backend (app.py)
        │
   ┌────┴────┐
   │ routes.py│  → Input validation, HTTP handling
   └────┬────┘
        │
   ┌────▼────────────────┐
   │ AgentController      │  → Orchestrates the agentic workflow
   └────┬────────────────┘
        │
   ┌────▼────────────────┐         ┌──────────────────┐
   │ prompt_builder.py   │────────►│ ai_service.py    │
   └─────────────────────┘         │ (IBM Granite API) │
                                   └──────────┬───────┘
                                              │
                                   ┌──────────▼───────┐
                                   │ IBM watsonx.ai   │
                                   │ (IBM Cloud Lite)  │
                                   └──────────────────┘
        │
   ┌────▼────────────────┐
   │ models.py (SQLite)  │  → Session persistence
   └─────────────────────┘
```

## Agentic Workflow State Machine

```
           ┌──────────┐
           │  START   │
           └────┬─────┘
                │ User submits symptoms
                ▼
    ┌───────────────────────┐
    │   Emergency Detection  │
    └───────────┬───────────┘
         │ YES  │ NO
         ▼      ▼
     emergency  ┌───────────────────────┐
     state      │  Information Check    │
                └───────────┬───────────┘
                     │ Needs more │ Sufficient
                     ▼            ▼
              ┌──────────┐  ┌───────────────┐
              │collecting │  │ready_to_analyze│
              └─────┬─────┘  └───────┬───────┘
                    │                │
                    │ User answers   │
                    ▼                ▼
              ┌──────────────────────────┐
              │      run_analysis()       │
              │   (IBM Granite call)      │
              └──────────┬───────────────┘
                         │
                         ▼
                    ┌──────────┐
                    │ complete  │
                    └──────────┘
```

## Database Schema (SQLite)

### sessions
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(64) PK | UUID session identifier |
| created_at | DATETIME | Session creation timestamp |
| updated_at | DATETIME | Last update timestamp |
| symptoms | TEXT | Initial symptom description |
| patient_context | TEXT | JSON patient demographics |
| state | VARCHAR(20) | collecting/analyzing/complete/emergency |
| followup_count | INTEGER | Number of follow-up rounds |
| analysis_result | TEXT | JSON analysis from Granite |
| urgency_level | VARCHAR(20) | LOW/MEDIUM/HIGH/EMERGENCY |
| is_emergency | BOOLEAN | Emergency flag |

### followups
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment |
| session_id | VARCHAR(64) FK | Parent session |
| question | TEXT | AI-generated question |
| answer | TEXT | User's answer |
| order | INTEGER | Question sequence number |
| created_at | DATETIME | Timestamp |

### reports
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment |
| session_id | VARCHAR(64) FK | Parent session |
| pdf_data | BLOB | Binary PDF data |
| pdf_path | VARCHAR(512) | Filesystem path |
| created_at | DATETIME | Creation timestamp |

## API Reference

### POST /api/analyze
Start a new symptom analysis session.

**Request:**
```json
{
  "symptoms": "string (min 5 chars, required)",
  "patient_context": {
    "age": "string (optional)",
    "gender": "string (optional)",
    "medical_history": "string (optional)",
    "medications": "string (optional)"
  }
}
```

**Response (collecting state):**
```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00Z",
  "session_id": "uuid",
  "state": "collecting",
  "message": "How long have you had these symptoms?",
  "current_question": "How long have you had these symptoms?"
}
```

**Response (complete state):**
```json
{
  "success": true,
  "session_id": "uuid",
  "state": "complete",
  "analysis": {
    "possible_conditions": ["..."],
    "urgency_level": "LOW",
    "reason": "...",
    "home_care": ["..."],
    "preventive_measures": ["..."],
    "when_to_consult": ["..."],
    "emergency_warning": "",
    "disclaimer": "..."
  }
}
```

### POST /api/followup
Submit answer to current follow-up question.

**Request:**
```json
{
  "session_id": "uuid (required)",
  "answer": "string (required)"
}
```

### GET /api/history
Retrieve session history with pagination.

**Query params:** `?limit=20&offset=0`

### POST /api/generate-report
Generate a structured report for a completed session.

**Request:** `{ "session_id": "uuid" }`
