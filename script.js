// Professional & Efficient JS for fade-in animations and header functionality
// Use requestIdleCallback for better performance
const initApp = () => {
    // Header functionality
    const header = document.querySelector('.header-mistico');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Fade-in animations
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => {
        observer.observe(el);
    });
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// iOS Video Fix
function fixIOSVideo() {
    const video = document.querySelector('.maestro-video');
    if (video) {
        // Force play on iOS
        video.addEventListener('loadedmetadata', function() {
            video.play().catch(function(error) {
                console.log('Video autoplay failed:', error);
                // Try again on user interaction
                document.addEventListener('touchstart', function() {
                    video.play().catch(function(e) {
                        console.log('Video play failed:', e);
                    });
                }, { once: true });
            });
        });

        // Handle iOS Safari specific issues
        video.addEventListener('webkitbeginfullscreen', function() {
            video.play();
        });

        video.addEventListener('webkitendfullscreen', function() {
            video.play();
        });
    }
}

// Call iOS video fix
fixIOSVideo(); 