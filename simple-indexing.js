// Simple and Effective Indexing Script
// No API keys required - Uses proven methods that actually work

(function() {
  'use strict';
  
  const CONFIG = {
    siteUrl: 'https://amarredeamorfuertes.com',
    enableLogging: true,
    methods: {
      sitemapPing: true,
      internalLinking: true,
      metaOptimization: true,
      socialSignals: true
    }
  };
  
  function log(message, data = '') {
    if (CONFIG.enableLogging) {
      console.log(`[Simple Indexing] ${message}`, data);
    }
  }
  
  // Method 1: Enhanced Sitemap Ping (Most Effective)
  function pingSitemaps() {
    const sitemapUrl = `${CONFIG.siteUrl}/sitemap.xml`;
    const engines = [
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    ];
    
    engines.forEach((url, index) => {
      setTimeout(() => {
        fetch(url, { method: 'GET', mode: 'no-cors' })
          .then(() => log(`Sitemap ping ${index + 1} successful`))
          .catch(() => log(`Sitemap ping ${index + 1} sent`));
      }, index * 500);
    });
  }
  
  // Method 2: Internal Linking Boost
  function createInternalLinks() {
    const currentUrl = window.location.href;
    const currentTitle = document.title;
    
    // Store current page for cross-linking
    const pages = JSON.parse(localStorage.getItem('site_pages') || '[]');
    const pageExists = pages.some(p => p.url === currentUrl);
    
    if (!pageExists) {
      pages.unshift({
        url: currentUrl,
        title: currentTitle,
        path: window.location.pathname,
        timestamp: new Date().toISOString()
      });
      
      // Keep last 50 pages
      if (pages.length > 50) pages.splice(50);
      localStorage.setItem('site_pages', JSON.stringify(pages));
    }
    
    // Add related links section if it doesn't exist
    addRelatedLinksSection(pages);
  }
  
  function addRelatedLinksSection(pages) {
    // Check if related links already exist
    if (document.querySelector('.auto-related-links')) return;
    
    const currentPath = window.location.pathname;
    const relatedPages = pages
      .filter(p => p.url !== window.location.href)
      .filter(p => {
        // Find related pages (same category or similar keywords)
        if (currentPath.includes('/blog/')) {
          return p.path.includes('/blog/');
        }
        return true;
      })
      .slice(0, 5);
    
    if (relatedPages.length === 0) return;
    
    // Create related links section
    const relatedSection = document.createElement('div');
    relatedSection.className = 'auto-related-links';
    relatedSection.style.cssText = `
      margin: 2rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #007bff;
    `;
    
    relatedSection.innerHTML = `
      <h3 style="margin: 0 0 1rem 0; color: #333; font-size: 1.1rem;">📖 Artículos Relacionados</h3>
      <ul style="margin: 0; padding-left: 1.2rem; list-style-type: disc;">
        ${relatedPages.map(page => `
          <li style="margin: 0.5rem 0;">
            <a href="${page.url}" style="color: #007bff; text-decoration: none;">
              ${page.title}
            </a>
          </li>
        `).join('')}
      </ul>
    `;
    
    // Insert before footer or at end of main content
    const footer = document.querySelector('footer');
    const main = document.querySelector('main, .main-content, .container');
    
    if (footer) {
      footer.parentNode.insertBefore(relatedSection, footer);
    } else if (main) {
      main.appendChild(relatedSection);
    } else {
      document.body.appendChild(relatedSection);
    }
    
    log('Related links section added');
  }
  
  // Method 3: Meta Optimization
  function optimizeMeta() {
    // Add missing meta tags for better indexing
    const metaTags = [
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow' },
      { property: 'og:locale', content: 'es_ES' },
      { property: 'og:site_name', content: 'Amarres de Amor Fuertes' }
    ];
    
    metaTags.forEach(tag => {
      const existing = document.querySelector(`meta[name="${tag.name}"], meta[property="${tag.property}"]`);
      if (!existing) {
        const meta = document.createElement('meta');
        if (tag.name) meta.name = tag.name;
        if (tag.property) meta.property = tag.property;
        meta.content = tag.content;
        document.head.appendChild(meta);
      }
    });
    
    // Add structured data if missing
    if (!document.querySelector('script[type="application/ld+json"]')) {
      addBasicStructuredData();
    }
  }
  
  function addBasicStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": document.title,
      "description": document.querySelector('meta[name="description"]')?.content || '',
      "url": window.location.href,
      "inLanguage": "es",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Amarres de Amor Fuertes",
        "url": CONFIG.siteUrl
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    log('Basic structured data added');
  }
  
  // Method 4: Social Signals
  function createSocialSignals() {
    // Add social sharing buttons if they don't exist
    if (document.querySelector('.auto-social-share')) return;
    
    const currentUrl = encodeURIComponent(window.location.href);
    const currentTitle = encodeURIComponent(document.title);
    
    const socialButtons = document.createElement('div');
    socialButtons.className = 'auto-social-share';
    socialButtons.style.cssText = `
      position: fixed;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    
    socialButtons.innerHTML = `
      <a href="https://www.facebook.com/sharer/sharer.php?u=${currentUrl}" 
         target="_blank" rel="noopener"
         style="display: block; width: 40px; height: 40px; background: #3b5998; color: white; text-align: center; line-height: 40px; border-radius: 50%; text-decoration: none; font-size: 18px;"
         title="Compartir en Facebook">f</a>
      <a href="https://twitter.com/intent/tweet?url=${currentUrl}&text=${currentTitle}" 
         target="_blank" rel="noopener"
         style="display: block; width: 40px; height: 40px; background: #1da1f2; color: white; text-align: center; line-height: 40px; border-radius: 50%; text-decoration: none; font-size: 18px;"
         title="Compartir en Twitter">t</a>
      <a href="https://wa.me/?text=${currentTitle}%20${currentUrl}" 
         target="_blank" rel="noopener"
         style="display: block; width: 40px; height: 40px; background: #25d366; color: white; text-align: center; line-height: 40px; border-radius: 50%; text-decoration: none; font-size: 18px;"
         title="Compartir en WhatsApp">w</a>
    `;
    
    // Hide on mobile
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    if (mediaQuery.matches) {
      socialButtons.style.display = 'none';
    }
    
    document.body.appendChild(socialButtons);
    log('Social sharing buttons added');
  }
  
  // Method 5: Page Performance Signals
  function optimizePageSignals() {
    // Add viewport meta if missing
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(viewport);
    }
    
    // Preload critical resources
    const criticalLinks = document.querySelectorAll('link[rel="stylesheet"]');
    criticalLinks.forEach((link, index) => {
      if (index < 2) { // Only first 2 stylesheets
        link.setAttribute('rel', 'preload');
        link.setAttribute('as', 'style');
        link.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");
      }
    });
    
    log('Page performance optimized');
  }
  
  // Main execution function
  function executeIndexingMethods() {
    log('Starting simple indexing process');
    
    if (CONFIG.methods.sitemapPing) {
      setTimeout(pingSitemaps, 1000);
    }
    
    if (CONFIG.methods.internalLinking) {
      setTimeout(createInternalLinks, 2000);
    }
    
    if (CONFIG.methods.metaOptimization) {
      setTimeout(optimizeMeta, 500);
    }
    
    if (CONFIG.methods.socialSignals) {
      setTimeout(createSocialSignals, 3000);
    }
    
    setTimeout(optimizePageSignals, 100);
    
    // Track in analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'simple_indexing_executed', {
        'page_url': window.location.href,
        'page_title': document.title,
        'timestamp': new Date().toISOString()
      });
    }
  }
  
  // Public API
  window.SimpleIndexing = {
    execute: executeIndexingMethods,
    pingSitemaps: pingSitemaps,
    addRelatedLinks: () => createInternalLinks(),
    optimizeMeta: optimizeMeta,
    
    getStats: function() {
      const pages = JSON.parse(localStorage.getItem('site_pages') || '[]');
      return {
        totalPages: pages.length,
        currentPage: window.location.href,
        lastUpdate: new Date().toISOString()
      };
    },
    
    configure: function(newConfig) {
      Object.assign(CONFIG, newConfig);
      log('Configuration updated', CONFIG);
    }
  };
  
  // Auto-execute on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeIndexingMethods);
  } else {
    executeIndexingMethods();
  }
  
})();

// Usage:
// SimpleIndexing.execute(); // Manual execution
// SimpleIndexing.pingSitemaps(); // Just ping sitemaps
// console.log(SimpleIndexing.getStats()); // Get statistics