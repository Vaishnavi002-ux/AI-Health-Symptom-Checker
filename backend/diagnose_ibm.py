"""
diagnose_ibm.py — Run this from the backend/ folder to:
1. Verify .env loads correctly
2. Get a fresh IAM token
3. List all watsonx.ai projects your API key can access
4. List available models in your project
5. Test the Granite model with a simple prompt

Usage:
    cd backend
    python diagnose_ibm.py
"""

import os, sys, json, requests
from dotenv import load_dotenv

_env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(_env_path, override=True, encoding="utf-8-sig")

API_KEY    = os.environ.get("IBM_API_KEY",    "").strip()
PROJECT_ID = os.environ.get("IBM_PROJECT_ID", "").strip()
CLOUD_URL  = os.environ.get("IBM_CLOUD_URL",  "https://us-south.ml.cloud.ibm.com").strip()
MODEL_ID   = os.environ.get("IBM_MODEL_ID",   "ibm/granite-13b-chat-v2").strip()

def sep(): print("-" * 60)

print("=" * 60)
print("  HealthAI — IBM Credentials Diagnostic")
print("=" * 60)
print(f"  .env path      : {_env_path}")
print(f"  IBM_API_KEY    : {'SET (...' + API_KEY[-8:] + ')' if API_KEY else '❌ MISSING'}")
print(f"  IBM_PROJECT_ID : {PROJECT_ID or '❌ MISSING'}")
print(f"  IBM_CLOUD_URL  : {CLOUD_URL}")
print(f"  IBM_MODEL_ID   : {MODEL_ID}")
print("=" * 60)

if not API_KEY:
    print("\n❌ IBM_API_KEY is missing in backend/.env — stopping.")
    sys.exit(1)

# ── 1. Get IAM Token ─────────────────────────────────────────────────────────
sep()
print("[1] Getting IAM token...")
try:
    r = requests.post(
        "https://iam.cloud.ibm.com/identity/token",
        data={"grant_type": "urn:ibm:params:oauth:grant-type:apikey", "apikey": API_KEY},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=30,
    )
    r.raise_for_status()
    TOKEN = r.json()["access_token"]
    print(f"    ✅ IAM token obtained (expires_in={r.json().get('expires_in')}s)")
except Exception as e:
    print(f"    ❌ IAM token failed: {e}")
    sys.exit(1)

HEADERS = {"Authorization": f"Bearer {TOKEN}", "Accept": "application/json"}

# ── 2. List Projects ──────────────────────────────────────────────────────────
sep()
print("[2] Listing your IBM watsonx.ai projects...")
try:
    r = requests.get(
        "https://api.dataplatform.cloud.ibm.com/v2/projects?limit=20",
        headers=HEADERS, timeout=30,
    )
    r.raise_for_status()
    projects = r.json().get("resources", [])
    if not projects:
        print("    ⚠  No projects found.")
        print("    → Go to https://dataplatform.cloud.ibm.com/ and create a project,")
        print("      then associate Watson Machine Learning service with it.")
    else:
        print(f"    Found {len(projects)} project(s):\n")
        found_ids = []
        for p in projects:
            guid = p.get("metadata", {}).get("guid", "?")
            name = p.get("entity", {}).get("name", "Unnamed")
            found_ids.append(guid)
            marker = " ← CURRENT" if guid == PROJECT_ID else ""
            print(f"    Name : {name}")
            print(f"    ID   : {guid}{marker}")
            print()

        if PROJECT_ID in found_ids:
            print(f"    ✅ Your IBM_PROJECT_ID is valid and found.")
        else:
            print(f"    ❌ IBM_PROJECT_ID '{PROJECT_ID}' NOT in your project list.")
            print(f"    → Update backend/.env with one of the IDs above.")
except Exception as e:
    print(f"    ❌ Could not list projects: {e}")

# ── 3. List Available Models ──────────────────────────────────────────────────
sep()
print("[3] Listing available Granite / foundation models...")
GRANITE_MODELS = []
try:
    r = requests.get(
        f"{CLOUD_URL}/ml/v1/foundation_model_specs?version=2023-05-29&limit=50",
        headers=HEADERS, timeout=30,
    )
    r.raise_for_status()
    specs = r.json().get("resources", [])
    print(f"    Total models available: {len(specs)}")
    print("    Granite models:")
    for m in specs:
        mid = m.get("model_id", "")
        if "granite" in mid.lower():
            GRANITE_MODELS.append(mid)
            marker = " ← CURRENT" if mid == MODEL_ID else ""
            print(f"      {mid}{marker}")
    if not GRANITE_MODELS:
        print("      (none found — your account may not have Granite access)")
except Exception as e:
    print(f"    ❌ Could not list models: {e}")

# ── 4. Test Model Call ────────────────────────────────────────────────────────
sep()
test_model = MODEL_ID
# If current model not in list, try first available Granite model
if GRANITE_MODELS and MODEL_ID not in GRANITE_MODELS:
    test_model = GRANITE_MODELS[0]
    print(f"[4] Configured model '{MODEL_ID}' not found.")
    print(f"    → Testing with first available Granite model: {test_model}")
else:
    print(f"[4] Testing model call: {test_model}")

if not PROJECT_ID:
    print("    Skipped — IBM_PROJECT_ID is empty.")
else:
    try:
        r = requests.post(
            f"{CLOUD_URL}/ml/v1/text/generation?version=2023-05-29",
            headers={**HEADERS, "Content-Type": "application/json"},
            json={
                "input": "Respond with exactly: IBM Granite is working!",
                "model_id": test_model,
                "project_id": PROJECT_ID,
                "parameters": {"decoding_method": "greedy", "max_new_tokens": 15},
            },
            timeout=60,
        )
        if r.status_code == 200:
            text = r.json()["results"][0]["generated_text"].strip()
            print(f"    ✅ Model responded: {text!r}")
            print()
            print("=" * 60)
            print("  🎉 SUCCESS — IBM Granite is working!")

            if test_model != MODEL_ID:
                print()
                print(f"  ⚠  IMPORTANT: Your configured model is wrong.")
                print(f"     Change IBM_MODEL_ID in backend/.env to:")
                print(f"     IBM_MODEL_ID={test_model}")
            print("=" * 60)
        else:
            err = r.json()
            code = err.get("errors", [{}])[0].get("code", "?")
            msg  = err.get("errors", [{}])[0].get("message", r.text[:300])
            print(f"    ❌ HTTP {r.status_code} [{code}]: {msg}")
            if code == "container_not_found":
                print()
                print("  → The project_id is not enabled for Watson Machine Learning.")
                print("  → Go to your project in IBM Cloud → Manage → Services & integrations")
                print("  → Click 'Associate service' → Add 'Watson Machine Learning'")
    except Exception as e:
        print(f"    ❌ Model call failed: {e}")
