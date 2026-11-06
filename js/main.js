/* ============================================
   CLARENCE.R — Main JavaScript
   Handles: component injection, mobile menu,
   scroll reveal, active nav, copyright year
   ============================================ */

(function () {
  // 1. Detect base path from meta tag
  const baseMeta = document.querySelector('meta[name="base-path"]');
  const BASE = baseMeta ? baseMeta.getAttribute("content") : "";

  // 2. Fetch and inject header + footer
  async function loadComponents() {
    try {
      const [headerRes, footerRes] = await Promise.all([
        fetch(BASE + "components/header.html"),
        fetch(BASE + "components/footer.html"),
      ]);

      let headerHTML = await headerRes.text();
      let footerHTML = await footerRes.text();

      // Replace {{BASE}} placeholder with actual path
      headerHTML = headerHTML.replace(/\{\{BASE\}\}/g, BASE);
      footerHTML = footerHTML.replace(/\{\{BASE\}\}/g, BASE);

      // Inject into placeholders
      const headerPlaceholder = document.getElementById("header-placeholder");
      const footerPlaceholder = document.getElementById("footer-placeholder");

      if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;
      if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

      // 3. Set active nav link based on current page
      const currentPage =
        window.location.pathname.split("/").pop().replace(".html", "") ||
        "index";
      const navLinks = document.querySelectorAll(
        ".nav-link[data-page], .mobile-nav-link[data-page]",
      );

      navLinks.forEach((link) => {
        if (link.getAttribute("data-page") === currentPage) {
          link.classList.add("active");
        }
      });

      // 4. Initialize mobile menu (after header is injected)
      initMobileMenu();

      // 5. Set copyright year
      const yearEl = document.getElementById("current-year");
      if (yearEl) yearEl.textContent = new Date().getFullYear();

      // 6. Re-observe reveal elements (in case components added new ones)
      initScrollReveal();
    } catch (err) {
      console.warn("Component loading failed:", err);
    }
  }

  // Mobile Menu
  function initMobileMenu() {
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", isOpen);
      mobileMenu.setAttribute("aria-hidden", !isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      });
    });
  }

  // Scroll Reveal
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      ".reveal-up:not(.animate-in)",
    );

    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadComponents);
  } else {
    loadComponents();
  }
})();
