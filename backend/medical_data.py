"""
medical_data.py - Trusted medical reference data.
Used for emergency detection and context enrichment.
This data is for educational purposes only.
"""

# ---------------------------------------------------------------------------
# Emergency symptom keywords — trigger immediate emergency redirect
# ---------------------------------------------------------------------------
EMERGENCY_KEYWORDS = [
    "chest pain",
    "chest tightness",
    "heart attack",
    "difficulty breathing",
    "can't breathe",
    "cannot breathe",
    "shortness of breath",
    "loss of consciousness",
    "unconscious",
    "fainted",
    "fainting",
    "severe bleeding",
    "heavy bleeding",
    "uncontrollable bleeding",
    "stroke",
    "face drooping",
    "arm weakness",
    "speech difficulty",
    "sudden numbness",
    "seizure",
    "convulsion",
    "fits",
    "anaphylaxis",
    "allergic reaction",
    "severe allergic",
    "suicidal",
    "overdose",
    "poisoning",
    "choking",
    "not breathing",
    "stopped breathing",
]

# ---------------------------------------------------------------------------
# Follow-up question templates per symptom category
# ---------------------------------------------------------------------------
FOLLOWUP_TEMPLATES = {
    "duration": "How long have you been experiencing {symptom}?",
    "severity": "On a scale of 1–10, how severe is your {symptom}?",
    "location": "Where exactly do you feel the {symptom}? Can you describe the location?",
    "associated": "Are you experiencing any other symptoms alongside {symptom} (e.g., fever, nausea, dizziness)?",
    "medical_history": "Do you have any known medical conditions or allergies that might be relevant?",
    "medications": "Are you currently taking any medications or supplements?",
    "age_gender": "Could you share your age and biological sex to help provide better guidance?",
    "triggers": "Does anything seem to make the {symptom} better or worse?",
    "pattern": "Is the {symptom} constant or does it come and go?",
}

# ---------------------------------------------------------------------------
# Symptom categories for context-aware follow-up selection
# ---------------------------------------------------------------------------
SYMPTOM_CATEGORIES = {
    "respiratory": [
        "cough", "cold", "congestion", "runny nose", "sore throat",
        "breathing", "wheeze", "asthma",
    ],
    "gastrointestinal": [
        "nausea", "vomit", "diarrhea", "constipation", "stomach", "abdomen",
        "bloat", "indigestion", "heartburn", "reflux",
    ],
    "neurological": [
        "headache", "migraine", "dizzy", "dizziness", "confusion",
        "memory", "numbness", "tingling",
    ],
    "musculoskeletal": [
        "pain", "ache", "joint", "muscle", "back", "neck", "shoulder",
        "knee", "swelling", "stiffness",
    ],
    "dermatological": [
        "rash", "itch", "skin", "hives", "blister", "wound", "sore",
    ],
    "systemic": [
        "fever", "fatigue", "tired", "weakness", "weight loss",
        "night sweats", "chills",
    ],
    "cardiovascular": [
        "palpitation", "racing heart", "irregular heartbeat", "swollen legs",
        "ankle swelling",
    ],
    "urological": [
        "urination", "urine", "bladder", "kidney", "painful urination",
        "frequent urination",
    ],
    "mental_health": [
        "anxiety", "depression", "stress", "sleep", "insomnia", "panic",
        "mood",
    ],
}

# ---------------------------------------------------------------------------
# Urgency level definitions for the response formatter
# ---------------------------------------------------------------------------
URGENCY_LEVELS = {
    "LOW": {
        "label": "Low",
        "color": "green",
        "description": (
            "Symptoms are mild and non-urgent. Monitor at home and seek "
            "medical advice if symptoms persist or worsen."
        ),
    },
    "MEDIUM": {
        "label": "Medium",
        "color": "orange",
        "description": (
            "Symptoms may require medical evaluation within 24–48 hours. "
            "Contact your healthcare provider."
        ),
    },
    "HIGH": {
        "label": "High",
        "color": "red",
        "description": (
            "Symptoms are concerning and require prompt medical attention. "
            "Visit an urgent care center or emergency room soon."
        ),
    },
    "EMERGENCY": {
        "label": "Emergency",
        "color": "darkred",
        "description": (
            "This may be a life-threatening emergency. Call emergency services "
            "(911 / 999 / 112) immediately or go to the nearest emergency room."
        ),
    },
}

# ---------------------------------------------------------------------------
# General home care guidelines (fallback)
# ---------------------------------------------------------------------------
GENERAL_HOME_CARE = [
    "Rest adequately and avoid strenuous activities.",
    "Stay well-hydrated by drinking plenty of water.",
    "Monitor your symptoms and note any changes.",
    "Maintain a healthy diet rich in fruits and vegetables.",
    "Avoid known allergens and irritants.",
    "Practice good hand hygiene to prevent infection spread.",
]

# ---------------------------------------------------------------------------
# General prevention tips (fallback)
# ---------------------------------------------------------------------------
GENERAL_PREVENTION = [
    "Maintain a balanced diet and regular exercise routine.",
    "Get recommended vaccinations and health screenings.",
    "Manage stress through mindfulness or relaxation techniques.",
    "Avoid smoking and limit alcohol consumption.",
    "Schedule regular check-ups with your healthcare provider.",
    "Wash hands frequently and maintain good personal hygiene.",
]

# ---------------------------------------------------------------------------
# Emergency contact information template
# ---------------------------------------------------------------------------
EMERGENCY_CONTACTS = {
    "US": "911",
    "UK": "999",
    "EU": "112",
    "Australia": "000",
    "India": "108",
    "General": "Local emergency services number",
}
