/**
 * UDAWALAWE ADVENTURE CAMPING
 * Premium Adventure Tourism Website
 * Vanilla JavaScript - Mobile First
 * 
 * Features:
 * - Smooth scroll animations with Intersection Observer
 * - Mobile menu toggle
 * - Header scroll behavior
 * - Parallax effects for hero/activity sections
 * - Scroll reveal animations
 * - Touch-friendly interactions
 */

(function () {
    'use strict';

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const backToTop = document.getElementById('backToTop');

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    /**
     * Throttle function to limit execution rate
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} Throttled function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if device supports touch
     * @returns {boolean}
     */
    function isTouchDevice() {
        return window.matchMedia('(pointer: coarse)').matches;
    }

    /**
     * Check if reduced motion is preferred
     * @returns {boolean}
     */
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // ============================================
    // HEADER SCROLL BEHAVIOR
    // ============================================

    /**
     * Handle header background on scroll
     */
    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        const threshold = 50;

        if (scrollY > threshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Throttled scroll handler for performance
    const throttledHeaderScroll = throttle(handleHeaderScroll, 16);
    window.addEventListener('scroll', throttledHeaderScroll, { passive: true });

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================

    /**
     * Handle back to top button visibility
     */
    function handleBackToTop() {
        const scrollY = window.scrollY;
        const threshold = 500;

        if (scrollY > threshold) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    /**
     * Scroll to top smoothly
     */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });
    }

    // Back to top scroll handler
    const throttledBackToTop = throttle(handleBackToTop, 16);
    window.addEventListener('scroll', throttledBackToTop, { passive: true });

    // Back to top click handler
    if (backToTop) {
        backToTop.addEventListener('click', scrollToTop);
    }

    // ============================================
    // MOBILE MENU
    // ============================================

    /**
     * Toggle mobile menu open/close
     */
    function toggleMobileMenu() {
        const isOpen = mobileMenu.classList.contains('active');

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    function openMobileMenu() {
        menuToggle.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Menu toggle click handler
    menuToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================

    /**
     * Smooth scroll to target element
     * @param {Event} e - Click event
     */
    function handleSmoothScroll(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');

        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth'
                });
            }
        }
    }

    // Attach smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================

    /**
     * Initialize scroll reveal animations using Intersection Observer
     */
    function initScrollReveal() {
        if (prefersReducedMotion()) return;

        const revealElements = document.querySelectorAll(
            '.section-header, .experience-card, .plan-item, .review-card, .contact-content'
        );

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        });

        revealElements.forEach((el, index) => {
            el.classList.add('scroll-reveal');
            // Add stagger delay for cards
            if (el.classList.contains('experience-card') || el.classList.contains('review-card')) {
                el.classList.add(`stagger-${(index % 6) + 1}`);
            }
            revealObserver.observe(el);
        });
    }

    // Initialize scroll reveal
    initScrollReveal();

    // ============================================
    // PARALLAX EFFECTS
    // ============================================

    /**
     * Initialize parallax effects for background images
     */
    function initParallax() {
        if (prefersReducedMotion() || isTouchDevice()) return;

        const parallaxSections = document.querySelectorAll('.hero, .activity-section, .transition-section');

        const parallaxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.dataset.parallaxActive = 'true';
                } else {
                    entry.target.dataset.parallaxActive = 'false';
                }
            });
        }, {
            root: null,
            rootMargin: '10% 0px 10% 0px',
            threshold: 0
        });

        parallaxSections.forEach(section => {
            parallaxObserver.observe(section);
        });

        // Parallax scroll handler
        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;

            parallaxSections.forEach(section => {
                if (section.dataset.parallaxActive !== 'true') return;

                const bg = section.querySelector('.hero-bg img, .activity-bg img, .transition-bg img');
                if (!bg) return;

                const rect = section.getBoundingClientRect();
                const sectionCenter = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const distance = (sectionCenter - viewportCenter) / window.innerHeight;

                // Subtle parallax movement (max 20px)
                const translateY = distance * -20;
                bg.style.transform = `translateY(${translateY}px) scale(1.08)`;
            });

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // Initialize parallax
    initParallax();

    // ============================================
    // HERO ENTRANCE ANIMATION
    // ============================================

    /**
     * Animate hero elements on page load
     */
    function animateHeroEntrance() {
        if (prefersReducedMotion()) return;

        const heroHeadline = document.querySelector('.hero-headline');
        const heroSubheadline = document.querySelector('.hero-subheadline');
        const heroCtAs = document.querySelector('.hero-ctas');
        const heroInfoBar = document.querySelector('.hero-info-bar');
        const heroBg = document.querySelector('.hero-bg img');

        // Initial states
        if (heroBg) {
            heroBg.style.opacity = '0';
            heroBg.style.transform = 'scale(1.18)';
        }

        const headlineLines = heroHeadline?.querySelectorAll('.headline-line') || [];
        headlineLines.forEach(line => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(40px)';
        });

        if (heroSubheadline) {
            heroSubheadline.style.opacity = '0';
            heroSubheadline.style.transform = 'translateY(18px)';
        }

        if (heroCtAs) {
            heroCtAs.style.opacity = '0';
            heroCtAs.style.transform = 'translateY(18px)';
        }

        if (heroInfoBar) {
            heroInfoBar.style.opacity = '0';
            heroInfoBar.style.transform = 'translateY(24px)';
        }

        // Trigger animations
        requestAnimationFrame(() => {
            // Background
            if (heroBg) {
                setTimeout(() => {
                    heroBg.style.transition = 'opacity 1.1s ease, transform 1.1s ease';
                    heroBg.style.opacity = '1';
                    heroBg.style.transform = 'scale(1.08)';
                }, 100);
            }

            // Headline lines
            headlineLines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                    line.style.opacity = '1';
                    line.style.transform = 'translateY(0)';
                }, 300 + (index * 80));
            });

            // Subheadline
            if (heroSubheadline) {
                setTimeout(() => {
                    heroSubheadline.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    heroSubheadline.style.opacity = '1';
                    heroSubheadline.style.transform = 'translateY(0)';
                }, 600);
            }

            // CTAs
            if (heroCtAs) {
                setTimeout(() => {
                    heroCtAs.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    heroCtAs.style.opacity = '1';
                    heroCtAs.style.transform = 'translateY(0)';
                }, 750);
            }

            // Info bar
            if (heroInfoBar) {
                setTimeout(() => {
                    heroInfoBar.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    heroInfoBar.style.opacity = '1';
                    heroInfoBar.style.transform = 'translateY(0)';
                }, 900);
            }
        });
    }

    // Run hero animation on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', animateHeroEntrance);
    } else {
        animateHeroEntrance();
    }

    // ============================================
    // ACTIVITY SECTION ANIMATIONS
    // ============================================

    /**
     * Initialize scroll-triggered animations for activity sections
     */
    function initActivityAnimations() {
        if (prefersReducedMotion()) return;

        const activitySections = document.querySelectorAll('.activity-section');

        const activityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    const headline = section.querySelector('.activity-headline');
                    const caption = section.querySelector('.activity-caption');
                    const cta = section.querySelector('.activity-cta');
                    const bg = section.querySelector('.activity-bg img');

                    // Animate elements
                    if (headline) {
                        headline.style.opacity = '0';
                        headline.style.transform = 'translateY(60px)';
                        setTimeout(() => {
                            headline.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                            headline.style.opacity = '1';
                            headline.style.transform = 'translateY(0)';
                        }, 100);
                    }

                    if (caption) {
                        caption.style.opacity = '0';
                        caption.style.transform = 'translateX(-30px)';
                        setTimeout(() => {
                            caption.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                            caption.style.opacity = '1';
                            caption.style.transform = 'translateX(0)';
                        }, 300);
                    }

                    if (cta) {
                        cta.style.opacity = '0';
                        cta.style.transform = 'translateX(30px)';
                        setTimeout(() => {
                            cta.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                            cta.style.opacity = '1';
                            cta.style.transform = 'translateX(0)';
                        }, 400);
                    }

                    if (bg) {
                        bg.style.transform = 'scale(1.12)';
                        setTimeout(() => {
                            bg.style.transition = 'transform 1.2s ease';
                            bg.style.transform = 'scale(1.08)';
                        }, 50);
                    }

                    activityObserver.unobserve(section);
                }
            });
        }, {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.3
        });

        activitySections.forEach(section => {
            activityObserver.observe(section);
        });
    }

    // Initialize activity animations
    initActivityAnimations();

    // ============================================
    // TRANSITION SECTION ANIMATION
    // ============================================

    /**
     * Initialize animation for transition section
     */
    function initTransitionAnimation() {
        if (prefersReducedMotion()) return;

        const transitionSection = document.querySelector('.transition-section');
        if (!transitionSection) return;

        const transitionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const headline = transitionSection.querySelector('.transition-headline');
                    const label = transitionSection.querySelector('.transition-label');

                    if (headline) {
                        headline.style.opacity = '0';
                        headline.style.transform = 'translateY(40px)';
                        setTimeout(() => {
                            headline.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
                            headline.style.opacity = '1';
                            headline.style.transform = 'translateY(0)';
                        }, 100);
                    }

                    if (label) {
                        label.style.opacity = '0';
                        setTimeout(() => {
                            label.style.transition = 'opacity 0.6s ease';
                            label.style.opacity = '1';
                        }, 500);
                    }

                    transitionObserver.unobserve(transitionSection);
                }
            });
        }, {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0.4
        });

        transitionObserver.observe(transitionSection);
    }

    // Initialize transition animation
    initTransitionAnimation();

    // ============================================
    // CARD HOVER EFFECTS (Desktop only)
    // ============================================

    /**
     * Add enhanced hover effects for experience cards
     */
    function initCardHoverEffects() {
        if (isTouchDevice()) return;

        const cards = document.querySelectorAll('.experience-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // Initialize card hover effects
    initCardHoverEffects();

    // ============================================
    // LAZY LOADING FOR IMAGES
    // ============================================

    /**
     * Initialize lazy loading for images
     */
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            lazyImages.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        } else {
            // Fallback for older browsers
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Initialize lazy loading
    initLazyLoading();

    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================

    /**
     * Cleanup function for page unload
     */
    function cleanup() {
        // Remove event listeners if needed
        window.removeEventListener('scroll', throttledHeaderScroll);
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    // ============================================
    // CONSOLE WELCOME MESSAGE
    // ============================================

    // ============================================
    // GLOBAL COMPONENTS LOADER
    // ============================================



    // ============================================
    // BOOKING FORM HANDLING
    // ============================================

    /**
     * Handle booking form submission via AJAX
     */
    function initBookingForm() {
        const form = document.getElementById('booking-form');
        const status = document.getElementById('form-status');

        if (!form) return;

        async function handleSubmit(event) {
            event.preventDefault();
            const data = new FormData(event.target);

            // Disable button
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerText = 'Sending...';
            status.innerHTML = '';
            status.className = 'form-status';

            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.innerHTML = "Thanks for your booking request! We'll be in touch shortly.";
                    status.classList.add('success');
                    form.reset();
                } else {
                    const jsonData = await response.json();
                    if (Object.hasOwn(jsonData, 'errors')) {
                        status.innerHTML = jsonData.errors.map(error => error.message).join(", ");
                    } else {
                        status.innerHTML = "Oops! There was a problem submitting your form. Please try again or contact us via WhatsApp.";
                    }
                    status.classList.add('error');
                }
            } catch (error) {
                status.innerHTML = "Oops! There was a problem submitting your form. Please check your internet connection and try again.";
                status.classList.add('error');
            } finally {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        }

        form.addEventListener('submit', handleSubmit);
    }

    // Initialize booking form
    initBookingForm();

    console.log('%c Udawalawe Adventure Camping ', 'background: #D9A24A; color: #0B0F0D; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
    console.log('%c Wilderness. Wonder. You. ', 'color: #D9A24A; font-size: 12px;');

})();
