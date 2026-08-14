const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const footerStartIdx = html.indexOf('  <!-- Footer -->');
const modalsIdx = html.indexOf('  <!-- Modals Placeholder -->');

if (footerStartIdx !== -1 && modalsIdx !== -1) {
    let before = html.substring(0, footerStartIdx);
    let after = html.substring(modalsIdx);
    
    let origFooter = fs.readFileSync('orig_footer.html', 'utf8');
    origFooter = origFooter.replace('http://snabsystem.ru/sites/all/themes/xtheme/misc/images/logo-white.png', '/assets/images/snabsystem-logo-white.png');
    origFooter = origFooter.replace('http://snabsystem.ru/sites/all/themes/xtheme/misc/images/how-it-works.png', '/assets/images/how-it-works.png');

    let newHtml = before + '  <!-- Footer -->\n  <footer class="wide-footer">\n' + origFooter + '\n  </footer>\n\n' + after;
    fs.writeFileSync('public/index.html', newHtml);
    console.log('Fixed index.html footer');
}
