/* ============================================
   MAIN JAVASCRIPT — SITE INTERACTIONS
   ============================================ */

(function() {
    'use strict';

    // ===== DOM READY =====
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initMobileMenu();
        initScrollReveal();
        initSmoothScroll();
        initCurrentYear();
        initHeaderScroll();
        initLightbox();
    });

    // ===== NAVIGATION — ACTIVE LINK =====
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath || 
                (currentPath === '' && linkPath === 'index.html') ||
                (currentPath === '/' && linkPath === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // ===== MOBILE MENU =====
    function initMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const menu = document.getElementById('mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');

        if (!toggle || !menu) return;

        toggle.addEventListener('click', function() {
            const isOpen = menu.classList.contains('active');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close menu with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        function openMobileMenu() {
            menu.classList.add('active');
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            menu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeMobileMenu() {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    // ===== SCROLL REVEAL =====
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');

        if (!('IntersectionObserver' in window)) {
            // Fallback: show all immediately
            reveals.forEach(el => el.classList.add('revealed'));
            return;
        }

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== CURRENT YEAR IN FOOTER =====
    function initCurrentYear() {
        const yearEls = document.querySelectorAll('#current-year');
        const year = new Date().getFullYear();
        yearEls.forEach(el => el.textContent = year);
    }

    // ===== HEADER SCROLL EFFECT =====
    function initHeaderScroll() {
        const header = document.getElementById('site-header');
        if (!header) return;

        let lastScroll = 0;
        let ticking = false;

        function updateHeader() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    // ===== LIGHTBOX =====
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        const lightboxImage = document.getElementById('lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        // Find gallery items that should trigger the lightbox
        const galleryItems = document.querySelectorAll('.gallery-item img, [data-lightbox] img');
        let currentIndex = 0;
        let images = [];

        // Build images array
        galleryItems.forEach((img, index) => {
            images.push({
                src: img.src,
                alt: img.alt || ''
            });

            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function(e) {
                e.preventDefault();
                currentIndex = index;
                openLightbox();
            });
        });

        function openLightbox() {
            if (images.length === 0) return;
            lightbox.removeAttribute('hidden');
            document.body.style.overflow = 'hidden';
            updateLightboxImage();
        }

        function closeLightbox() {
            lightbox.setAttribute('hidden', '');
            document.body.style.overflow = '';
        }

        function updateLightboxImage() {
            if (!lightboxImage) return;
            lightboxImage.src = images[currentIndex].src;
            lightboxImage.alt = images[currentIndex].alt;
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightboxImage();
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightboxImage();
        }

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);
        if (prevBtn) prevBtn.addEventListener('click', prevImage);

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (lightbox.hasAttribute('hidden')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    }

    // ===== LAZY LOADING FALLBACK =====
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback with Intersection Observer
        if ('IntersectionObserver' in window) {
            const imgObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imgObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
        }
    }

})();