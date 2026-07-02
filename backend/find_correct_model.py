"""
find_correct_model.py - Find working IBM Granite model for your project.
Run: python find_correct_model.py  (from backend/ folder with venv active)
"""
import os, sys, json, requests, urllib3
from dotenv import load_dotenv

# Force UTF-8 output on Windows
if sys.stdout.encoding != "utf-8":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"),
            override=True, encoding="utf-8-sig")

urllib3.disable_warnings()

API_KEY    = os.environ.get("IBM_API_KEY",    "").strip()
PROJECT_ID = os.environ.get("IBM_PROJECT_ID", "").strip()
CLOUD_URL  = os.environ.get("IBM_CLOUD_URL",  "https://us-south.ml.cloud.ibm.com").strip()
SSL_VERIFY = os.environ.get("IBM_SSL_VERIFY", "true").lower() != "false"

print("=" * 55)
print("  IBM Granite Model Finder")
print("=" * 55)
print("API_KEY    : ...%s" % API_KEY[-8:])
print("PROJECT_ID : %s" % PROJECT_ID)
print("CLOUD_URL  : %s" % CLOUD_URL)
print("SSL_VERIFY : %s" % SSL_VERIFY)
print("-" * 55)

# Step 1: IAM token
print("[1] Getting IAM token...")
TOKEN = None
try:
    r = requests.post(
        "https://iam.cloud.ibm.com/identity/token",
        data={"grant_type": "urn:ibm:params:oauth:grant-type:apikey", "apikey": API_KEY},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=30, verify=SSL_VERIFY,
    )
    if r.status_code == 200:
        TOKEN = r.json()["access_token"]
        print("    OK - Token obtained (expires_in=%s)" % r.json().get("expires_in"))
    else:
        print("    FAILED - HTTP %s: %s" % (r.status_code, r.text[:200]))
        sys.exit(1)
except Exception as e:
    print("    FAILED - %s" % e)
    sys.exit(1)

H = {"Authorization": "Bearer %s" % TOKEN,
     "Accept": "application/json",
     "Content-Type": "application/json"}

# Step 2: List available models
print("\n[2] Listing foundation models available at %s ..." % CLOUD_URL)
granite_models = []
try:
    r = requests.get(
        "%s/ml/v1/foundation_model_specs?version=2023-05-29&limit=100" % CLOUD_URL,
        headers=H, timeout=30, verify=SSL_VERIFY,
    )
    if r.status_code == 200:
        all_models = [m["model_id"] for m in r.json().get("resources", [])]
        granite_models = [m for m in all_models if "granite" in m.lower()]
        print("    Total models: %d" % len(all_models))
        print("    Granite models (%d):" % len(granite_models))
        for m in granite_models:
            print("      - %s" % m)
    else:
        print("    FAILED - HTTP %s: %s" % (r.status_code, r.text[:200]))
except Exception as e:
    print("    ERROR - %s" % e)

# Step 3: Test candidates
CANDIDATES = [
    "ibm/granite-3-8b-instruct",
    "ibm/granite-3-2b-instruct",
    "ibm/granite-3b-code-instruct",
    "ibm/granite-7b-instruct",
    "ibm/granite-13b-instruct-v2",
    "ibm/granite-13b-chat-v2",
    "ibm/granite-20b-multilingual",
    "ibm/granite-8b-code-instruct",
]
# Add dynamically discovered ones
for m in granite_models:
    if m not in CANDIDATES:
        CANDIDATES.append(m)

print("\n[3] Testing models with project '%s'..." % PROJECT_ID)
print("    (Will try each until one succeeds)\n")

working_model = None
for model_id in CANDIDATES:
    print("    Testing %-45s ..." % model_id, end=" ", flush=True)
    try:
        r = requests.post(
            "%s/ml/v1/text/generation?version=2023-05-29" % CLOUD_URL,
            headers=H,
            json={
                "input": "Say OK",
                "model_id": model_id,
                "project_id": PROJECT_ID,
                "parameters": {"decoding_method": "greedy", "max_new_tokens": 5},
            },
            timeout=30, verify=SSL_VERIFY,
        )
        if r.status_code == 200:
            resp_text = r.json()["results"][0]["generated_text"].strip()[:30]
            print("PASS  (response: %r)" % resp_text)
            working_model = model_id
            break
        else:
            try:
                err = r.json().get("errors", [{}])[0]
                code = err.get("code", "?")
                msg  = err.get("message", "")[:50]
            except Exception:
                code, msg = r.status_code, r.text[:50]
            print("FAIL  [%s] %s" % (code, msg))
    except Exception as e:
        print("ERROR %s" % str(e)[:50])

print("\n" + "=" * 55)
if working_model:
    print("  WORKING MODEL: %s" % working_model)

    # Auto-update backend/.env
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    with open(env_path, "r", encoding="utf-8-sig") as f:
        lines = f.readlines()

    new_lines = []
    updated = False
    for line in lines:
        if line.startswith("IBM_MODEL_ID="):
            new_lines.append("IBM_MODEL_ID=%s\n" % working_model)
            updated = True
        else:
            new_lines.append(line)
    if not updated:
        new_lines.append("IBM_MODEL_ID=%s\n" % working_model)

    with open(env_path, "w", encoding="utf-8", newline="\n") as f:
        f.writelines(new_lines)

    print("  backend/.env updated with IBM_MODEL_ID=%s" % working_model)
    print("  --> Restart backend: python app.py")
else:
    print("  NO WORKING MODEL FOUND")
    print("\n  Possible causes:")
    print("  1. Watson Machine Learning service NOT properly associated")
    print("     -> Go to: https://dataplatform.cloud.ibm.com/projects/%s" % PROJECT_ID)
    print("     -> Manage tab -> Services & integrations -> Associate service")
    print("     -> Select 'Watson Machine Learning' (Lite plan)")
    print("  2. Wrong region: try IBM_CLOUD_URL=https://eu-gb.ml.cloud.ibm.com")
    print("     or IBM_CLOUD_URL=https://eu-de.ml.cloud.ibm.com")
    print("  3. Lite plan may not support all models")
print("=" * 55)
