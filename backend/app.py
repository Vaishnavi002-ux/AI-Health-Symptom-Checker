"""
app.py - Flask application factory and entry point.
Fixes: CORS headers, proper dotenv loading, all blueprints registered.
"""

import logging
import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load .env from backend directory — override=True ensures it wins over
# any empty values that may have been set before this module loaded.
# encoding='utf-8-sig' strips Windows UTF-8 BOM if present.
_env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(_env_path, override=True, encoding='utf-8-sig')

from config import config
from models import db
from routes import api

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def create_app(config_name: str = None) -> Flask:
    app = Flask(__name__)

    env = config_name or os.environ.get("FLASK_ENV", "default")
    app.config.from_object(config[env])

    # --- FIX: Permissive CORS for development ---
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "Accept"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    db.init_app(app)
    app.register_blueprint(api)

    with app.app_context():
        db.create_all()
        logger.info("Database tables verified/created.")

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"success": False, "error": "Endpoint not found."}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({"success": False, "error": "Method not allowed."}), 405

    @app.errorhandler(500)
    def internal_error(error):
        logger.error("Internal server error: %s", error)
        return jsonify({"success": False, "error": "Internal server error."}), 500

    logger.info("HealthAI backend initialized (env=%s).", env)
    return app


if __name__ == "__main__":
    flask_app = create_app()
    flask_app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=flask_app.config["DEBUG"],
    )
