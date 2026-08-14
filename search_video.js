const fs = require('fs');
const content = fs.readFileSync('orig_content.html', 'utf8');

// Find 'запросить' or 'видео'
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.toLowerCase().includes('запросить') || line.toLowerCase().includes('видео') || line.toLowerCase().includes('video') || line.toLowerCase().includes('youtube')) {
        console.log('Line ' + (i+1) + ': ' + line.trim());
    }
});
