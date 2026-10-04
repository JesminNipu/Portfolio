/**
 * Jesmin Akther — Academic Portfolio
 * Main JavaScript — navigation, theme, scroll animations, publication filter
 */

(function () {
  'use strict';

  /* ── DOM ready ─────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initTheme();
    initNavToggle();
    initSmoothScroll();
    initScrollSpy();
    initFadeIn();
    initPublicationFilter();
    updateFooterYear();
  }

  /* ── Theme toggle ──────────────────────────────────────── */
  const THEME_KEY = 'ja-portfolio-theme';

  function initTheme() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    // Honour OS preference first, then saved preference
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;

    applyTheme(isDark);

    btn.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(!current);
    });
  }

  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');

    const icon = document.querySelector('#themeToggle i');
    if (icon) {
      icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  /* ── Mobile nav toggle ─────────────────────────────────── */
  function initNavToggle() {
    const toggle = document.querySelector('.nav-toggle');
    const menu   = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Close when a link is clicked
    menu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Smooth scroll (backup for older browsers) ─────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ── Scroll spy — highlight active nav link ─────────────── */
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + entry.target.id) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach(function (sec) { observer.observe(sec); });
  }

  /* ── Fade-in on scroll ─────────────────────────────────── */
  function initFadeIn() {
    // Only animate if motion is acceptable
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const targets = document.querySelectorAll(
      '.interest-card, .timeline-card, .pub-card, .project-card, ' +
      '.teaching-card, .achievement-item, .contact-card, .tech-group, .stat-item'
    );

    targets.forEach(function (el) { el.classList.add('fade-in'); });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ── Publication filter ────────────────────────────────── */
  function initPublicationFilter() {
    const filters = document.querySelectorAll('.pub-filter');
    const cards   = document.querySelectorAll('.pub-card');
    if (!filters.length || !cards.length) return;

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Update active state
        filters.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');

        cards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-type') === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ── Footer year ───────────────────────────────────────── */
  function updateFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

})();
