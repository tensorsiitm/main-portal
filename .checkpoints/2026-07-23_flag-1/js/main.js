/* ==========================================================================
   Tensors — main.js
   Smooth scroll (Lenis) + scroll animations (GSAP/ScrollTrigger) +
   header/nav behavior. Sections are added incrementally; this file grows
   alongside them.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* Bail to the no-JS fallback (content stays visible) if GSAP failed to load. */
  if (typeof gsap === 'undefined') return;
  document.documentElement.classList.remove('no-js');

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Lenis smooth scroll ---------------- */
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  /* Scroll stays locked until the launch animation finishes */
  lenis.stop();

  /* ---------------- Theme toggle (light / dark) ----------------
     The <head> script already applied the initial theme (saved choice or
     system preference). Here we just wire the button to flip + persist it. */
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const root = document.documentElement;
    const syncButton = () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      themeToggle.setAttribute('aria-pressed', String(isLight));
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    };
    syncButton();
    themeToggle.addEventListener('click', () => {
      const nowLight = root.getAttribute('data-theme') !== 'light';
      if (nowLight) root.setAttribute('data-theme', 'light');
      else root.removeAttribute('data-theme');
      try { localStorage.setItem('tensors-theme', nowLight ? 'light' : 'dark'); } catch (e) {}
      syncButton();
    });
  }

  /* ---------------- Header: scrolled + auto-hide ---------------- */
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    onUpdate: (self) => {
      const y = self.scroll();
      header.classList.toggle('is-scrolled', y > 80);
      /* Hide going down, reveal going up — but never while the menu is open */
      if (!document.body.classList.contains('nav-open')) {
        header.classList.toggle('is-hidden', y > lastScroll && y > 300);
      }
      lastScroll = y;
    },
  });

  /* ---------------- Nav toggle (full-screen overlay on mobile) ---------------- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  const setNav = (open) => {
    mainNav.classList.toggle('is-open', open);
    navToggle.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', open);
    open ? lenis.stop() : lenis.start();
  };

  navToggle.addEventListener('click', () => setNav(!mainNav.classList.contains('is-open')));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('is-open')) setNav(false);
  });

  /* ---------------- Nav links: close menu + Lenis-aware smooth scroll ---------------- */
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      setNav(false);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70 });
      }
    });
  });

  /* Highlight the nav link for the section currently in view */
  mainNav.querySelectorAll('a[href^="#"]').forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => link.classList.toggle('is-active', self.isActive),
    });
  });

  /* ---------------- Hero entrance ---------------- */
  const heroTl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

  heroTl
    .from('[data-anim="eyebrow"]', { opacity: 0, y: 16, duration: 0.6 })
    .from('.hero-title .line', { yPercent: 110, duration: 0.9, stagger: 0.12 }, '-=0.3')
    .from('[data-anim="fade"]', { opacity: 0, y: 20, duration: 0.7, stagger: 0.12 }, '-=0.4')
    /* clearProps so the inline transform doesn't outrank the .is-hidden class later */
    .from('.site-header', { opacity: 0, y: -20, duration: 0.7, clearProps: 'all' }, '-=0.8');

  /* ---------------- Launch animation ----------------
     Wordmark wipes in, tagline fades, progress bar + counter run to 100,
     then curtain panels sweep up to reveal the hero.                      */
  const preloader = document.getElementById('preloader');

  const releaseScroll = () => {
    document.body.classList.remove('is-loading');
    lenis.start();
    ScrollTrigger.refresh();
  };

  if (reduceMotion || !preloader) {
    if (preloader) preloader.remove();
    releaseScroll();
    heroTl.play();
  } else {
    const countEl = document.getElementById('pre-count');
    const progress = { v: 0 };

    gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        preloader.remove();
        releaseScroll();
        heroTl.play();
      },
    })
      .to('#pre-logo', { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power2.inOut' })
      .to('#pre-tag', { opacity: 1, duration: 0.5 }, '-=0.45')
      .to(progress, {
        v: 100,
        duration: 1.6,
        ease: 'power1.inOut',
        onUpdate: () => { countEl.textContent = Math.round(progress.v) + '%'; },
      }, '-=0.9')
      /* Counter grows + brightens as it climbs, so the roll feels alive */
      .fromTo('#pre-count',
        { scale: 0.82, opacity: 0.28 },
        { scale: 1, opacity: 0.7, duration: 1.6, ease: 'power1.inOut' }, '<')
      .to('#pre-bar-fill', { scaleX: 1, duration: 1.6, ease: 'power1.inOut' }, '<')
      /* Lift the mark away, then wipe the curtain up */
      .to('.pre-inner, .pre-count, .pre-glow', { opacity: 0, y: -30, duration: 0.5 }, '+=0.15')
      .to('.pre-curtain span', {
        yPercent: -101,
        duration: 0.8,
        stagger: 0.07,
        ease: 'power3.inOut',
      }, '-=0.25')
      .to(preloader, { opacity: 0, duration: 0.3 }, '-=0.2');
  }

  /* Subtle parallax on the hero glow/grid as user scrolls past hero */
  gsap.to('.hero-glow', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  /* ---------------- Scroll-linked parallax reveals (27n.gg-style) ----------------
     Opacity + motion are tied directly to scroll position (scrub), so content
     parallaxes into place as you scroll rather than snapping in once.
     data-reveal values: '' (drift up), 'left'/'right' (slide in), 'scale' (grow
     from its own centre — used for the Values cards).                          */
  const reveals = gsap.utils.toArray('[data-reveal]');
  if (reduceMotion) {
    gsap.set(reveals, { opacity: 1, x: 0, y: 0, scale: 1 });
  } else {
    reveals.forEach((el) => {
      const dir = el.getAttribute('data-reveal');
      const from = { opacity: 0 };
      if (dir === 'left') from.x = -80;
      else if (dir === 'right') from.x = 80;
      else if (dir === 'scale') from.scale = 0.35;
      else from.y = 70;                                       // default: drift up
      gsap.fromTo(
        el,
        from,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            end: dir === 'scale' ? 'top 65%' : 'top 58%',
            scrub: 0.6,
            /* Drop the inline transform once fully revealed so CSS :hover
               lifts (translateY / scale) aren't blocked by it; scrubbing
               back up re-applies it automatically. */
            onLeave: () => gsap.set(el, { clearProps: 'transform' }),
          },
        }
      );
    });
  }

  /* ---------------- Collaborations: scatter cloud ----------------
     Pills pop outward from the centre once you're at least HALFWAY into the
     section (its middle reaches the middle of the viewport), stay scattered
     while you're reading it, and converge back to the centre only when you're
     about to LEAVE — near the bottom edge scrolling down, or the top edge
     scrolling up. Symmetric in both directions, always the same ~1s pace.
     Below 760px the CSS drops the scatter to a plain wrapped row, so skip
     the (invisible, wasted) animation there entirely.                     */
  const collabsCloud = document.getElementById('collabs-cloud');
  const isStackedMobile = window.matchMedia('(max-width: 760px)').matches;
  if (collabsCloud && !isStackedMobile) {
    const stage = collabsCloud.closest('.collabs-stage');
    const pills = gsap.utils.toArray(collabsCloud.children);
    if (reduceMotion) {
      gsap.set(pills, { '--p': 1 });
    } else {
      gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'center center',  // burst once at least half into the section
          end: 'bottom 20%',       // converge only when about to leave
          toggleActions: 'play reverse play reverse',
        },
      }).to(pills, {
        '--p': 1,
        duration: 1,
        ease: 'back.out(1.6)',
        stagger: 0.12,
      });
    }
  }

  /* ---------------- Count-up stats ---------------- */
  gsap.utils.toArray('.stat-num').forEach((el) => {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';
    const isYear = target > 1900 && target < 3000 && suffix === '';
    const render = (v) => {
      const n = Math.round(v);
      el.textContent = (isYear ? String(n) : n.toLocaleString('en-US')) + suffix;
    };
    if (reduceMotion) { render(target); return; }
    const counter = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => render(counter.v),
        }),
    });
  });

  /* ---------------- Parallax on media ---------------- */
  if (!reduceMotion) {
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    });
  }

  /* ---------------- Moments: continuous horizontal marquee ----------------
     Slides are cloned once and the track glides left forever at a steady
     medium speed. Looping by one full set (incl. trailing gap) is seamless.  */
  const track = document.getElementById('moments-track');
  if (track && !reduceMotion) {
    const originals = Array.from(track.children);
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 20;

    const buildMarquee = () => {
      let setWidth = 0;
      originals.forEach((n) => { setWidth += n.getBoundingClientRect().width + gap; });
      const SPEED = 55; // px per second — medium pace
      return gsap.to(track, {
        x: -setWidth,
        duration: setWidth / SPEED,
        ease: 'none',
        repeat: -1,
      });
    };

    // Clone the set so the loop point is off-screen and seamless.
    originals.forEach((n) => track.appendChild(n.cloneNode(true)));

    let marquee = buildMarquee();

    // Pause on hover for readability.
    track.addEventListener('mouseenter', () => marquee.pause());
    track.addEventListener('mouseleave', () => marquee.resume());

    // Recompute on resize (slide widths are viewport-relative).
    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        marquee.kill();
        gsap.set(track, { x: 0 });
        marquee = buildMarquee();
      }, 200);
    });
  }

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  ScrollTrigger.refresh();
});
