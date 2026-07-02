"""
routes.py - All Flask API routes.
Endpoints: analyze, followup, history, generate-report, disease-info,
           medicine-info, health-tips, dashboard-stats, health-check.
"""

import json
import logging
from flask import Blueprint, request, jsonify

from utils import (
    validate_analyze_payload,
    validate_followup_payload,
    sanitize_input,
    build_error_response,
    build_success_response,
    format_timestamp,
)
from agent_controller import AgentController
from models import db, Session, FollowUp
from ai_service import call_granite_model

logger = logging.getLogger(__name__)
api = Blueprint("api", __name__, url_prefix="/api")
agent = AgentController()


# ── OPTIONS preflight passthrough ──────────────────────────────────────────
@api.route("/<path:path>", methods=["OPTIONS"])
def options_handler(path):
    return jsonify({}), 200


# ── POST /api/analyze ───────────────────────────────────────────────────────
@api.route("/analyze", methods=["POST", "OPTIONS"])
def analyze():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.get_json(silent=True)
    is_valid, error_msg = validate_analyze_payload(data)
    if not is_valid:
        return jsonify(build_error_response(error_msg)), 400

    symptoms = sanitize_input(data["symptoms"])
    patient_context = data.get("patient_context", {})

    session_state = agent.start_session(symptoms, patient_context)

    try:
        db_session = Session(
            id=session_state["session_id"],
            symptoms=symptoms,
            patient_context=json.dumps(patient_context),
            state=session_state["state"],
            is_emergency=session_state.get("is_emergency", False),
        )
        db.session.add(db_session)
        if session_state.get("current_question"):
            db.session.add(FollowUp(
                session_id=db_session.id,
                question=session_state["current_question"],
                order=0,
            ))
        db.session.commit()
    except Exception as exc:
        logger.error("DB error in /analyze: %s", exc)
        db.session.rollback()

    if session_state["state"] == "ready_to_analyze":
        session_state = agent.run_analysis(session_state)
        _persist_analysis(session_state)

    return jsonify(build_success_response(session_state)), 200


# ── POST /api/followup ──────────────────────────────────────────────────────
@api.route("/followup", methods=["POST", "OPTIONS"])
def followup():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.get_json(silent=True)
    is_valid, error_msg = validate_followup_payload(data)
    if not is_valid:
        return jsonify(build_error_response(error_msg)), 400

    session_id = data["session_id"]
    answer = sanitize_input(data["answer"])

    db_session = Session.query.get(session_id)
    if not db_session:
        return jsonify(build_error_response("Session not found.", 404)), 404

    if db_session.is_emergency:
        return jsonify(build_error_response("Emergency session — call emergency services.")), 400

    session_state = _db_session_to_dict(db_session)
    session_state = agent.process_followup(session_state, answer)

    try:
        pending = (
            FollowUp.query.filter_by(session_id=session_id, answer="")
            .order_by(FollowUp.order.desc())
            .first()
        )
        if pending:
            pending.answer = answer
        db_session.state = session_state["state"]
        db_session.followup_count = session_state["followup_count"]
        if session_state.get("current_question"):
            db.session.add(FollowUp(
                session_id=session_id,
                question=session_state["current_question"],
                order=session_state["followup_count"],
            ))
        db.session.commit()
    except Exception as exc:
        logger.error("DB error in /followup: %s", exc)
        db.session.rollback()

    if session_state["state"] == "ready_to_analyze":
        session_state = agent.run_analysis(session_state)
        _persist_analysis(session_state)

    return jsonify(build_success_response(session_state)), 200


# ── GET /api/history ────────────────────────────────────────────────────────
@api.route("/history", methods=["GET"])
def history():
    try:
        limit = min(int(request.args.get("limit", 20)), 100)
        offset = max(int(request.args.get("offset", 0)), 0)
    except ValueError:
        return jsonify(build_error_response("Invalid pagination parameters.")), 400

    sessions = (
        Session.query.order_by(Session.created_at.desc())
        .offset(offset).limit(limit).all()
    )
    total = Session.query.count()
    return jsonify(build_success_response({
        "total": total, "limit": limit, "offset": offset,
        "sessions": [s.to_dict() for s in sessions],
    })), 200


# ── POST /api/generate-report ───────────────────────────────────────────────
@api.route("/generate-report", methods=["POST", "OPTIONS"])
def generate_report():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.get_json(silent=True)
    if not data or not data.get("session_id"):
        return jsonify(build_error_response("session_id is required.")), 400

    session_id = data["session_id"]
    db_session = Session.query.get(session_id)
    if not db_session:
        return jsonify(build_error_response("Session not found.")), 404

    analysis = json.loads(db_session.analysis_result or "{}")
    report_data = {
        "session_id": session_id,
        "generated_at": format_timestamp(),
        "symptoms": db_session.symptoms,
        "patient_context": json.loads(db_session.patient_context or "{}"),
        "followups": [f.to_dict() for f in db_session.followups],
        "analysis": analysis,
        "urgency_level": db_session.urgency_level,
        "state": db_session.state,
        "disclaimer": (
            "This report is for educational purposes only and is not a substitute "
            "for professional medical advice, diagnosis, or treatment."
        ),
    }
    return jsonify(build_success_response({"report": report_data})), 200


