import re

with open('public/data/brand_amc_template.html', 'r', encoding='utf-8') as f:
    template = f.read()

# Replace specific AMC strings with JS variables
template = template.replace('Amc   Analytik Amp Messtechnik', '${brand.title}')
template = template.replace('amc-thmb.jpg', '${brand.image || "snabsystem-logo.png"}')
template = template.replace('?itok=EUUGddsZ', '')

# Description - replace the long table with our dynamic description
start_desc = template.find('<article class="field field-name-body')
end_desc = template.find('</article>') + len('</article>')
article_html = '<article class="field field-name-body field-type-text-with-summary field-label-hidden">\n    <p>${brand.description}</p>\n  </article>'
template = template[:start_desc] + article_html + template[end_desc:]

# Form action
template = re.sub(r'action="/catalog/promyshlennaya-avtomatika/amc-analytik-amp-messtechnik"', 'action="/brand/${brandSlug}"', template)

# Replace breadcrumb active path
template = re.sub(r'href="/catalog/promyshlennaya-avtomatika/amc-analytik-amp-messtechnik" class="active"', 'href="/brand/${brandSlug}" class="active"', template)

new_func = """  function renderBrandPage(brandSlug) {
    const brand = App.brands.find(b => b.slug === brandSlug) || {
      title: brandSlug.toUpperCase(),
      description: `Поставка оригинальной продукции ${brandSlug.toUpperCase()} с официальной гарантией.`,
      image: 'snabsystem-logo.png'
    };

    document.title = `${brand.title} — Система Снабжения`;

    DOM.appContent.innerHTML = `
""" + template.replace('`', '\\`') + """    `;
    
    // Bind the form submission
    const form = DOM.appContent.querySelector('#xcono-get-quote-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Ваша заявка успешно отправлена! Наш менеджер свяжется с вами в ближайшее время.');
        form.reset();
      });
    }
    
    // Setup colorbox (just prevent default for the demo)
    const howItWorks = DOM.appContent.querySelector('.colorbox-load');
    if (howItWorks) {
      howItWorks.addEventListener('click', (e) => {
        e.preventDefault();
      });
    }
  }
"""

with open('C:/Users/tut/.gemini/antigravity/brain/061e5578-f1c2-4440-87a0-2ea283bc5b56/scratch/new_renderBrandPage.js', 'w', encoding='utf-8') as f:
    f.write(new_func)
print("Created new_renderBrandPage.js")
