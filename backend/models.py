"""
models.py - SQLAlchemy ORM models for the Health Symptom Checker.
Designed to be easily migrated from SQLite to MongoDB (MongoEngine) later.
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Session(db.Model):
    """
    Represents a single symptom-checking session.
    Stores the initial symptoms, agentic Q&A flow, and final analysis.
    """

    __tablename__ = "sessions"

    id = db.Column(db.String(64), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # User-supplied symptom description
    symptoms = db.Column(db.Text, nullable=False)

    # Optional patient context (JSON string)
    patient_context = db.Column(db.Text, default="{}")

    # Current state: 'collecting' | 'analyzing' | 'complete' | 'emergency'
    state = db.Column(db.String(20), default="collecting", nullable=False)

    # Number of follow-up questions already asked
    followup_count = db.Column(db.Integer, default=0, nullable=False)

    # Final analysis JSON (stored as text)
    analysis_result = db.Column(db.Text, default="")

    # Urgency level determined by analysis
    urgency_level = db.Column(db.String(20), default="")

    # Whether this session triggered emergency detection
    is_emergency = db.Column(db.Boolean, default=False, nullable=False)

    # Relationship to Q&A entries
    followups = db.relationship(
        "FollowUp", backref="session", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self) -> dict:
        """Serialize session to a dictionary."""
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat() + "Z",
            "updated_at": self.updated_at.isoformat() + "Z",
            "symptoms": self.symptoms,
            "state": self.state,
            "followup_count": self.followup_count,
            "urgency_level": self.urgency_level,
            "is_emergency": self.is_emergency,
            "followups": [f.to_dict() for f in self.followups],
        }


class FollowUp(db.Model):
    """
    Represents a single follow-up question and user answer within a session.
    """

    __tablename__ = "followups"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    session_id = db.Column(
        db.String(64), db.ForeignKey("sessions.id"), nullable=False
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, default="")
    order = db.Column(db.Integer, default=0, nullable=False)

    def to_dict(self) -> dict:
        """Serialize follow-up to a dictionary."""
        return {
            "id": self.id,
            "question": self.question,
            "answer": self.answer,
            "order": self.order,
            "created_at": self.created_at.isoformat() + "Z",
        }


class Report(db.Model):
    """
    Stores generated PDF reports linked to a session.
    """

    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    session_id = db.Column(
        db.String(64), db.ForeignKey("sessions.id"), nullable=False
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # PDF stored as binary blob (or path if file-system storage is used)
    pdf_data = db.Column(db.LargeBinary, nullable=True)
    pdf_path = db.Column(db.String(512), default="")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "session_id": self.session_id,
            "created_at": self.created_at.isoformat() + "Z",
            "pdf_path": self.pdf_path,
        }