# ── POST /api/disease-info ──────────────────────────────────────────────────
@api.route("/disease-info", methods=["POST", "OPTIONS"])
def disease_info():
    """Ask IBM Granite for educational info about a disease."""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.get_json(silent=True)
    disease = sanitize_input((data or {}).get("disease", ""))
    if not disease:
        return jsonify(build_error_response("'disease' field is required.")), 400

    prompt = f"""You are a medical education AI. Provide clear, structured educational information about: {disease}

Use this exact format:

## Overview
[2-3 sentence overview]

## Common Symptoms
- [symptom 1]
- [symptom 2]
- [symptom 3]

## Causes & Risk Factors
- [cause/risk 1]
- [cause/risk 2]

## Diagnosis
[Brief note on how it is typically diagnosed]

## Treatment Options
- [option 1]
- [option 2]

## Prevention
- [tip 1]
- [tip 2]

## When to See a Doctor
- [scenario 1]

## Disclaimer
This information is for educational purposes only. Always consult a qualified healthcare professional."""

    try:
        raw = call_granite_model(prompt)
        return jsonify(build_success_response({"disease": disease, "content": raw})), 200
    except RuntimeError as exc:
        return jsonify(build_error_response(str(exc))), 503


# ── POST /api/medicine-info ─────────────────────────────────────────────────
@api.route("/medicine-info", methods=["POST", "OPTIONS"])
def medicine_info():
    """Ask IBM Granite for educational info about a medicine."""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.get_json(silent=True)
    medicine = sanitize_input((data or {}).get("medicine", ""))
    if not medicine:
        return jsonify(build_error_response("'medicine' field is required.")), 400

    prompt = f"""You are a medical education AI. Provide structured educational information about the medicine: {medicine}

Use this exact format:

## Medicine Overview
[Generic name, drug class, brief description]

## Common Uses
- [use 1]
- [use 2]

## How It Works
[Brief mechanism of action]

## Common Side Effects
- [side effect 1]
- [side effect 2]

## Important Warnings
- [warning 1]
- [warning 2]

## Drug Interactions (Notable)
- [interaction 1]

## Storage & Handling
[Brief storage instructions]

## Disclaimer
This information is for educational purposes only. NEVER self-medicate. Always consult a licensed healthcare provider or pharmacist before taking any medication."""

    try:
        raw = call_granite_model(prompt)
        return jsonify(build_success_response({"medicine": medicine, "content": raw})), 200
    except RuntimeError as exc:
        return jsonify(build_error_response(str(exc))), 503


# ── POST /api/health-tips ───────────────────────────────────────────────────
@api.route("/health-tips", methods=["POST", "OPTIONS"])
def health_tips():
    """Generate personalized health tips using IBM Granite."""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.get_json(silent=True)
    category = sanitize_input((data or {}).get("category", "general wellness"))
    age = sanitize_input(str((data or {}).get("age", "")))
    gender = sanitize_input((data or {}).get("gender", ""))

    context = f"Age: {age}, Gender: {gender}" if age or gender else "general adult"
    prompt = f"""You are a health education AI. Generate 8 practical, evidence-based health tips for the category: {category}
Patient context: {context}

Format each tip as:
## Tip [N]: [Short Title]
[2-3 sentences of practical advice]

End with:
## Disclaimer
These tips are for educational purposes only and do not constitute medical advice."""

    try:
        raw = call_granite_model(prompt)
        return jsonify(build_success_response({"category": category, "tips": raw})), 200
    except RuntimeError as exc:
        return jsonify(build_error_response(str(exc))), 503


# ── GET /api/dashboard-stats ────────────────────────────────────────────────
@api.route("/dashboard-stats", methods=["GET"])
def dashboard_stats():
    """Return aggregate stats for the dashboard."""
    total = Session.query.count()
    completed = Session.query.filter_by(state="complete").count()
    emergencies = Session.query.filter_by(is_emergency=True).count()
    urgency_counts = {
        "LOW": Session.query.filter_by(urgency_level="LOW").count(),
        "MEDIUM": Session.query.filter_by(urgency_level="MEDIUM").count(),
        "HIGH": Session.query.filter_by(urgency_level="HIGH").count(),
        "EMERGENCY": Session.query.filter_by(urgency_level="EMERGENCY").count(),
    }
    recent = (
        Session.query.order_by(Session.created_at.desc()).limit(5).all()
    )
    return jsonify(build_success_response({
        "total_sessions": total,
        "completed_analyses": completed,
        "emergency_alerts": emergencies,
        "urgency_distribution": urgency_counts,
        "recent_sessions": [s.to_dict() for s in recent],
    })), 200


# ── GET /api/health ─────────────────────────────────────────────────────────
@api.route("/health", methods=["GET"])
def health_check():
    from config import Config
    ibm_configured = bool(Config.IBM_API_KEY and Config.IBM_PROJECT_ID)
    return jsonify({
        "status": "ok",
        "timestamp": format_timestamp(),
        "ibm_configured": ibm_configured,
        "version": "2.0.0",
    }), 200


# ── Helpers ─────────────────────────────────────────────────────────────────
def _db_session_to_dict(db_session):
    followups = [
        {"question": f.question, "answer": f.answer}
        for f in sorted(db_session.followups, key=lambda x: x.order)
    ]
    unanswered = next((f.question for f in db_session.followups if not f.answer), None)
    return {
        "session_id": db_session.id,
        "state": db_session.state,
        "is_emergency": db_session.is_emergency,
        "symptoms": db_session.symptoms,
        "patient_context": json.loads(db_session.patient_context or "{}"),
        "followup_count": db_session.followup_count,
        "followups": followups,
        "current_question": unanswered,
        "analysis": json.loads(db_session.analysis_result or "{}") or None,
        "urgency_level": db_session.urgency_level,
    }


def _persist_analysis(session_state: dict):
    try:
        db_session = Session.query.get(session_state["session_id"])
        if db_session:
            db_session.state = session_state["state"]
            db_session.analysis_result = json.dumps(session_state.get("analysis", {}))
            db_session.urgency_level = session_state.get("urgency_level", "")
            db.session.commit()
    except Exception as exc:
        logger.error("Failed to persist analysis: %s", exc)
        db.session.rollback()
