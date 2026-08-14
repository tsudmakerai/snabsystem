import urllib.request
import re
import json

url = 'https://snabsystem.ru/catalog/elektrodvigateli/akcesoria'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
    match = re.search(r'<div class="field field-name-field-image.*?<img src="([^"]+)"', html, re.DOTALL)
    if match:
        img_url = match.group(1).replace('&amp;', '&')
        print('Found image URL:', img_url)
        img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(img_req) as res:
            with open('public/assets/images/akcesoria.png', 'wb') as f:
                f.write(res.read())
        print('Downloaded to public/assets/images/akcesoria.png')
        
        # Update brands.json
        with open('public/data/brands.json', 'r', encoding='utf-8') as f:
            brands = json.load(f)
        for b in brands:
            if b['slug'] == 'akcesoria':
                b['image'] = 'akcesoria.png'
        with open('public/data/brands.json', 'w', encoding='utf-8') as f:
            json.dump(brands, f, ensure_ascii=False)
        print('Updated brands.json')
    else:
        print('Image not found in HTML')
except Exception as e:
    print(e)
