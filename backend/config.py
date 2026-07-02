"""
config.py - Application configuration.
All credentials read from environment variables.
dotenv is loaded explicitly from the backend directory before the class
is defined, so class attributes are never frozen as empty strings.
"""

import os
import logging
from dotenv import load_dotenv

# Resolve the .env file path relative to THIS file (backend/.env).
# encoding='utf-8-sig' strips the UTF-8 BOM if present (common on Windows).
_env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
_loaded = load_dotenv(_env_path, override=True, encoding='utf-8-sig')

logging.basicConfig(level=logging.INFO)
_logger = logging.getLogger("config")
_logger.info("dotenv loaded=%s from %s", _loaded, _env_path)
_logger.info(
    "IBM_API_KEY=%s  IBM_PROJECT_ID=%s",
    ("SET(..."+os.environ.get("IBM_API_KEY","")[-6:]+")") if os.environ.get("IBM_API_KEY") else "MISSING",
    ("SET(..."+os.environ.get("IBM_PROJECT_ID","")[-6:]+")") if os.environ.get("IBM_PROJECT_ID") else "MISSING",
)


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "healthai-dev-key-2024")
    DEBUG = os.environ.get("FLASK_DEBUG", "True").lower() == "true"

    # IBM watsonx.ai — read at class-definition time (after dotenv loaded above)
    IBM_API_KEY = os.environ.get("IBM_API_KEY", "")
    IBM_PROJECT_ID = os.environ.get("IBM_PROJECT_ID", "")
    IBM_CLOUD_URL = os.environ.get("IBM_CLOUD_URL", "https://us-south.ml.cloud.ibm.com")
    IBM_MODEL_ID = os.environ.get("IBM_MODEL_ID", "ibm/granite-13b-chat-v2")
    IBM_IAM_URL = "https://iam.cloud.ibm.com/identity/token"

    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///health_checker.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS — open for development
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")

    # Granite model parameters
    MAX_NEW_TOKENS = int(os.environ.get("MAX_NEW_TOKENS", "1000"))
    MIN_NEW_TOKENS = int(os.environ.get("MIN_NEW_TOKENS", "50"))
    TEMPERATURE = float(os.environ.get("TEMPERATURE", "0.7"))
    TOP_P = float(os.environ.get("TOP_P", "0.9"))
    REPETITION_PENALTY = float(os.environ.get("REPETITION_PENALTY", "1.1"))


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
