const fs = require('fs');
let appJs = fs.readFileSync('public/js/app.js', 'utf8');
let origContent = fs.readFileSync('orig_content.html', 'utf8');

// The original content string is just standard HTML, we can replace some URLs:
let safeContent = origContent.replace('https://snabsystem.ru/sites/default/files/styles/thumbnail/public/images/product/logo/akcesoria-thmb.jpg?itok=G1Wd8Y2t', '/assets/images/akcesoria-thmb.jpg');
safeContent = safeContent.replace('https://snabsystem.ru/sites/default/files/styles/medium/public/images/review/cantoni-logo.jpg?itok=W4pKyQbh', '/assets/images/cantoni-logo.jpg');
safeContent = safeContent.replace('https://snabsystem.ru/sites/default/files/styles/medium/public/images/review/edpt-brusatori.jpg?itok=1_zGRX0D', '/assets/images/edpt-brusatori.jpg');
safeContent = safeContent.replace('https://snabsystem.ru/sites/default/files/styles/medium/public/images/review/mr1.jpg?itok=cNtxAR67', '/assets/images/mr1.jpg');
safeContent = safeContent.replace('https://snabsystem.ru/sites/default/files/styles/medium/public/images/review/motor-1.jpg?itok=b4mesESv', '/assets/images/motor-1.jpg');

// Find the boundaries
// We want to replace from:
//       <div class="r-content">
//                  <div class="col-12 col-lg-3 col-lg-push-9">
// all the way to:
//       </div>
//     
//     </div>
//     
//     
//   <div class="container">
//     <div class="r-content-bottom">

const rContentStart = appJs.indexOf('      <div class=\"r-content\">');
const rContentBottomStart = appJs.indexOf('  <div class=\"container\">\\n    <div class=\"r-content-bottom\">');

if (rContentStart !== -1 && rContentBottomStart !== -1) {
    // Wait, rContentBottomStart won't match if it has spaces
    // Let's use regex
    const newAppJs = appJs.replace(
        /<div class="r-content">[\s\S]*?<div class="r-content-bottom">/,
        `<div class="r-content">\n${safeContent}\n      </div>\n    \n    </div>\n    \n    \n  <div class="container">\n    <div class="r-content-bottom">`
    );
    
    fs.writeFileSync('public/js/app.js', newAppJs);
    console.log('Replaced via regex!');
} else {
    // If not found, just use regex directly
    const newAppJs = appJs.replace(
        /<div class="r-content">[\s\S]*?<div class="r-content-bottom">/,
        `<div class="r-content">\n${safeContent}\n      </div>\n    \n    </div>\n    \n    \n  <div class="container">\n    <div class="r-content-bottom">`
    );
    fs.writeFileSync('public/js/app.js', newAppJs);
    console.log('Replaced via regex directly!');
}
