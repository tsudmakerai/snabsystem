import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    index = f.read()

with open('C:/Users/tut/.gemini/antigravity/brain/061e5578-f1c2-4440-87a0-2ea283bc5b56/scratch/header_exact.html', 'r', encoding='utf-8') as f:
    header = f.read()
with open('C:/Users/tut/.gemini/antigravity/brain/061e5578-f1c2-4440-87a0-2ea283bc5b56/scratch/footer_exact.html', 'r', encoding='utf-8') as f:
    footer = f.read()

header = header.replace('logo.png', 'snabsystem-logo.png')
footer = footer.replace('logo-white.png', 'snabsystem-logo-white.png')

index = re.sub(r'<header class="r-header">.*?</header>', header.replace('\\', '\\\\'), index, flags=re.DOTALL)
index = re.sub(r'<footer class="wide-footer">.*?</footer>', footer.replace('\\', '\\\\'), index, flags=re.DOTALL)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(index)

print('Updated index.html with exact HTML fragments.')
