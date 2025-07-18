// Image Optimization Script for Core Web Vitals
document.addEventListener('DOMContentLoaded', function() {
    
    // Lazy loading for all images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add lazy loading
        img.loading = 'lazy';
        
        // Add fetchpriority for above-the-fold images
        if (img.dataset.priority === 'high') {
            img.fetchPriority = 'high';
        }
        
        // Add decoding attribute
        img.decoding = 'async';
        
        // Add error handling
        img.onerror = function() {
            this.style.display = 'none';
            console.log('Image failed to load:', this.src);
        };
    });

    // Preload critical images
    const criticalImages = [
        'f149d6923e64bcba466f370bec99aae5.jpg',
        'f74468681f78b86c8f9e6c0f16371d1b.jpg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
    });

    // Responsive images with srcset
    const responsiveImages = document.querySelectorAll('img[data-srcset]');
    responsiveImages.forEach(img => {
        img.srcset = img.dataset.srcset;
        img.sizes = img.dataset.sizes || '100vw';
    });

    // WebP support detection and fallback
    function supportsWebP() {
        const elem = document.createElement('canvas');
        if (elem.getContext && elem.getContext('2d')) {
            return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    }

    if (supportsWebP()) {
        const webpImages = document.querySelectorAll('img[data-webp]');
        webpImages.forEach(img => {
            img.src = img.dataset.webp;
        });
    }
});

// Intersection Observer for lazy loading
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
} 