"""
utils.py - Utility functions for the Health Symptom Checker backend.
"""

import re
import logging
from datetime import datetime
from medical_data import EMERGENCY_KEYWORDS, SYMPTOM_CATEGORIES

logger = logging.getLogger(__name__)


def detect_emergency(text: str) -> bool:
    """
    Scan user input for emergency keywords.
    Returns True if any emergency keyword is found.

    Args:
        text: Raw user input string.

    Returns:
        bool: True if emergency keywords detected.
    """
    lowered = text.lower()
    for keyword in EMERGENCY_KEYWORDS:
        if keyword in lowered:
            logger.warning("Emergency keyword detected: '%s'", keyword)
            return True
    return False


def identify_symptom_categories(text: str) -> list:
    """
    Identify which symptom categories are present in the user's input.

    Args:
        text: User symptom description.

    Returns:
        List of matched category names.
    """
    lowered = text.lower()
    matched = []
    for category, keywords in SYMPTOM_CATEGORIES.items():
        if any(kw in lowered for kw in keywords):
            matched.append(category)
    return matched


def sanitize_input(text: str) -> str:
    """
    Sanitize user input — strip excess whitespace and remove control characters.

    Args:
        text: Raw input string.

    Returns:
        Sanitized string.
    """
    if not isinstance(text, str):
        return ""
    # Remove control characters
    text = re.sub(r"[\x00-\x1f\x7f]", " ", text)
    # Collapse multiple spaces
    text = re.sub(r"\s+", " ", text).strip()
    return text[:2000]  # Hard cap at 2000 chars


def validate_analyze_payload(data: dict) -> tuple:
    """
    Validate the payload for /analyze endpoint.

    Args:
        data: Request JSON payload.

    Returns:
        (is_valid: bool, error_message: str)
    """
    if not data:
        return False, "Request body is required."
    symptoms = data.get("symptoms", "")
    if not symptoms or not isinstance(symptoms, str):
        return False, "Field 'symptoms' is required and must be a string."
    if len(symptoms.strip()) < 5:
        return False, "Please describe your symptoms in more detail (at least 5 characters)."
    if len(symptoms) > 2000:
        return False, "Symptom description is too long (max 2000 characters)."
    return True, ""


def validate_followup_payload(data: dict) -> tuple:
    """
    Validate the payload for /followup endpoint.

    Args:
        data: Request JSON payload.

    Returns:
        (is_valid: bool, error_message: str)
    """
    if not data:
        return False, "Request body is required."
    if not data.get("session_id"):
        return False, "Field 'session_id' is required."
    if not data.get("answer") or not isinstance(data.get("answer"), str):
        return False, "Field 'answer' is required and must be a string."
    return True, ""


def format_timestamp() -> str:
    """Return current UTC timestamp as ISO 8601 string."""
    return datetime.utcnow().isoformat() + "Z"


def build_error_response(message: str, code: int = 400) -> dict:
    """
    Build a standardized error response dict.

    Args:
        message: Human-readable error description.
        code: HTTP status code.

    Returns:
        dict with error details.
    """
    return {
        "success": False,
        "error": message,
        "timestamp": format_timestamp(),
    }


def build_success_response(data: dict) -> dict:
    """
    Build a standardized success response dict.

    Args:
        data: Response payload.

    Returns:
        dict with success wrapper.
    """
    return {
        "success": True,
        "timestamp": format_timestamp(),
        **data,
    }
