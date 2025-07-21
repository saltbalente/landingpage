// Script to fix light backgrounds that interfere with white text
const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'blog');
const lightBackgrounds = [
  'background: linear-gradient(135deg, #E8EAF6 0%, #F3E5F5 50%, #FCE4EC 100%)',
  'background: var(--bg-light)',
  'rgba(255, 255, 255, 0.9)',
  'rgba(255, 255, 255, 0.8)',
  'rgba(255, 255, 255, 0.7)'
];

const replacementBackgrounds = {
  'linear-gradient(135deg, #E8EAF6 0%, #F3E5F5 50%, #FCE4EC 100%)': 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)',
  'var(--bg-light)': 'var(--primary-dark)',
  'rgba(255, 255, 255, 0.9)': 'rgba(26, 26, 26, 0.9)',
  'rgba(255, 255, 255, 0.8)': 'rgba(26, 26, 26, 0.8)',
  'rgba(255, 255, 255, 0.7)': 'rgba(26, 26, 26, 0.7)'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  lightBackgrounds.forEach(bg => {
    if (content.includes(bg)) {
      content = content.replace(new RegExp(bg, 'g'), replacementBackgrounds[bg] || bg);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated backgrounds in ${path.basename(filePath)}`);
  }
}

// Process all HTML files in blog directory
fs.readdirSync(blogDir).forEach(file => {
  if (file.endsWith('.html')) {
    processFile(path.join(blogDir, file));
  }
});

console.log('Finished updating light backgrounds in blog articles');