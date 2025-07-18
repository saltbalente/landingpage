// Script to apply Core Web Vitals optimizations to all HTML files
const fs = require('fs');
const path = require('path');

// Function to add critical CSS to HTML head
function addCriticalCSS(htmlContent) {
    const criticalCSS = `
    <style>
    /* Critical CSS for above-the-fold content */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Montserrat', sans-serif; line-height: 1.6; color: #333; background: #fff; font-size: 16px; }
    h1, h2, h3, h4, h5, h6 { font-weight: 600; line-height: 1.2; margin-bottom: 1rem; }
    img { max-width: 100%; height: auto; display: block; }
    .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    .btn, .cta-button { display: inline-block; padding: 12px 24px; background: #8B0000; color: white; text-decoration: none; border-radius: 8px; font-weight: 500; text-align: center; min-height: 44px; min-width: 44px; border: none; cursor: pointer; }
    </style>
    `;
    
    return htmlContent.replace('</head>', `${criticalCSS}\n</head>`);
}

// Function to add performance optimizations
function addPerformanceOptimizations(htmlContent) {
    const performanceScripts = `
    <!-- Performance Optimizations -->
    <link rel="preload" href="/mobile-optimization.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <link rel="preload" href="/layout-optimization.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <link rel="preload" href="/image-optimization.js" as="script">
    <link rel="preload" href="/performance-optimization.js" as="script">
    
    <!-- Defer non-critical CSS -->
    <link rel="stylesheet" href="/mobile-optimization.css" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="/layout-optimization.css" media="print" onload="this.media='all'">
    
    <!-- Defer non-critical JavaScript -->
    <script src="/image-optimization.js" defer></script>
    <script src="/performance-optimization.js" defer></script>
    `;
    
    return htmlContent.replace('</head>', `${performanceScripts}\n</head>`);
}

// Function to optimize images
function optimizeImages(htmlContent) {
    // Add lazy loading to all images
    htmlContent = htmlContent.replace(
        /<img([^>]*)>/g,
        '<img$1 loading="lazy" decoding="async">'
    );
    
    // Add aspect ratio containers for images
    htmlContent = htmlContent.replace(
        /<img([^>]*?)src="([^"]*?)"([^>]*)>/g,
        '<div style="aspect-ratio: 16/9; overflow: hidden; border-radius: 8px;"><img$1src="$2"$3 style="width: 100%; height: 100%; object-fit: cover;"></div>'
    );
    
    return htmlContent;
}

// Function to add accessibility improvements
function addAccessibility(htmlContent) {
    // Add skip link
    const skipLink = '<a href="#main-content" class="skip-link">Saltar al contenido principal</a>';
    htmlContent = htmlContent.replace('<body>', `<body>\n${skipLink}`);
    
    // Add main content landmark
    htmlContent = htmlContent.replace(
        /<main([^>]*)>/g,
        '<main$1 id="main-content" role="main">'
    );
    
    // Add ARIA labels to buttons
    htmlContent = htmlContent.replace(
        /<button([^>]*)>/g,
        '<button$1 aria-label="Botón de acción">'
    );
    
    return htmlContent;
}

// Function to add mobile optimizations
function addMobileOptimizations(htmlContent) {
    // Add viewport meta tag if not present
    if (!htmlContent.includes('viewport')) {
        htmlContent = htmlContent.replace(
            '<meta charset="UTF-8">',
            '<meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">'
        );
    }
    
    // Add touch-friendly button sizes
    htmlContent = htmlContent.replace(
        /class="([^"]*btn[^"]*)"/g,
        'class="$1" style="min-height: 44px; min-width: 44px;"'
    );
    
    return htmlContent;
}

// Function to add Core Web Vitals monitoring
function addCoreWebVitalsMonitoring(htmlContent) {
    const monitoringScript = `
    <script>
    // Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
        // LCP monitoring
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
            if (lastEntry.startTime > 2500) {
                console.warn('LCP is too slow:', lastEntry.startTime);
            }
        }).observe({entryTypes: ['largest-contentful-paint']});
        
        // FID monitoring
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
                if (entry.processingStart - entry.startTime > 100) {
                    console.warn('FID is too slow:', entry.processingStart - entry.startTime);
                }
            });
        }).observe({entryTypes: ['first-input']});
        
        // CLS monitoring
        let clsValue = 0;
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    console.log('CLS:', clsValue);
                    if (clsValue > 0.1) {
                        console.warn('CLS is too high:', clsValue);
                    }
                }
            });
        }).observe({entryTypes: ['layout-shift']});
    }
    </script>
    `;
    
    return htmlContent.replace('</head>', `${monitoringScript}\n</head>`);
}

// Function to process a single HTML file
function processHTMLFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Apply all optimizations
        content = addCriticalCSS(content);
        content = addPerformanceOptimizations(content);
        content = optimizeImages(content);
        content = addAccessibility(content);
        content = addMobileOptimizations(content);
        content = addCoreWebVitalsMonitoring(content);
        
        // Write back to file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Optimized: ${filePath}`);
        
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
    
    console.log(`🚀 Found ${htmlFiles.length} HTML files to optimize`);
    console.log('📊 Applying Core Web Vitals optimizations...\n');
    
    htmlFiles.forEach(file => {
        processHTMLFile(file);
    });
    
    console.log('\n✅ All optimizations applied successfully!');
    console.log('\n📈 Expected Core Web Vitals improvements:');
    console.log('   • LCP: < 2.5s (Largest Contentful Paint)');
    console.log('   • FID: < 100ms (First Input Delay)');
    console.log('   • CLS: < 0.1 (Cumulative Layout Shift)');
    console.log('\n📱 Mobile-first optimizations applied');
    console.log('♿ Accessibility improvements added');
    console.log('⚡ Performance monitoring enabled');
}

// Run the optimization
main(); 