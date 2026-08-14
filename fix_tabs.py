import re

with open('public/js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Fix promo_order_bg.jpg path
app_js = app_js.replace('/sites/all/themes/xtheme/misc/images/promo_order_bg.jpg', '/assets/images/promo_order_bg.jpg')
app_js = app_js.replace('/sites/all/modules/xcono/templates/how-it-works.html', '/how-it-works.html')
app_js = app_js.replace('/sites/all/themes/xtheme/misc/images/how-it-works.png', '/assets/images/how-it-works.png')


# Fix breadcrumbs
old_bc = '<nav class="breadcrumbs"><a href="/">Главная</a> <i class="icon-small-next icon-inverse"></i> <a href="/catalog/promyshlennaya-avtomatika">Промышленная автоматика</a></nav>'
new_bc = '<nav class="breadcrumbs"><a href="/">Главная</a> <i class="icon-small-next icon-inverse"></i> <a href="/brands">Производители</a></nav>'
app_js = app_js.replace(old_bc, new_bc)

# Add Tab switching JS in renderBrandPage
tab_js = """
    // Tabs logic
    const tabs = DOM.appContent.querySelectorAll('.nav-tabs a');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active from all tabs
        tabs.forEach(t => t.parentElement.classList.remove('active'));
        // Add active to clicked
        tab.parentElement.classList.add('active');
        
        // Hide all tab panes
        const panes = DOM.appContent.querySelectorAll('.tab-pane');
        panes.forEach(p => p.classList.remove('active'));
        
        // Show target pane
        const targetId = tab.getAttribute('href').substring(1);
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
"""

end_idx = app_js.find('  function renderBrandsDirectory() {')
if end_idx != -1:
    last_brace = app_js.rfind('}', 0, end_idx)
    app_js = app_js[:last_brace] + tab_js + '\n  ' + app_js[last_brace:]

with open('public/js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print('Fixed tabs, breadcrumbs, and image paths in app.js')
