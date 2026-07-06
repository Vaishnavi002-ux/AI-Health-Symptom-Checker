"""
ai_service.py - IBM watsonx.ai Granite integration.
Reads credentials from os.environ at call-time.
Includes retry logic and SSL fallback for corporate/proxy networks.
"""

import logging
import os
import time
import requests
import urllib3
from dotenv import load_dotenv

# Load .env explicitly — encoding='utf-8-sig' strips Windows BOM
load_dotenv(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"),
    override=True,
    encoding="utf-8-sig",
)

logger = logging.getLogger(__name__)

# ── IAM token cache ──────────────────────────────────────────────────────────
_token_cache = {"access_token": None, "expiry": 0, "api_key": ""}
TOKEN_EXPIRY_BUFFER = 300   # refresh 5 min before expiry
MAX_RETRIES = 3             # retry on transient connection errors
RETRY_DELAY = 2             # seconds between retries


def _get_credentials() -> dict:
    """Re-read .env on every call so a key change takes effect without restart."""
    _env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    load_dotenv(_env_file, override=True, encoding="utf-8-sig")
    return {
        "api_key":    os.environ.get("IBM_API_KEY",    "").strip(),
        "project_id": os.environ.get("IBM_PROJECT_ID", "").strip(),
        "cloud_url":  os.environ.get("IBM_CLOUD_URL",  "https://us-south.ml.cloud.ibm.com").strip(),
        "model_id":   os.environ.get("IBM_MODEL_ID",   "ibm/granite-3-8b-instruct").strip(),
        "iam_url":    "https://iam.cloud.ibm.com/identity/token",
    }


def _make_request(method: str, url: str, **kwargs) -> requests.Response:
    """
    HTTP request with automatic retry on transient errors.
    Falls back to SSL verification disabled if SSL errors occur
    (common with corporate proxies / antivirus SSL inspection).
    """
    # Detect if SSL verification should be skipped (env flag for corporate networks)
    ssl_verify = os.environ.get("IBM_SSL_VERIFY", "true").lower() != "false"

    last_exc = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            kwargs.setdefault("timeout", 45)
            kwargs["verify"] = ssl_verify
            if not ssl_verify:
                urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
            resp = requests.request(method, url, **kwargs)
            return resp

        except requests.exceptions.SSLError as exc:
            logger.warning("SSL error on attempt %d — retrying without SSL verify: %s", attempt, exc)
            ssl_verify = False  # auto-fallback for subsequent attempts
            kwargs["verify"] = False
            last_exc = exc

        except (
            requests.exceptions.ConnectionError,
            requests.exceptions.ChunkedEncodingError,
        ) as exc:
            err_str = str(exc)
            if attempt < MAX_RETRIES and any(
                k in err_str for k in ["RemoteDisconnected", "Connection aborted",
                                       "ConnectionReset", "BrokenPipe", "EOF"]
            ):
                logger.warning(
                    "Transient connection error (attempt %d/%d), retrying in %ds: %s",
                    attempt, MAX_RETRIES, RETRY_DELAY, err_str[:120],
                )
                time.sleep(RETRY_DELAY * attempt)  # exponential back-off
                last_exc = exc
            else:
                raise

        except requests.exceptions.Timeout as exc:
            if attempt < MAX_RETRIES:
                logger.warning("Timeout on attempt %d/%d, retrying...", attempt, MAX_RETRIES)
                time.sleep(RETRY_DELAY)
                last_exc = exc
            else:
                raise

    raise last_exc


