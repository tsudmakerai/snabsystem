import urllib.request
import json
import sys

routes_to_test = [
    ('/', 200, 'text/html'),
    ('/css/style.css', 200, 'text/css'),
    ('/css/icons.css', 200, 'text/css'),
    ('/js/app.js', 200, 'application/javascript'),
    ('/data/catalog.json', 200, 'application/json'),
    ('/data/brands.json', 200, 'application/json'),
    ('/data/pages.json', 200, 'application/json'),
    ('/assets/images/logo.png', 200, 'image/png'),
    ('/assets/images/icons-black.png', 200, 'image/png'),
    ('/about', 200, 'text/html'),
    ('/policy', 200, 'text/html'),
    ('/public_offer', 200, 'text/html'),
    ('/contacts', 200, 'text/html'),
    ('/brands', 200, 'text/html'),
    ('/catalog/promyshlennoe-oborudovanie', 200, 'text/html'),
    ('/catalog/gidravlika', 200, 'text/html'),
    ('/brand/siemens', 200, 'text/html')
]

print("=== STARTING ROUTE VERIFICATION ===")
all_ok = True

for path, expected_status, expected_ct in routes_to_test:
    url = f"http://localhost:3000{path}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as resp:
            status = resp.status
            ct = resp.headers.get('Content-Type', '')
            if status == expected_status and expected_ct in ct:
                print(f" [PASS] {path} -> {status} ({ct})")
            else:
                print(f" [FAIL] {path} -> Expected {expected_status}/{expected_ct}, got {status}/{ct}")
                all_ok = False
    except Exception as e:
        print(f" [ERROR] {path} -> {e}")
        all_ok = False

# Test POST API
try:
    post_data = json.dumps({'name': 'Тест', 'phone': '+7 (999) 000-00-00'}).encode('utf-8')
    req = urllib.request.Request('http://localhost:3000/api/callback', data=post_data, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=5) as resp:
        res_body = json.loads(resp.read().decode('utf-8'))
        if res_body.get('success'):
            print(" [PASS] /api/callback -> POST success")
        else:
            print(" [FAIL] /api/callback -> Unexpected response:", res_body)
            all_ok = False
except Exception as e:
    print(" [ERROR] /api/callback ->", e)
    all_ok = False

if all_ok:
    print("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<")
else:
    print("\n>>> SOME TESTS FAILED <<<")
    sys.exit(1)
