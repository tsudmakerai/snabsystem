import json
import urllib.request
import re
import requests
import time

def get_sitemap_urls():
    req = urllib.request.Request('https://snabsystem.ru/sitemap.xml', headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        xml_data = resp.read().decode('utf-8')
    return re.findall(r'<loc>(.*?)</loc>', xml_data)

print("Fetching sitemap...")
urls = get_sitemap_urls()

with open('public/data/full_pages.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

print(f"Loaded {len(urls)} URLs from sitemap and {len(pages)} keys from full_pages.json")

def find_url(key):
    if key == 'home': return 'https://snabsystem.ru/'
    if key.startswith('brand-'): return f"https://snabsystem.ru/brand/{key.replace('brand-', '')}"
    if key in ['about', 'public_offer', 'policy']: return f"https://snabsystem.ru/{key}"
    
    matches = [u for u in urls if u.endswith(f"/{key}") or u.endswith(f"/{key}/")]
    if matches:
        return matches[0]
    return None

headers = {'User-Agent': 'Mozilla/5.0'}
success_count = 0

for key in pages:
    url = find_url(key)
    if not url:
        print(f"Skipping key (no url): {key}")
        continue
    
    try:
        html = requests.get(url, headers=headers).text
        # We need everything between the start of .r-system/.r-content block and <!-- Footer -->
        # Let's find the first <div class="container"> that contains <div class="r-system"> or <div class="r-content">
        # In the original, the first <div class="container"> after header is the breadcrumbs one.
        # So we can search for the first <div class="container"> that comes after </header>
        
        header_end = html.find('</header>')
        if header_end == -1:
            header_end = html.find('</div><!-- .pp-header -->')
        
        start_idx = html.find('<div class="container"', header_end)
        footer_idx = html.find('<!-- Footer -->')
        if footer_idx == -1:
            footer_idx = html.find('<footer class="wide-footer">')
            
        if start_idx != -1 and footer_idx != -1 and start_idx < footer_idx:
            content = html[start_idx:footer_idx]
            
            # Fix image paths
            content = content.replace('/sites/all/themes/xtheme/misc/images/', '/assets/images/')
            
            # Save to JSON
            pages[key]['contentHtml'] = content.strip()
            # Also keep old 'content' key in sync or remove it if needed. app.js uses 'content || html'
            # Wait, our app.js uses pageData.content || pageData.html || ''. Let's use 'html'
            pages[key]['html'] = content.strip()
            if 'content' in pages[key]:
                del pages[key]['content']
            
            success_count += 1
            print(f"[{success_count}/{len(pages)}] Extracted {key} from {url}")
        else:
            print(f"FAILED to find bounds for {key} at {url}")
            
    except Exception as e:
        print(f"Error fetching {key} at {url}: {e}")
        
    time.sleep(0.1) # Be nice to the server

with open('public/data/full_pages_new.json', 'w', encoding='utf-8') as f:
    json.dump(pages, f, ensure_ascii=False, indent=2)

print(f"Done! Successfully extracted {success_count} pages.")
