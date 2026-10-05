/* ============================================
   PORTFOLIO — FILTER & INTERACTION
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initPortfolioFilter();
    });

    function initPortfolioFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        const portfolioGrid = document.getElementById('portfolio-grid');

        if (filterButtons.length === 0 || projectCards.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                // Filter projects
                filterProjects(filter);
            });
        });

        function filterProjects(filter) {
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    card.classList.remove('hidden');
                    // Re-trigger animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'opacity 400ms ease, transform 400ms ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.classList.add('hidden');
                }
            });

            // Scroll into view if grid is above fold
            if (portfolioGrid) {
                const rect = portfolioGrid.getBoundingClientRect();
                if (rect.top < 0) {
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = portfolioGrid.getBoundingClientRect().top + window.pageYOffset - headerHeight - 40;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        }

        // Check URL for filter parameter
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        if (filterParam) {
            const matchingBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
            if (matchingBtn) {
                matchingBtn.click();
            }
        }

        // Check URL hash for category
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const matchingBtn = document.querySelector(`.filter-btn[data-filter="${hash}"]`);
            if (matchingBtn) {
                setTimeout(() => matchingBtn.click(), 100);
            }
        }
    }

})();