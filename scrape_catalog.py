import urllib.request
import re
import requests
import time
import os

def get_sitemap_urls():
    req = urllib.request.Request('https://snabsystem.ru/sitemap.xml', headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        xml_data = resp.read().decode('utf-8')
    return re.findall(r'<loc>(.*?)</loc>', xml_data)

urls = get_sitemap_urls()
# We want to scrape all /catalog/ URLs
catalog_urls = [u for u in urls if '/catalog/' in u]

print(f"Found {len(catalog_urls)} catalog URLs to scrape.")

headers = {'User-Agent': 'Mozilla/5.0'}
success_count = 0
fail_count = 0

os.makedirs('public/data/pages/catalog', exist_ok=True)

for i, url in enumerate(catalog_urls):
    # Extract the slug path
    # e.g. https://snabsystem.ru/catalog/foo/bar -> catalog/foo/bar
    path = url.replace('https://snabsystem.ru/', '')
    if path.endswith('/'):
        path = path[:-1]
    
    file_path = os.path.join('public', 'data', 'pages', path + '.html')
    
    # Skip if already exists (resume capability)
    if os.path.exists(file_path):
        continue
    
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    try:
        resp = requests.get(url, headers=headers)
        if resp.status_code != 200:
            print(f"Skipping {url} (status {resp.status_code})")
            continue
            
        html = resp.text
        
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
            
            with open(file_path, 'w', encoding='utf-8') as out:
                out.write(content.strip())
            
            success_count += 1
            print(f"[{i+1}/{len(catalog_urls)}] Saved {path}")
        else:
            fail_count += 1
            print(f"FAILED to find bounds for {url}")
            
    except Exception as e:
        fail_count += 1
        print(f"Error fetching {url}: {e}")
        
    time.sleep(0.05) # Be nice, but fast

print(f"Done! Successfully scraped {success_count} pages. Failed: {fail_count}")
