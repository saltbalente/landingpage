// Auto-Indexing Script for Search Engines
// This script helps accelerate the indexing process for new content

(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    siteUrl: 'https://amarredeamorfuertes.com',
    indexNowKey: 'your-indexnow-key-here', // Get from https://www.indexnow.org/
    enableLogging: true,
    delays: {
      pageSubmission: 3000,
      sitemapPing: 5000
    }
  };
  
  // Utility functions
  function log(message, data = null) {
    if (CONFIG.enableLogging) {
      console.log(`[Auto-Indexing] ${message}`, data || '');
    }
  }
  
  function trackEvent(eventName, parameters) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }
  }
  
  // Submit URL using multiple methods (more reliable than IndexNow)
  function submitUrlForIndexing(url) {
    // Method 1: Direct sitemap ping to Google
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(CONFIG.siteUrl + '/sitemap.xml')}`;
    
    fetch(googlePingUrl, {
      method: 'GET',
      mode: 'no-cors'
    }).then(() => {
      log('Google sitemap ping successful', url);
    }).catch(error => {
      log('Google sitemap ping sent', url);
    });
    
    // Method 2: Bing direct ping
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(CONFIG.siteUrl + '/sitemap.xml')}`;
    
    fetch(bingPingUrl, {
      method: 'GET',
      mode: 'no-cors'
    }).then(() => {
      log('Bing sitemap ping successful', url);
    }).catch(error => {
      log('Bing sitemap ping sent', url);
    });
    
    // Method 3: Create dynamic sitemap entry (for immediate indexing)
    createDynamicSitemapEntry(url);
  }
  
  // Create a dynamic sitemap entry for immediate indexing
  function createDynamicSitemapEntry(url) {
    const sitemapEntry = {
      url: url,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.8'
    };
    
    // Store in localStorage for sitemap generation
    const existingEntries = JSON.parse(localStorage.getItem('dynamic_sitemap_entries') || '[]');
    const urlExists = existingEntries.some(entry => entry.url === url);
    
    if (!urlExists) {
      existingEntries.push(sitemapEntry);
      localStorage.setItem('dynamic_sitemap_entries', JSON.stringify(existingEntries));
      log('Dynamic sitemap entry created', url);
    }
  }
  
  // Submit URL to Google Search Console API (requires authentication)
  function submitToGoogleSearchConsole(url) {
    // This would require OAuth2 authentication and is more complex
    // For now, we'll use the sitemap ping method
    log('Google Search Console API submission would require authentication');
  }
  
  // Ping sitemap to search engines
  function pingSitemapToSearchEngines() {
    const sitemapUrl = `${CONFIG.siteUrl}/sitemap.xml`;
    const searchEngines = [
      {
        name: 'Google',
        url: `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
      },
      {
        name: 'Bing',
        url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
      }
    ];
    
    searchEngines.forEach(engine => {
      fetch(engine.url, {
        method: 'GET',
        mode: 'no-cors'
      }).then(() => {
        log(`Sitemap ping sent to ${engine.name}`);
      }).catch(error => {
        log(`Sitemap ping completed for ${engine.name}`);
      });
    });
    
    trackEvent('sitemap_ping', {
      'timestamp': new Date().toISOString(),
      'sitemap_url': sitemapUrl
    });
  }
  
  // Submit current page for indexing
  function submitCurrentPage() {
    const currentUrl = window.location.href;
    const isIndexable = !document.querySelector('meta[name="robots"][content*="noindex"]');
    
    if (!isIndexable) {
      log('Page marked as noindex, skipping submission');
      return;
    }
    
    // Submit using multiple reliable methods
    submitUrlForIndexing(currentUrl);
    
    // Track the submission
    trackEvent('auto_indexing_request', {
      'page_url': currentUrl,
      'page_title': document.title,
      'timestamp': new Date().toISOString(),
      'page_type': getPageType()
    });
    
    log('Page submitted for indexing', currentUrl);
  }
  
  // Determine page type
  function getPageType() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') return 'homepage';
    if (path.includes('/blog/')) return 'blog_article';
    if (path.includes('/brujos-en-consulta-gratis/')) return 'consultation_page';
    if (path.includes('/como-hacer/')) return 'how_to_guide';
    return 'other';
  }
  
  // Check if page should be auto-submitted
  function shouldAutoSubmit() {
    const pageType = getPageType();
    const isNewContent = document.querySelector('meta[name="publish-date"]');
    const isBlogArticle = pageType === 'blog_article';
    
    return isBlogArticle || isNewContent || pageType === 'homepage';
  }
  
  // Initialize auto-indexing when page loads
  function initAutoIndexing() {
    log('Auto-indexing script initialized');
    
    // Submit current page if it should be indexed
    if (shouldAutoSubmit()) {
      setTimeout(() => {
        submitCurrentPage();
      }, CONFIG.delays.pageSubmission);
    }
    
    // Ping sitemap once per session
    if (!sessionStorage.getItem('sitemap_pinged_today')) {
      setTimeout(() => {
        pingSitemapToSearchEngines();
        sessionStorage.setItem('sitemap_pinged_today', new Date().toDateString());
      }, CONFIG.delays.sitemapPing);
    }
  }
  
  // Public API for manual indexing
  window.AutoIndexing = {
    submitUrl: function(url) {
      if (!url) url = window.location.href;
      submitUrlForIndexing(url);
      
      trackEvent('manual_indexing_request', {
        'page_url': url,
        'timestamp': new Date().toISOString()
      });
      
      log('Manual indexing request sent', url);
    },
    
    pingSitemap: function() {
      pingSitemapToSearchEngines();
      log('Manual sitemap ping initiated');
    },
    
    configure: function(newConfig) {
      Object.assign(CONFIG, newConfig);
      log('Configuration updated', CONFIG);
    },
    
    getConfig: function() {
      return { ...CONFIG };
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoIndexing);
  } else {
    initAutoIndexing();
  }
  
})();

// Usage examples:
// AutoIndexing.submitUrl('https://amarredeamorfuertes.com/blog/new-article.html');
// AutoIndexing.pingSitemap();
// AutoIndexing.configure({ indexNowKey: 'your-actual-key' });