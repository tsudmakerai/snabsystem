import json
import urllib.request
import re
import requests

def get_sitemap_urls():
    req = urllib.request.Request('https://snabsystem.ru/sitemap.xml', headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        xml_data = resp.read().decode('utf-8')
    return re.findall(r'<loc>(.*?)</loc>', xml_data)

urls = get_sitemap_urls()

with open('public/data/full_pages.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

print(f"Loaded {len(urls)} URLs from sitemap and {len(pages)} keys from full_pages.json")

def find_url(key):
    if key == 'home': return 'https://snabsystem.ru/'
    if key.startswith('brand-'): return f"https://snabsystem.ru/brand/{key.replace('brand-', '')}"
    if key in ['about', 'public_offer', 'policy']: return f"https://snabsystem.ru/{key}"
    
    # search in sitemap
    matches = [u for u in urls if u.endswith(f"/{key}") or u.endswith(f"/{key}/")]
    if matches:
        return matches[0]
    return None

success_count = 0
for key in pages:
    url = find_url(key)
    if not url:
        print(f"Could not find URL for key: {key}")
    else:
        success_count += 1
        
print(f"Found URLs for {success_count}/{len(pages)} keys")
