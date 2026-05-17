// js/main.js — VERSI FINAL FIX
document.addEventListener('DOMContentLoaded', () => {

    // 1. LOADING SCREEN
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
            setTimeout(() => { loader.style.display = 'none'; }, 600);
        }, 2000);
    }

    // 2. NAVBAR SCROLL + SCROLLSPY
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) navbar?.classList.add('scrolled');
        else navbar?.classList.remove('scrolled');

        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) link.classList.add('active');
        });

        const scrollBtn = document.getElementById('scroll-top');
        if (scrollBtn) scrollBtn.style.display = window.scrollY > 500 ? 'block' : 'none';
    });

    // 3. HAMBURGER MENU
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
            hamburger.classList.toggle('active');
        });
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('open');
                hamburger.classList.remove('active');
            });
        });
    }

    // 4. VIEWER TOGGLE 2D/3D (global)
    window.switchViewer = function(mode) {
        const v2 = document.getElementById('viewer-2d');
        const v3 = document.getElementById('viewer-3d');
        const b2 = document.getElementById('btn-2d');
        const b3 = document.getElementById('btn-3d');
        if (!v2 || !v3) return;
        if (mode === '2d') {
            v2.style.display = 'block'; v3.style.display = 'none';
            b2?.classList.add('active'); b3?.classList.remove('active');
            if (typeof map !== 'undefined' && map) setTimeout(() => map.invalidateSize(), 250);
        } else {
            v2.style.display = 'none'; v3.style.display = 'block';
            b3?.classList.add('active'); b2?.classList.remove('active');
            if (typeof resize3D === 'function') setTimeout(resize3D, 100);
        }
    };

    // 5. ACCORDION MITIGASI (global)
    window.toggleAcc = function(zone) {
        const bodyMap = { tinggi:'body-tinggi', menengah:'body-menengah', rendah:'body-rendah', sr:'body-sr' };
        const itemMap = { tinggi:'acc-tinggi', menengah:'acc-menengah', rendah:'acc-rendah', sr:'acc-sr' };
        const bodyEl = document.getElementById(bodyMap[zone]);
        const itemEl = document.getElementById(itemMap[zone]);
        if (!bodyEl || !itemEl) return;
        const isOpen = itemEl.classList.contains('open');
        Object.keys(bodyMap).forEach(z => {
            const b = document.getElementById(bodyMap[z]);
            const i = document.getElementById(itemMap[z]);
            if (b) b.style.display = 'none';
            if (i) i.classList.remove('open');
        });
        if (!isOpen) { bodyEl.style.display = 'block'; itemEl.classList.add('open'); }
    };
    // Buka accordion pertama by default
    const firstAcc = document.getElementById('body-tinggi');
    if (firstAcc) firstAcc.style.display = 'block';

    // 6. TOOLTIP ISTILAH
    const tooltip = document.getElementById('tooltip');
    document.querySelectorAll('.tooltip-term').forEach(term => {
        term.addEventListener('mouseenter', (e) => {
            if (!tooltip) return;
            tooltip.textContent = term.getAttribute('data-tip') || '';
            tooltip.style.display = 'block';
            positionTooltip(e);
        });
        term.addEventListener('mousemove', positionTooltip);
        term.addEventListener('mouseleave', () => { if (tooltip) tooltip.style.display = 'none'; });
    });
    function positionTooltip(e) {
        if (!tooltip) return;
        const x = e.clientX + 14;
        const y = e.clientY - 40;
        tooltip.style.left = Math.min(x, window.innerWidth - tooltip.offsetWidth - 20) + 'px';
        tooltip.style.top = (y < 10 ? e.clientY + 20 : y) + 'px';
    }

    // 7. FADE-IN SCROLL REVEAL
    const fadeEls = document.querySelectorAll('.fade-in');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObs.unobserve(entry.target); }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    fadeEls.forEach(el => revealObs.observe(el));

    // 8. COUNTER ANIMASI
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animateCounter(entry.target); counterObs.unobserve(entry.target); }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObs.observe(el));

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const isFloat = prefix === '0.';
        const start = performance.now();
        (function update(now) {
            const p = Math.min((now - start) / 1400, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const val = target * ease;
            el.textContent = isFloat ? '0.' + Math.floor(val).toString().padStart(3,'0') : prefix + Math.floor(val) + suffix;
            if (p < 1) requestAnimationFrame(update);
            else el.textContent = isFloat ? '0.' + target.toString().padStart(3,'0') : prefix + target + suffix;
        })(start);
    }

    // 9. CHARTS
    if (typeof initCharts === 'function') initCharts();

    // 10. SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const tgt = document.querySelector(anchor.getAttribute('href'));
            if (tgt) { e.preventDefault(); window.scrollTo({ top: tgt.offsetTop - 70, behavior: 'smooth' }); }
        });
    });

});
