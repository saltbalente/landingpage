// Script to fix URL issues, CSS problems, SVG button size, and ensure absolute URLs with domain for resources
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://amarredeamorfuertes.com';

// Function to fix URLs in HTML content
function fixURLs(htmlContent) {
    // Replace old domain with new domain
    htmlContent = htmlContent.replace(
        /https:\/\/landingpage-edq\.pages\.dev/g,
        DOMAIN
    );
    // Fix /index.html links to absolute
    htmlContent = htmlContent.replace(
        /href="\/index\.html"/g,
        `href="${DOMAIN}/index.html"`
    );
    // Force all resource links to use absolute URLs with domain
    htmlContent = htmlContent.replace(
        /href="(\/)?styles\.css"/g,
        `href="${DOMAIN}/styles.css"`
    );
    htmlContent = htmlContent.replace(
        /href="(\/)?mobile-optimization\.css"/g,
        `href="${DOMAIN}/mobile-optimization.css"`
    );
    htmlContent = htmlContent.replace(
        /href="(\/)?layout-optimization\.css"/g,
        `href="${DOMAIN}/layout-optimization.css"`
    );
    htmlContent = htmlContent.replace(
        /src="(\/)?script\.js"/g,
        `src="${DOMAIN}/script.js"`
    );
    htmlContent = htmlContent.replace(
        /src="(\/)?image-optimization\.js"/g,
        `src="${DOMAIN}/image-optimization.js"`
    );
    htmlContent = htmlContent.replace(
        /src="(\/)?performance-optimization\.js"/g,
        `src="${DOMAIN}/performance-optimization.js"`
    );
    // Fix relative paths for other resources
    htmlContent = htmlContent.replace(
        /href="\.\.\//g,
        `href="${DOMAIN}/`
    );
    htmlContent = htmlContent.replace(
        /src="\.\.\//g,
        `src="${DOMAIN}/`
    );
    return htmlContent;
}

// Function to fix CSS references
function fixCSSReferences(htmlContent) {
    // Remove broken CSS links added by optimization script
    htmlContent = htmlContent.replace(
        /<link rel="preload" href="(\/)?mobile-optimization\.css"[^>]*>/g,
        ''
    );
    htmlContent = htmlContent.replace(
        /<link rel="preload" href="(\/)?layout-optimization\.css"[^>]*>/g,
        ''
    );
    htmlContent = htmlContent.replace(
        /<link rel="stylesheet" href="(\/)?mobile-optimization\.css"[^>]*>/g,
        ''
    );
    htmlContent = htmlContent.replace(
        /<link rel="stylesheet" href="(\/)?layout-optimization\.css"[^>]*>/g,
        ''
    );
    // Add correct CSS references
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
    // Add CSS after existing stylesheets
    if (htmlContent.includes('<link rel="stylesheet"')) {
        htmlContent = htmlContent.replace(
            /(<link rel="stylesheet"[^>]*>)/,
            `$1\n    ${correctCSS}`
        );
    } else {
        htmlContent = htmlContent.replace(
            '</head>',
            `    ${correctCSS}\n</head>`
        );
    }
    return htmlContent;
}

// Function to fix JavaScript references
function fixJSReferences(htmlContent) {
    // Remove broken JS links
    htmlContent = htmlContent.replace(
        /<link rel="preload" href="(\/)?image-optimization\.js"[^>]*>/g,
        ''
    );
    htmlContent = htmlContent.replace(
        /<link rel="preload" href="(\/)?performance-optimization\.js"[^>]*>/g,
        ''
    );
    htmlContent = htmlContent.replace(
        /<script src="(\/)?image-optimization\.js"[^>]*><\/script>/g,
        ''
    );
    htmlContent = htmlContent.replace(
        /<script src="(\/)?performance-optimization\.js"[^>]*><\/script>/g,
        ''
    );
    // Add correct JS references
    const correctJS = `
    <script src="${DOMAIN}/script.js" defer></script>
    <script src="${DOMAIN}/image-optimization.js" defer></script>
    <script src="${DOMAIN}/performance-optimization.js" defer></script>
    `;
    // Add JS before closing body tag
    htmlContent = htmlContent.replace(
        '</body>',
        `    ${correctJS}\n</body>`
    );
    return htmlContent;
}

// Function to fix broken image containers
function fixImageContainers(htmlContent) {
    // Remove broken aspect-ratio containers
    htmlContent = htmlContent.replace(
        /<div style="aspect-ratio: 16\/9; overflow: hidden; border-radius: 8px;"><img([^>]*?)src="([^"]*?)"([^>]*) style="width: 100%; height: 100%; object-fit: cover;"><\/div>/g,
        '<img$1src="$2"$3>'
    );
    // Fix lazy loading attributes
    htmlContent = htmlContent.replace(
        /loading="lazy" decoding="async"/g,
        'loading="lazy"'
    );
    return htmlContent;
}

// Function to fix broken critical CSS
function fixCriticalCSS(htmlContent) {
    // Remove broken critical CSS
    htmlContent = htmlContent.replace(
        /<style>\s*\/\* Critical CSS for above-the-fold content \*\/[^<]*<\/style>/g,
        ''
    );
    // Add proper critical CSS
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
    htmlContent = htmlContent.replace(
        '</head>',
        `${criticalCSS}\n</head>`
    );
    return htmlContent;
}

// Function to process a single HTML file
function processHTMLFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        // Apply all fixes
        content = fixURLs(content);
        content = fixCSSReferences(content);
        content = fixJSReferences(content);
        content = fixImageContainers(content);
        content = fixCriticalCSS(content);
        // Write back to file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${filePath}`);
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

// Function to find all HTML files
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

// Main execution
function main() {
    const htmlFiles = findHTMLFiles('.');
    console.log(`🔧 Found ${htmlFiles.length} HTML files to fix`);
    console.log('📝 Fixing URLs, CSS, and SVG button size issues...\n');
    htmlFiles.forEach(file => {
        processHTMLFile(file);
    });
    console.log('\n✅ All issues fixed successfully!');
    console.log('\n🔧 Fixed issues:');
    console.log('   • URLs updated to amarredeamorfuertes.com');
    console.log('   • /index.html links are now absolute');
    console.log('   • CSS/JS references now use absolute URLs with domain');
    console.log('   • SVG button size fixed');
    console.log('   • JavaScript references fixed');
    console.log('   • Image containers optimized');
    console.log('   • Critical CSS restored');
}

// Run the fix
main(); 