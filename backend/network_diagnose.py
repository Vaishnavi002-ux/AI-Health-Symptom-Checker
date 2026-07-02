"""
network_diagnose.py — Diagnose IBM IAM connectivity issues.
Run from backend/ folder: python network_diagnose.py
"""

import os, sys, ssl, socket, time
import urllib.request
import urllib.error

print("=" * 60)
print("  HealthAI — Network & IBM IAM Connectivity Diagnostic")
print("=" * 60)

# ── 1. Python & SSL info ─────────────────────────────────────────────────────
print(f"\n[1] Python version : {sys.version}")
print(f"    SSL version    : {ssl.OPENSSL_VERSION}")
print(f"    SSL default ctx: TLSv1.2+ supported = {ssl.HAS_TLSv1_2}")

# ── 2. Basic internet check ──────────────────────────────────────────────────
print("\n[2] Basic internet connectivity...")
for host, port in [("8.8.8.8", 53), ("1.1.1.1", 53)]:
    try:
        sock = socket.create_connection((host, port), timeout=5)
        sock.close()
        print(f"    ✅ TCP to {host}:{port} OK")
        break
    except Exception as e:
        print(f"    ❌ TCP to {host}:{port} failed: {e}")

# ── 3. DNS resolution ────────────────────────────────────────────────────────
print("\n[3] DNS resolution...")
for host in ["iam.cloud.ibm.com", "us-south.ml.cloud.ibm.com"]:
    try:
        ip = socket.gethostbyname(host)
        print(f"    ✅ {host} → {ip}")
    except Exception as e:
        print(f"    ❌ {host} → FAILED: {e}")

# ── 4. HTTPS port check ──────────────────────────────────────────────────────
print("\n[4] HTTPS port 443 reachability...")
for host in ["iam.cloud.ibm.com", "us-south.ml.cloud.ibm.com"]:
    try:
        sock = socket.create_connection((host, 443), timeout=10)
        sock.close()
        print(f"    ✅ Port 443 reachable: {host}")
    except Exception as e:
        print(f"    ❌ Port 443 blocked:   {host} — {e}")

# ── 5. TLS handshake test ────────────────────────────────────────────────────
print("\n[5] TLS handshake test (iam.cloud.ibm.com)...")
try:
    ctx = ssl.create_default_context()
    with ctx.wrap_socket(
        socket.create_connection(("iam.cloud.ibm.com", 443), timeout=15),
        server_hostname="iam.cloud.ibm.com"
    ) as s:
        print(f"    ✅ TLS OK — protocol={s.version()}, cipher={s.cipher()[0]}")
except Exception as e:
    print(f"    ❌ TLS failed: {e}")
    print("       → Possible causes: corporate firewall, antivirus SSL inspection,")
    print("         proxy blocking IBM Cloud, or outdated SSL certificates.")

# ── 6. HTTP GET test (no auth needed) ────────────────────────────────────────
print("\n[6] HTTP GET test (IBM Cloud status page)...")
try:
    req = urllib.request.Request(
        "https://us-south.ml.cloud.ibm.com/ml/v1/foundation_model_specs?version=2023-05-29&limit=1",
        headers={"Accept": "application/json"},
    )
    # Note: This will return 401 (no auth) but proves the connection works
    try:
        urllib.request.urlopen(req, timeout=15)
    except urllib.error.HTTPError as he:
        if he.code == 401:
            print(f"    ✅ IBM Cloud reachable — got HTTP 401 (expected without auth)")
        else:
            print(f"    ✅ IBM Cloud reachable — got HTTP {he.code}")
    except urllib.error.URLError as ue:
        print(f"    ❌ URL Error: {ue.reason}")
except Exception as e:
    print(f"    ❌ GET failed: {e}")

# ── 7. requests library POST test ────────────────────────────────────────────
print("\n[7] IBM IAM token endpoint test (requests library)...")
try:
    import requests

    # Test with a short timeout first
    print("    Trying with verify=True (normal SSL)...")
    try:
        r = requests.post(
            "https://iam.cloud.ibm.com/identity/token",
            data={"grant_type": "urn:ibm:params:oauth:grant-type:apikey", "apikey": "test_invalid"},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=15,
        )
        # 400 = bad apikey but connection works!
        if r.status_code in (400, 401, 403):
            print(f"    ✅ IAM endpoint reachable — HTTP {r.status_code} (bad apikey expected)")
        else:
            print(f"    ✅ IAM endpoint reachable — HTTP {r.status_code}")
    except requests.exceptions.SSLError as e:
        print(f"    ❌ SSL Error: {e}")
        print("       → Trying with verify=False (bypass SSL cert check)...")
        try:
            import urllib3
            urllib3.disable_warnings()
            r = requests.post(
                "https://iam.cloud.ibm.com/identity/token",
                data={"grant_type": "urn:ibm:params:oauth:grant-type:apikey", "apikey": "test_invalid"},
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                timeout=15,
                verify=False,
            )
            if r.status_code in (400, 401, 403):
                print(f"    ✅ Works with verify=False — HTTP {r.status_code}")
                print("    ⚠  SSL cert verification is failing (corporate proxy/antivirus?)")
                print("    → SOLUTION: Set REQUESTS_CA_BUNDLE or use verify=False in dev")
        except Exception as e2:
            print(f"    ❌ Also failed with verify=False: {e2}")
    except requests.exceptions.ConnectionError as e:
        print(f"    ❌ Connection Error: {e}")
        if "RemoteDisconnected" in str(e) or "Connection aborted" in str(e):
            print("    → Remote end closed connection — likely causes:")
            print("      a) Corporate firewall / proxy blocking IBM Cloud")
            print("      b) Antivirus SSL inspection (Kaspersky, Avast, etc.)")
            print("      c) VPN or network restriction")
            print("      d) Firewall rule blocking outbound HTTPS to cloud.ibm.com")
    except requests.exceptions.Timeout:
        print("    ❌ Timeout — IBM IAM not reachable (firewall?)")
except ImportError:
    print("    requests library not installed")

# ── 8. Proxy detection ───────────────────────────────────────────────────────
print("\n[8] Proxy environment variables...")
for var in ["HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy", "NO_PROXY"]:
    val = os.environ.get(var, "")
    if val:
        print(f"    {var} = {val}")
    else:
        print(f"    {var} = (not set)")

# ── 9. Summary ───────────────────────────────────────────────────────────────
print("\n" + "=" * 60)
print("  Diagnostic complete.")
print("  Share the output above to identify the fix needed.")
print("=" * 60)
