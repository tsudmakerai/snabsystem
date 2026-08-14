import urllib.request
import re

url = 'https://snabsystem.ru/catalog/promyshlennaya-avtomatika/amc-analytik-amp-messtechnik'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')

    header_end = html.find('</header>')
    start = html.find('<div class="container">', header_end)
    end = html.find('<footer')
    
    # Extract
    content = html[start:end].strip()
    
    # Let's remove the closing divs before footer that belong to page shell
    # Actually wait, the structure is:
    # </div> (end of page)
    # <footer>
    # So end is fine, but we might want to strip the last closing tags.

    with open('public/data/brand_amc_template.html', 'w', encoding='utf-8') as f:
        f.write(content)

    print('Saved public/data/brand_amc_template.html')
except Exception as e:
    print(f"Error: {e}")
