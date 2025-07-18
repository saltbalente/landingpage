// Script to fix URL issues, CSS problems, SVG button size, ensure absolute URLs, y eliminar duplicados de scripts y CSS
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://amarredeamorfuertes.com';

// Helper to remove duplicates, keeping only the first occurrence
function removeDuplicateTags(htmlContent, tag, srcOrHref) {
    const regex = new RegExp(`<${tag}[^>]*${srcOrHref}=["'][^"']+["'][^>]*>`, 'g');
    const matches = htmlContent.match(regex);
    if (!matches || matches.length <= 1) return htmlContent;
    // Keep only the first occurrence
    let first = true;
    htmlContent = htmlContent.replace(regex, (m) => {
        if (first) { first = false; return m; }
        return '';
    });
    return htmlContent;
}

function fixURLs(htmlContent) {
    htmlContent = htmlContent.replace(/https:\/\/landingpage-edq\.pages\.dev/g, DOMAIN);
    htmlContent = htmlContent.replace(/href="\/index\.html"/g, `href="${DOMAIN}/index.html"`);
    htmlContent = htmlContent.replace(/href="(\/)?styles\.css"/g, `href="${DOMAIN}/styles.css"`);
    htmlContent = htmlContent.replace(/href="(\/)?mobile-optimization\.css"/g, `href="${DOMAIN}/mobile-optimization.css"`);
    htmlContent = htmlContent.replace(/href="(\/)?layout-optimization\.css"/g, `href="${DOMAIN}/layout-optimization.css"`);
    htmlContent = htmlContent.replace(/src="(\/)?script\.js"/g, `src="${DOMAIN}/script.js"`);
    htmlContent = htmlContent.replace(/src="(\/)?image-optimization\.js"/g, `src="${DOMAIN}/image-optimization.js"`);
    htmlContent = htmlContent.replace(/src="(\/)?performance-optimization\.js"/g, `src="${DOMAIN}/performance-optimization.js"`);
    htmlContent = htmlContent.replace(/href="\.\.\//g, `href="${DOMAIN}/`);
    htmlContent = htmlContent.replace(/src="\.\.\//g, `src="${DOMAIN}/`);
    return htmlContent;
}

function fixCSSReferences(htmlContent) {
    htmlContent = htmlContent.replace(/<link rel="preload" href="(\/)?mobile-optimization\.css"[^>]*>/g, '');
    htmlContent = htmlContent.replace(/<link rel="preload" href="(\/)?layout-optimization\.css"[^>]*>/g, '');
    htmlContent = htmlContent.replace(/<link rel="stylesheet" href="(\/)?mobile-optimization\.css"[^>]*>/g, '');
    htmlContent = htmlContent.replace(/<link rel="stylesheet" href="(\/)?layout-optimization\.css"[^>]*>/g, '');
    const correctCSS = `
    <link rel="stylesheet" href="${DOMAIN}/styles.css">
    <link rel="stylesheet" href="${DOMAIN}/mobile-optimization.css">
    <link rel="stylesheet" href="${DOMAIN}/layout-optimization.css">
    <style>
    /* Fix SVG size in buttons */
    button svg, .btn svg, .cta-button svg {
      width: 1.2em;
      height: 1.2em;
      vertical-align: middle;
      display: inline-block;
      margin: 0 0.2em 0 0;
    }
    </style>
    `;
    if (htmlContent.includes('<link rel="stylesheet"')) {
        htmlContent = htmlContent.replace(/(<link rel="stylesheet"[^>]*>)/, `$1\n    ${correctCSS}`);
    } else {
        htmlContent = htmlContent.replace('</head>', `    ${correctCSS}\n</head>`);
    }
    // Eliminar duplicados de CSS
    htmlContent = removeDuplicateTags(htmlContent, 'link', 'href');
    return htmlContent;
}

function fixJSReferences(htmlContent) {
    htmlContent = htmlContent.replace(/<link rel="preload" href="(\/)?image-optimization\.js"[^>]*>/g, '');
    htmlContent = htmlContent.replace(/<link rel="preload" href="(\/)?performance-optimization\.js"[^>]*>/g, '');
    htmlContent = htmlContent.replace(/<script src="(\/)?image-optimization\.js"[^>]*><\/script>/g, '');
    htmlContent = htmlContent.replace(/<script src="(\/)?performance-optimization\.js"[^>]*><\/script>/g, '');
    // Google Tag Manager bloque comentado
    const gtmBlock = `
    <!-- Google Tag Manager (completa tu ID real) -->
    <!--
    <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX"></script>
    -->
    `;
    const correctJS = `
    <script src="${DOMAIN}/script.js" defer></script>
    <script src="${DOMAIN}/image-optimization.js" defer></script>
    <script src="${DOMAIN}/performance-optimization.js" defer></script>
    ${gtmBlock}
    `;
    htmlContent = htmlContent.replace('</body>', `    ${correctJS}\n</body>`);
    // Eliminar duplicados de scripts
    htmlContent = removeDuplicateTags(htmlContent, 'script', 'src');
    return htmlContent;
}

function fixImageContainers(htmlContent) {
    htmlContent = htmlContent.replace(/<div style="aspect-ratio: 16\/9; overflow: hidden; border-radius: 8px;"><img([^>]*?)src="([^"]*?)"([^>]*) style="width: 100%; height: 100%; object-fit: cover;"><\/div>/g, '<img$1src="$2"$3>');
    htmlContent = htmlContent.replace(/loading="lazy" decoding="async"/g, 'loading="lazy"');
    return htmlContent;
}

