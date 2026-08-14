import re

with open(r'C:\Users\tut\.gemini\antigravity\brain\061e5578-f1c2-4440-87a0-2ea283bc5b56\scratch\scraped_html\home.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract from <div class="full-width"> to the end of <div class="container" > before <footer
start_idx = html.find('<div class="full-width">')
end_idx = html.find('</div>\n    \n    \n\n<footer')
if end_idx == -1:
    end_idx = html.find('<footer')

content = html[start_idx:end_idx].strip()

# Replace asset paths
content = content.replace('https://snabsystem.ru/sites/all/themes/xtheme/misc/images/', '/assets/images/')
content = content.replace('/sites/all/themes/xtheme/misc/images/', '/assets/images/')
content = content.replace('https://snabsystem.ru/sites/default/files/images/slides/', '/assets/images/')
content = content.replace('/sites/default/files/images/slides/', '/assets/images/')
content = content.replace('https://snabsystem.ru/sites/default/files/styles/thumbnail/public/images/product/logo/', '/assets/images/')

with open(r'C:\Users\tut\.gemini\antigravity\scratch\snabsystem_clone\extracted_home.txt', 'w', encoding='utf-8') as f:
    f.write(content)
