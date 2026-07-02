"""
agent_controller.py - Agentic workflow controller.
Orchestrates the multi-step symptom analysis process:
  1. Receive symptoms → detect emergency
  2. Decide if follow-up questions are needed
  3. Ask follow-up questions iteratively
  4. Build final prompt and call Granite
  5. Parse and return structured response
"""

import logging
import uuid

from utils import detect_emergency, identify_symptom_categories, sanitize_input
from prompt_builder import (
    build_analysis_prompt,
    build_followup_prompt,
    build_followup_question_prompt,
)
from ai_service import call_granite_model, parse_model_response
from medical_data import URGENCY_LEVELS

logger = logging.getLogger(__name__)

# Maximum follow-up questions before forcing a final analysis
MAX_FOLLOWUP_QUESTIONS = 3

# Minimum symptom description length before requiring follow-up
MIN_SYMPTOM_LENGTH = 30


class AgentController:
    """
    Stateless controller — all state is passed in and returned.
    This design makes it easy to swap the storage layer later.
    """

    # ------------------------------------------------------------------
    # Step 1: Start a new session
    # ------------------------------------------------------------------

    def start_session(self, symptoms: str, patient_context: dict = None) -> dict:
        """
        Initialize a new analysis session.

        Args:
            symptoms: User's symptom description.
            patient_context: Optional demographic/medical info.

        Returns:
            Session state dict.
        """
        symptoms = sanitize_input(symptoms)
        session_id = str(uuid.uuid4())

        # Emergency check — highest priority
        if detect_emergency(symptoms):
            logger.warning("Session %s: emergency detected.", session_id)
            return {
                "session_id": session_id,
                "state": "emergency",
                "is_emergency": True,
                "message": (
                    "⚠️ Based on your symptoms, this may be a medical emergency. "
                    "Please call emergency services (911 / 999 / 112) immediately "
                    "or go to the nearest emergency room. Do not wait."
                ),
                "symptoms": symptoms,
                "followup_count": 0,
                "followups": [],
                "analysis": None,
            }

        # Decide if we need follow-up questions
        needs_followup = self._needs_followup(symptoms)
        state = "collecting" if needs_followup else "ready_to_analyze"

        session = {
            "session_id": session_id,
            "state": state,
            "is_emergency": False,
            "symptoms": symptoms,
            "patient_context": patient_context or {},
            "followup_count": 0,
            "followups": [],  # list of {"question": str, "answer": str}
            "analysis": None,
        }

        if needs_followup:
            question = self._generate_followup_question(symptoms, already_asked=[])
            session["current_question"] = question
            session["message"] = question
        else:
            session["message"] = "I have enough information. Analyzing your symptoms now..."

        return session

    # ------------------------------------------------------------------
    # Step 2: Process a follow-up answer and decide next step
    # ------------------------------------------------------------------

    def process_followup(self, session: dict, answer: str) -> dict:
        """
        Record the user's answer to the current follow-up question and
        determine whether to ask another question or proceed to analysis.

        Args:
            session: Current session state dict (mutated in place).
            answer: User's answer to the last question.

        Returns:
            Updated session state dict.
        """
        answer = sanitize_input(answer)

        # Record the answer for the last question
        if session.get("current_question"):
            session["followups"].append(
                {"question": session["current_question"], "answer": answer}
            )
            session["followup_count"] = len(session["followups"])

        # Check if we need more questions
        already_asked = [f["question"] for f in session["followups"]]

        if session["followup_count"] < MAX_FOLLOWUP_QUESTIONS and self._still_needs_info(
            session
        ):
            question = self._generate_followup_question(
                session["symptoms"], already_asked=already_asked
            )
            session["current_question"] = question
            session["state"] = "collecting"
            session["message"] = question
        else:
            # Enough information — move to analysis
            session["state"] = "ready_to_analyze"
            session["current_question"] = None
            session["message"] = "Thank you! Analyzing your complete symptom history now..."

        return session

    # ------------------------------------------------------------------
    # Step 3: Run final analysis
    # ------------------------------------------------------------------

    def run_analysis(self, session: dict) -> dict:
        """
        Generate the final structured health guidance using IBM Granite.

        Args:
            session: Current session state dict.

        Returns:
            Updated session dict with analysis result.
        """
        symptoms = session["symptoms"]
        patient_context = session.get("patient_context", {})
        followups = session.get("followups", [])

        if followups:
            # Build enriched prompt with conversation history
            last_answer = followups[-1]["answer"] if followups else ""
            prompt = build_followup_prompt(
                original_symptoms=symptoms,
                conversation_history=followups[:-1],
                latest_answer=last_answer,
                patient_context=patient_context,
            )
        else:
            prompt = build_analysis_prompt(symptoms, patient_context)

        try:
            raw_response = call_granite_model(prompt)
            parsed = parse_model_response(raw_response)
        except RuntimeError as exc:
            logger.error("Analysis failed: %s", exc)
            session["state"] = "error"
            session["error"] = str(exc)
            return session

        session["state"] = "complete"
        session["analysis"] = parsed
        session["urgency_level"] = parsed.get("urgency_level", "LOW")
        session["message"] = "Analysis complete."
        return session

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _needs_followup(self, symptoms: str) -> bool:
        """
        Decide whether the symptom description needs follow-up questions.
        Returns True if the description is too short or lacks key context.
        """
        if len(symptoms) < MIN_SYMPTOM_LENGTH:
            return True
        # Check for key contextual words already present
        context_words = ["since", "for", "days", "hours", "weeks", "started", "began"]
        has_temporal = any(w in symptoms.lower() for w in context_words)
        severity_words = ["severe", "mild", "moderate", "slight", "intense", "sharp"]
        has_severity = any(w in symptoms.lower() for w in severity_words)
        return not (has_temporal and has_severity)

    def _still_needs_info(self, session: dict) -> bool:
        """
        After receiving a follow-up answer, decide if more questions are needed.
        Simple heuristic: always ask up to MAX_FOLLOWUP_QUESTIONS unless we have
        enough context words in the combined text.
        """
        combined = session["symptoms"] + " ".join(
            f["answer"] for f in session.get("followups", [])
        )
        context_signals = [
            "days", "hours", "weeks", "severe", "mild", "moderate",
            "history", "medication", "age", "years old",
        ]
        score = sum(1 for signal in context_signals if signal in combined.lower())
        return score < 4  # Need at least 4 context signals

    def _generate_followup_question(
        self, symptoms: str, already_asked: list
    ) -> str:
        """
        Ask IBM Granite to generate a relevant follow-up question.
        Falls back to a generic question if the API call fails.
        """
        prompt = build_followup_question_prompt(symptoms, already_asked)
        try:
            question = call_granite_model(prompt)
            # Clean up: take only the first line / sentence
            question = question.strip().split("\n")[0].strip()
            if not question.endswith("?"):
                question += "?"
            return question
        except RuntimeError as exc:
            logger.warning("Could not generate follow-up question: %s", exc)
            # Fallback questions
            fallbacks = [
                "How long have you been experiencing these symptoms?",
                "On a scale of 1–10, how severe are your symptoms?",
                "Do you have any relevant medical history or current medications?",
            ]
            asked_count = len(already_asked)
            return fallbacks[min(asked_count, len(fallbacks) - 1)]
