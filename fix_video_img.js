const fs = require('fs');
let appJs = fs.readFileSync('public/js/app.js', 'utf8');

// Replace the video image path
const oldPath = '/sites/all/themes/xtheme/misc/images/how-it-works.png';
const newPath = '/assets/images/how-it-works.png';

if (appJs.includes(oldPath)) {
    appJs = appJs.split(oldPath).join(newPath); // replace all
    fs.writeFileSync('public/js/app.js', appJs);
    console.log('Replaced how-it-works.png path in app.js');
} else {
    console.log('Path not found in app.js, might already be replaced?');
}
