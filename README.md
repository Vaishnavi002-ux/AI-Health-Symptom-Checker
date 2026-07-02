# Agentic AI Health Symptom Checker

> **Educational purposes only.** This application is not a substitute for professional medical advice, diagnosis, or treatment.

## Overview

An AI-powered health symptom checker using an **Agentic AI workflow** backed by IBM watsonx.ai Granite on IBM Cloud Lite. Instead of answering immediately, the AI gathers complete context through intelligent follow-up questions before generating structured health guidance.

---

## Features

- Natural language symptom input + voice input
- Agentic follow-up question generation (IBM Granite)
- Possible health conditions (educational, not diagnostic)
- Urgency classification: Low / Medium / High / Emergency
- Emergency keyword detection with instant escalation
- Home care & preventive measure suggestions
- Doctor consultation advice
- Dark mode
- Session history
- Downloadable JSON report
- Responsive UI (mobile-first)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 18, React Router 6, React Icons |
| Backend | Python 3.11+, Flask 3 |
| AI | IBM watsonx.ai, IBM Granite (`ibm/granite-13b-chat-v2`) |
| Cloud | IBM Cloud Lite |
| Database | SQLite (via Flask-SQLAlchemy) |
| Styling | Custom CSS3 with CSS Variables |

---

## Project Structure

```
Agentic-AI-Health-Checker/
├── backend/
│   ├── app.py                 # Flask application factory
│   ├── routes.py              # API route definitions
│   ├── agent_controller.py    # Agentic workflow orchestrator
│   ├── ai_service.py          # IBM watsonx.ai Granite integration
│   ├── prompt_builder.py      # Structured prompt templates
│   ├── medical_data.py        # Medical reference data & keywords
│   ├── models.py              # SQLAlchemy ORM models
│   ├── utils.py               # Input validation & utilities
│   ├── config.py              # Environment-based configuration
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ChatInterface.js     # Main agentic chat UI
│   │   │   ├── ResultsDisplay.js    # Structured results renderer
│   │   │   ├── ProgressStepper.js   # Workflow progress indicator
│   │   │   └── Disclaimer.js
│   │   ├── pages/
│   │   │   ├── LandingPage.js
│   │   │   ├── AboutPage.js
│   │   │   ├── SymptomCheckerPage.js
│   │   │   ├── EmergencyPage.js
│   │   │   ├── HistoryPage.js
│   │   │   └── ContactPage.js
│   │   ├── services/
│   │   │   └── api.js              # Axios API service layer
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css              # Global styles + CSS variables
│   └── package.json
│
├── docs/
├── .env.example               # Environment variable template
├── .gitignore
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- IBM Cloud Lite account with watsonx.ai access
- IBM Project ID and API Key

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/agentic-ai-health-checker.git
cd agentic-ai-health-checker
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your IBM credentials:

```env
IBM_API_KEY=your-ibm-cloud-api-key
IBM_PROJECT_ID=your-watsonx-project-id
IBM_CLOUD_URL=https://us-south.ml.cloud.ibm.com
IBM_MODEL_ID=ibm/granite-13b-chat-v2
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

### 3. Start the Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Backend runs at: `http://localhost:5000`

### 4. Start the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Start a new symptom analysis session |
| `POST` | `/api/followup` | Submit answer to a follow-up question |
| `GET` | `/api/history` | Retrieve session history |
| `POST` | `/api/generate-report` | Generate a health report for a session |
| `GET` | `/api/health` | Health check |

### POST `/api/analyze`

```json
{
  "symptoms": "I have a headache and fever for 2 days",
  "patient_context": {
    "age": "35",
    "gender": "Female",
    "medical_history": "None",
    "medications": "None"
  }
}
```

### POST `/api/followup`

```json
{
  "session_id": "uuid-here",
  "answer": "The pain is about 7/10 and constant"
}
```

---

## Agentic Workflow

```
User enters symptoms
       ↓
Emergency Detection ─── YES ──▶ Immediate emergency guidance
       │ NO
       ▼
Information Assessment
       ↓
Insufficient? ─── YES ──▶ Generate follow-up question ──▶ User answers
       │ NO                           └──────────────────────┘
       ▼
Build structured prompt (IBM Granite format)
       ↓
IBM Granite inference
       ↓
Parse structured response
       ↓
Display: Conditions | Urgency | Home Care | Prevention | When to See Doctor
```

---

## Safety Rules

This application strictly follows these safety rules:

1. **Never** diagnoses diseases or medical conditions.
2. **Never** prescribes or recommends medications.
3. **Never** suggests medication dosages.
4. **Always** includes an educational disclaimer.
5. **Immediately** escalates potential emergencies to call emergency services.
6. **Encourages** consultation with qualified healthcare professionals.

---

## Upgrading to MongoDB

The database layer is designed for easy migration. Replace `Flask-SQLAlchemy` with `MongoEngine`:

1. Update `requirements.txt`: replace `Flask-SQLAlchemy` with `flask-mongoengine`
2. Rewrite `models.py` using `mongoengine.Document` instead of `db.Model`
3. Update `config.py` `DATABASE_URL` to a MongoDB URI

---

## Deployment on IBM Cloud

1. Create an IBM Cloud Foundry app or IBM Code Engine project
2. Set environment variables in IBM Cloud console (same keys as `.env`)
3. Build the React frontend: `npm run build`
4. Serve the `build/` folder via Flask static files or a separate CDN
5. Deploy the Flask backend with Gunicorn: `gunicorn app:create_app()`

---

## License

MIT License — for educational and demonstration purposes.

---

> **Disclaimer:** This application provides general health education information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
