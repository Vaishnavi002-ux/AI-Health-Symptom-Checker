"""
prompt_builder.py - Constructs structured prompts for IBM Granite model.
Follows a clear template so the model always returns parseable, safe responses.
"""

# ---------------------------------------------------------------------------
# System prompt — tuned for ibm/granite-3-8b-instruct
# Uses <|system|> / <|user|> / <|assistant|> chat format that Granite 3
# understands best, which maximises structured output reliability.
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """<|system|>
You are HealthAI, a medical education assistant powered by IBM Granite.
Provide general health education only. NEVER diagnose or prescribe.

RULES:
1. Never diagnose diseases or prescribe medications.
2. Always advise consulting a qualified healthcare professional.
3. For life-threatening symptoms, immediately advise calling emergency services.
4. Be empathetic, clear, and evidence-based.
5. Always include the disclaimer section.

Respond using EXACTLY this format — no extra text before or after:

## Possible Conditions
- [Condition name]: [brief educational description]
- [Condition name]: [brief educational description]

## Urgency Level
[write only one word: LOW or MEDIUM or HIGH or EMERGENCY]

## Reason
[One sentence explaining the urgency level]

## Home Care
- [tip]
- [tip]

## Preventive Measures
- [measure]
- [measure]

## When to Consult a Doctor
- [scenario]
- [scenario]

## Emergency Warning
[Leave blank if LOW/MEDIUM. Write warning if HIGH/EMERGENCY.]

## Disclaimer
This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.
<|assistant|>"""


def build_analysis_prompt(symptoms: str, patient_context: dict = None) -> str:
    """Build the full prompt for initial symptom analysis."""
    context_block = _build_context_block(patient_context)
    prompt = f"""{SYSTEM_PROMPT}
<|user|>
Patient symptoms: {symptoms}
{context_block}
Analyze the symptoms above and respond using the exact format specified.
<|assistant|>"""
    return prompt


def build_followup_prompt(
    original_symptoms: str,
    conversation_history: list,
    latest_answer: str,
    patient_context: dict = None,
) -> str:
    """Build a prompt with full follow-up Q&A history for enriched analysis."""
    context_block = _build_context_block(patient_context)
    history_block = _build_history_block(conversation_history)
    prompt = f"""{SYSTEM_PROMPT}
<|user|>
Initial symptoms: {original_symptoms}
{context_block}
Follow-up conversation:
{history_block}
Latest answer: {latest_answer}

Provide a comprehensive educational analysis using the exact format specified.
<|assistant|>"""
    return prompt


def build_followup_question_prompt(
    symptoms: str, already_asked: list = None
) -> str:
    """Build a prompt asking Granite to generate ONE follow-up question."""
    asked_block = ""
    if already_asked:
        asked_block = "Already asked (do not repeat):\n" + "\n".join(
            f"- {q}" for q in already_asked
        )

    prompt = f"""<|system|>
You are a medical intake assistant. Generate exactly ONE short follow-up question.
<|user|>
Patient described: "{symptoms}"
{asked_block}
Write one empathetic follow-up question to clarify duration, severity, location, or medical history. Output only the question, nothing else.
<|assistant|>"""
    return prompt


def build_report_prompt(session_data: dict) -> str:
    """
    Build a prompt to generate a structured PDF-ready health report.

    Args:
        session_data: Full session dict containing symptoms, Q&A, and analysis.

    Returns:
        Formatted prompt string.
    """
    symptoms = session_data.get("symptoms", "")
    analysis = session_data.get("analysis", "")
    timestamp = session_data.get("timestamp", "")

    prompt = f"""{SYSTEM_PROMPT}

---

HEALTH ASSESSMENT REPORT REQUEST
Date: {timestamp}

USER SYMPTOMS:
{symptoms}

PREVIOUS ANALYSIS:
{analysis}

Please generate a clean, structured health education report suitable for the user to share with their doctor. Include all sections from the standard format and add a summary at the top."""
    return prompt


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------

def _build_context_block(patient_context: dict) -> str:
    """Format patient context into a readable block."""
    if not patient_context:
        return ""
    parts = []
    if patient_context.get("age"):
        parts.append(f"Age: {patient_context['age']}")
    if patient_context.get("gender"):
        parts.append(f"Biological Sex: {patient_context['gender']}")
    if patient_context.get("medical_history"):
        parts.append(f"Medical History: {patient_context['medical_history']}")
    if patient_context.get("medications"):
        parts.append(f"Current Medications: {patient_context['medications']}")
    if not parts:
        return ""
    return "\nPATIENT CONTEXT:\n" + "\n".join(parts) + "\n"


def _build_history_block(history: list) -> str:
    """Format Q&A conversation history into a readable block."""
    if not history:
        return "(No prior follow-up questions)"
    lines = []
    for i, item in enumerate(history, 1):
        lines.append(f"Q{i}: {item.get('question', '')}")
        lines.append(f"A{i}: {item.get('answer', '')}")
    return "\n".join(lines)
