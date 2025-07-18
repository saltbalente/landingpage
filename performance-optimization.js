// Performance Optimization for Core Web Vitals
// Focus on FID (First Input Delay) improvement

// Defer non-critical JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Optimize event listeners with passive option
    const optimizeScroll = () => {
        let ticking = false;
        
        function updateScroll() {
            // Update scroll-based animations
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    };
    
    // Optimize touch events
    const optimizeTouch = () => {
        let startY = 0;
        let startX = 0;
        
        document.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        document.addEventListener('touchmove', function(e) {
            if (!e.target.closest('.scrollable')) {
                e.preventDefault();
            }
        }, { passive: false });
    };
    
    // Optimize form interactions
    const optimizeForms = () => {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Debounce form submissions
            let submitTimeout;
            
            form.addEventListener('submit', function(e) {
                if (submitTimeout) {
                    clearTimeout(submitTimeout);
                }
                
                submitTimeout = setTimeout(() => {
                    // Handle form submission
                    console.log('Form submitted');
                }, 100);
            });
            
            // Optimize input events
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                let inputTimeout;
                
                input.addEventListener('input', function(e) {
                    if (inputTimeout) {
                        clearTimeout(inputTimeout);
                    }
                    
                    inputTimeout = setTimeout(() => {
                        // Handle input validation
                        validateInput(input);
                    }, 300);
                }, { passive: true });
            });
        });
    };
    
    // Input validation function
    const validateInput = (input) => {
        const value = input.value.trim();
        const type = input.type;
        
        // Remove error class
        input.classList.remove('error');
        
        // Validate based on type
        switch(type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    input.classList.add('error');
                }
                break;
            case 'tel':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
                    input.classList.add('error');
                }
                break;
            default:
                if (input.required && !value) {
                    input.classList.add('error');
                }
        }
    };
    
    // Optimize button clicks
    const optimizeButtons = () => {
        const buttons = document.querySelectorAll('button, .btn, .cta-button');
        
        buttons.forEach(button => {
            let clickTimeout;
            
            button.addEventListener('click', function(e) {
                // Prevent double clicks
                if (clickTimeout) {
                    e.preventDefault();
                    return;
                }
                
                clickTimeout = setTimeout(() => {
                    clickTimeout = null;
                }, 500);
                
                // Add loading state
                if (button.dataset.loading !== 'true') {
                    button.dataset.loading = 'true';
                    button.disabled = true;
                    
                    // Simulate loading
                    setTimeout(() => {
                        button.dataset.loading = 'false';
                        button.disabled = false;
                    }, 1000);
                }
            });
        });
    };
    
    // Optimize navigation
    const optimizeNavigation = () => {
        const navLinks = document.querySelectorAll('nav a, .nav a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Preload destination page
                const href = this.href;
                if (href && !href.startsWith('#')) {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = href;
                    document.head.appendChild(link);
                }
            });
        });
    };
    
    // Optimize images loading
    const optimizeImageLoading = () => {
        const images = document.querySelectorAll('img[data-src]');
        
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
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    };
    
    // Optimize CSS animations
    const optimizeAnimations = () => {
        // Use transform and opacity for animations
        const animatedElements = document.querySelectorAll('.animate, .fade-in, .slide-in');
        
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
            
            // Remove will-change after animation
            setTimeout(() => {
                element.style.willChange = 'auto';
            }, 1000);
        });
    };
    
    // Initialize optimizations
    const initOptimizations = () => {
        optimizeScroll();
        optimizeTouch();
        optimizeForms();
        optimizeButtons();
        optimizeNavigation();
        optimizeImageLoading();
        optimizeAnimations();
    };
    
    // Run optimizations after a short delay
    setTimeout(initOptimizations, 100);
});

// Service Worker registration for caching
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Preload critical resources
const preloadCriticalResources = () => {
    const criticalResources = [
        '/styles.css',
        '/mobile-optimization.css',
        '/image-optimization.js'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        link.href = resource;
        document.head.appendChild(link);
    });
};

// Run preloading immediately
preloadCriticalResources(); 