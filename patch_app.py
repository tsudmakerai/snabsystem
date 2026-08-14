import re

with open('extracted_home.txt', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Escape backticks and $ for template literal
html_content = html_content.replace('`', '\\`').replace('$', '\\$')

# Prepare the replacement JS block
js_block = f"""  function renderHome() {{
    document.title = 'Продажа промышленного оборудования - Система Снабжения';

    DOM.appContent.innerHTML = `
{html_content}
    `;

    setupCarousel();
  }}"""

with open(r'public\js\app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Replace the renderHome function
app_js = re.sub(r'  function renderHome\(\) \{[\s\S]*?setupCarousel\(\);\n  \}', js_block, app_js)

with open(r'public\js\app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