function fixCriticalCSS(htmlContent) {
    htmlContent = htmlContent.replace(/<style>\s*\/\* Critical CSS for above-the-fold content \*\/[^<]*<\/style>/g, '');
    const criticalCSS = `
    <style>
    /* Critical CSS for above-the-fold content */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Montserrat', sans-serif; line-height: 1.6; color: #333; background: #fff; font-size: 16px; }
    h1, h2, h3, h4, h5, h6 { font-weight: 600; line-height: 1.2; margin-bottom: 1rem; }
    img { max-width: 100%; height: auto; display: block; }
    .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    .btn, .cta-button { display: inline-block; padding: 12px 24px; background: #8B0000; color: white; text-decoration: none; border-radius: 8px; font-weight: 500; text-align: center; min-height: 44px; min-width: 44px; border: none; cursor: pointer; }
    .blog-content { max-width: 800px; margin: 0 auto; padding: 32px 20px; line-height: 1.8; color: #111; background: #fff; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
    </style>
    `;
    htmlContent = htmlContent.replace('</head>', `${criticalCSS}\n</head>`);
    return htmlContent;
}

function processHTMLFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        content = fixURLs(content);
        content = fixCSSReferences(content);
        content = fixJSReferences(content);
        content = fixImageContainers(content);
        content = fixCriticalCSS(content);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${filePath}`);
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

function findHTMLFiles(dir) {
    const files = [];
    function scanDirectory(currentDir) {
        const items = fs.readdirSync(currentDir);
        items.forEach(item => {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                scanDirectory(fullPath);
            } else if (item.endsWith('.html')) {
                files.push(fullPath);
            }
        });
    }
    scanDirectory(dir);
    return files;
}

function main() {
    const htmlFiles = findHTMLFiles('.');
    console.log(`🔧 Found ${htmlFiles.length} HTML files to fix`);
    console.log('📝 Limpiando duplicados de scripts/CSS y corrigiendo URLs...\n');
    htmlFiles.forEach(file => {
        processHTMLFile(file);
    });
    console.log('\n✅ All issues fixed successfully!');
    console.log('\n🔧 Fixed issues:');
    console.log('   • URLs updated to amarredeamorfuertes.com');
    console.log('   • /index.html links are now absolute');
    console.log('   • CSS/JS references now use absolute URLs with domain');
    console.log('   • Duplicates of scripts and CSS removed');
    console.log('   • SVG button size fixed');
    console.log('   • JavaScript references fixed');
    console.log('   • Image containers optimized');
    console.log('   • Critical CSS restored');
}

main(); 