def _get_iam_token() -> str:
    """Get a valid IBM IAM bearer token, using cached token if still fresh."""
    creds = _get_credentials()
    api_key = creds["api_key"]

    # Invalidate cache if the API key has changed (e.g. new key written to .env)
    now = time.time()
    if (
        _token_cache["access_token"]
        and now < _token_cache["expiry"] - TOKEN_EXPIRY_BUFFER
        and _token_cache["api_key"] == api_key
    ):
        return _token_cache["access_token"]

    logger.info("Requesting IBM IAM token (key: ...%s)", api_key[-6:] if api_key else "EMPTY")

    try:
        resp = _make_request(
            "POST",
            creds["iam_url"],
            data={
                "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
                "apikey": api_key,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=30,
        )
        resp.raise_for_status()
        token_data = resp.json()
        _token_cache["access_token"] = token_data["access_token"]
        _token_cache["expiry"] = now + token_data.get("expires_in", 3600)
        _token_cache["api_key"] = api_key   # track which key this token belongs to
        logger.info("IBM IAM token obtained successfully.")
        return _token_cache["access_token"]

    except requests.exceptions.ConnectionError as exc:
        err = str(exc)
        if "RemoteDisconnected" in err or "Connection aborted" in err:
            raise RuntimeError(
                "IBM IAM connection was closed by the remote server. "
                "This is usually caused by a corporate firewall, proxy, or antivirus "
                "blocking outbound HTTPS to iam.cloud.ibm.com. "
                "Try: (1) Disable antivirus SSL inspection, (2) Use a different network, "
                "(3) Set IBM_SSL_VERIFY=false in backend/.env for testing."
            ) from exc
        raise RuntimeError(f"IBM IAM connection error: {exc}") from exc

    except requests.exceptions.RequestException as exc:
        raise RuntimeError(f"IBM IAM authentication failed: {exc}") from exc


def call_granite_model(prompt: str) -> str:
    """Send a prompt to IBM Granite and return the generated text."""
    creds = _get_credentials()

    if not creds["api_key"] or not creds["project_id"]:
        raise RuntimeError(
            f"IBM credentials missing — "
            f"IBM_API_KEY={'SET' if creds['api_key'] else 'MISSING'}, "
            f"IBM_PROJECT_ID={'SET' if creds['project_id'] else 'MISSING'}. "
            f"Check backend/.env."
        )

    token = _get_iam_token()

    url = f"{creds['cloud_url']}/ml/v1/text/generation?version=2023-05-29"
    body = {
        "input": prompt,
        "model_id": creds["model_id"],
        "project_id": creds["project_id"],
        "parameters": {
            "decoding_method": "sample",
            "max_new_tokens": int(os.environ.get("MAX_NEW_TOKENS", "1000")),
            "min_new_tokens": int(os.environ.get("MIN_NEW_TOKENS", "50")),
            "temperature":    float(os.environ.get("TEMPERATURE", "0.7")),
            "top_p":          float(os.environ.get("TOP_P", "0.9")),
            "repetition_penalty": float(os.environ.get("REPETITION_PENALTY", "1.1")),
        },
    }

    try:
        logger.info("Calling IBM Granite: %s", creds["model_id"])
        resp = _make_request(
            "POST", url,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            json=body,
            timeout=90,
        )
        resp.raise_for_status()
        generated = resp.json()["results"][0]["generated_text"]
        logger.info("Model response received (%d chars).", len(generated))
        return generated.strip()

    except requests.HTTPError as exc:
        logger.error("IBM watsonx.ai HTTP %s: %s", resp.status_code, resp.text[:400])
        try:
            err_data = resp.json()
            err_code = err_data.get("errors", [{}])[0].get("code", "")
            err_msg  = err_data.get("errors", [{}])[0].get("message", resp.text[:200])
            if err_code == "container_not_found":
                raise RuntimeError(
                    "IBM watsonx.ai project not found. "
                    "Go to your IBM Cloud project → Manage → Services & integrations "
                    "→ Associate 'Watson Machine Learning' service."
                ) from exc
            raise RuntimeError(f"IBM watsonx.ai [{err_code}]: {err_msg}") from exc
        except (ValueError, KeyError):
            raise RuntimeError(f"IBM watsonx.ai HTTP {resp.status_code}") from exc

    except (KeyError, IndexError) as exc:
        raise RuntimeError("Unexpected response format from IBM watsonx.ai.") from exc

    except requests.exceptions.RequestException as exc:
        raise RuntimeError(f"Network error calling IBM watsonx.ai: {exc}") from exc


def parse_model_response(raw_text: str) -> dict:
    """Parse Granite's structured markdown response into a dict."""
    import re

    sections = {
        "possible_conditions": [],
        "urgency_level": "LOW",
        "reason": "",
        "home_care": [],
        "preventive_measures": [],
        "when_to_consult": [],
        "emergency_warning": "",
        "disclaimer": (
            "This information is for educational purposes only and is not a "
            "substitute for professional medical advice, diagnosis, or treatment."
        ),
        "raw_response": raw_text,
    }

    def extract_section(header: str, text: str) -> str:
        pattern = rf"##\s*{re.escape(header)}\s*\n(.*?)(?=\n##|\Z)"
        m = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        return m.group(1).strip() if m else ""

    def extract_bullets(block: str) -> list:
        return [
            line.strip().lstrip("-•*").strip()
            for line in block.splitlines()
            if line.strip().lstrip("-•*").strip()
        ]

    raw = extract_section("Possible Conditions", raw_text)
    if raw:
        sections["possible_conditions"] = extract_bullets(raw)

    raw = extract_section("Urgency Level", raw_text)
    if raw:
        for level in ["EMERGENCY", "HIGH", "MEDIUM", "LOW"]:
            if level in raw.upper():
                sections["urgency_level"] = level
                break

    sections["reason"] = extract_section("Reason", raw_text)

    raw = extract_section("Home Care", raw_text)
    if raw:
        sections["home_care"] = extract_bullets(raw)

    raw = extract_section("Preventive Measures", raw_text)
    if raw:
        sections["preventive_measures"] = extract_bullets(raw)

    raw = extract_section("When to Consult a Doctor", raw_text)
    if raw:
        sections["when_to_consult"] = extract_bullets(raw)

    sections["emergency_warning"] = extract_section("Emergency Warning", raw_text)

    raw = extract_section("Disclaimer", raw_text)
    if raw:
        sections["disclaimer"] = raw

    return sections
