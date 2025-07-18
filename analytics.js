// Google Analytics 4 Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX', {
  page_title: document.title,
  page_location: window.location.href,
  custom_map: {
    'custom_parameter_1': 'user_type',
    'custom_parameter_2': 'content_category'
  }
});

// Enhanced Engagement Tracking
document.addEventListener('DOMContentLoaded', function() {
  
  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      if (maxScroll % 25 === 0) { // Track every 25%
        gtag('event', 'scroll_depth', {
          'scroll_percentage': maxScroll,
          'page_title': document.title
        });
      }
    }
  });

  // Track time on page
  let startTime = Date.now();
  window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    gtag('event', 'time_on_page', {
      'time_seconds': timeOnPage,
      'page_title': document.title
    });
  });

  // Track internal link clicks
  document.querySelectorAll('a[href^="/"], a[href^="https://amarredeamorfuertes.com"]').forEach(link => {
    link.addEventListener('click', function() {
      gtag('event', 'internal_link_click', {
        'link_url': this.href,
        'link_text': this.textContent.trim(),
        'page_title': document.title
      });
    });
  });

  // Track CTA button clicks
  document.querySelectorAll('.cta-button, .btn-primary, button[type="submit"]').forEach(button => {
    button.addEventListener('click', function() {
      gtag('event', 'cta_click', {
        'button_text': this.textContent.trim(),
        'button_location': this.closest('section')?.id || 'unknown',
        'page_title': document.title
      });
    });
  });

  // Track form interactions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
      gtag('event', 'form_submit', {
        'form_id': this.id || 'unknown',
        'page_title': document.title
      });
    });
  });

  // Track video interactions
  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', function() {
      gtag('event', 'video_play', {
        'video_title': this.title || 'unknown',
        'page_title': document.title
      });
    });
  });

  // Track social media clicks
  document.querySelectorAll('a[href*="facebook"], a[href*="instagram"], a[href*="twitter"]').forEach(socialLink => {
    socialLink.addEventListener('click', function() {
      gtag('event', 'social_click', {
        'social_platform': this.href.includes('facebook') ? 'facebook' : 
                          this.href.includes('instagram') ? 'instagram' : 'twitter',
        'page_title': document.title
      });
    });
  });

  // Track FAQ interactions
  document.querySelectorAll('.faq-item, .accordion-item').forEach(faq => {
    faq.addEventListener('click', function() {
      gtag('event', 'faq_interaction', {
        'faq_question': this.querySelector('h3, h4')?.textContent || 'unknown',
        'page_title': document.title
      });
    });
  });

  // Track blog article reads
  if (window.location.pathname.includes('/blog/')) {
    gtag('event', 'blog_article_view', {
      'article_title': document.title,
      'article_url': window.location.href,
      'reading_time': Math.round(document.body.textContent.length / 200) // Estimated reading time
    });
  }

  // Track mobile vs desktop usage
  gtag('event', 'device_type', {
    'device_category': window.innerWidth < 768 ? 'mobile' : 'desktop',
    'screen_resolution': `${window.innerWidth}x${window.innerHeight}`,
    'page_title': document.title
  });

});

// Performance monitoring
window.addEventListener('load', function() {
  if ('performance' in window) {
    const perfData = performance.getEntriesByType('navigation')[0];
    gtag('event', 'page_performance', {
      'load_time': Math.round(perfData.loadEventEnd - perfData.loadEventStart),
      'dom_content_loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
      'page_title': document.title
    });
  }
});

// Error tracking
window.addEventListener('error', function(e) {
  gtag('event', 'javascript_error', {
    'error_message': e.message,
    'error_filename': e.filename,
    'error_lineno': e.lineno,
    'page_title': document.title
  });
}); 