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
  /* On phones/small tablets, prefer smooth scrolling over heavy scroll-linked
     effects: lighter reveals, no parallax, native (not JS) slider. Matches the
     ≤900 CSS layout switches. */
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

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
      const isDark = root.getAttribute('data-theme') === 'dark';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    };
    syncButton();
    themeToggle.addEventListener('click', () => {
      const nowDark = root.getAttribute('data-theme') !== 'dark';
      if (nowDark) root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      try { localStorage.setItem('tensors-theme', nowDark ? 'dark' : 'light'); } catch (e) {}
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

  if (isMobile) {
    /* Lighter, and the title fades rather than sliding through a clip mask —
       so a wrapped headline on a small phone is never cut off. */
    heroTl
      .from('.hero-inner > *, .hero-media', { opacity: 0, y: 18, duration: 0.6, stagger: 0.09 })
      .from('.site-header', { opacity: 0, y: -16, duration: 0.6, clearProps: 'all' }, '<');
  } else {
    heroTl
      .from('[data-anim="eyebrow"]', { opacity: 0, y: 16, duration: 0.6 })
      .from('.hero-title .line', { yPercent: 110, duration: 0.9, stagger: 0.12 }, '-=0.3')
      .from('[data-anim="fade"]', { opacity: 0, y: 20, duration: 0.7, stagger: 0.12 }, '-=0.4')
      /* clearProps so the inline transform doesn't outrank the .is-hidden class later */
      .from('.site-header', { opacity: 0, y: -20, duration: 0.7, clearProps: 'all' }, '-=0.8');
  }

  /* ---------------- Launch animation ("Initializing" intro) ----------------
     A live count climbs 0→100 while a status label and a process word cycle;
     then the whole panel lifts its content and wipes up (expo) to reveal the
     hero underneath.                                                        */
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
    const barFill = document.getElementById('pre-bar-fill');
    const statusEl = document.getElementById('pre-status');
    const rotatorEl = document.getElementById('pre-rotator');
    const words = ['Strategy', 'Design', 'Engineering', 'Mentorship', 'Impact'];
    const statuses = ['Initializing', 'Compiling', 'Rendering', 'Almost ready'];
    const progress = { v: 0 };
    let wordIdx = -1;

    const swapWord = () => {
      /* quick roll-up swap of the process word */
      gsap.to(rotatorEl, {
        yPercent: -100,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          wordIdx = (wordIdx + 1) % words.length;
          rotatorEl.textContent = words[wordIdx];
          gsap.fromTo(rotatorEl, { yPercent: 100 }, { yPercent: 0, duration: 0.35, ease: 'power2.out' });
        },
      });
    };
    swapWord();
    const wordTimer = setInterval(swapWord, 620);

    const reveal = () => {
      clearInterval(wordTimer);
      releaseScroll();
      /* Foot + text clear, the mark swells and lifts, then the panel wipes up. */
      gsap.timeline({ onComplete: () => preloader.remove() })
        .to('.pre-foot', { opacity: 0, y: 16, duration: 0.4, ease: 'power2.in' })
        .to('.pre-wordmark, .pre-rotator', {
          opacity: 0, y: -14, duration: 0.4, ease: 'power2.in', stagger: 0.06,
        }, '<')
        .to('.pre-logo', { scale: 1.18, duration: 0.55, ease: 'power2.out' }, '<')
        .to('.pre-logo', { yPercent: -28, opacity: 0, duration: 0.45, ease: 'power2.in' }, '-=0.1')
        .to(preloader, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.5')
        .add(() => heroTl.play(), '-=0.6');
    };

    /* Build the T-mark up from its base, bring in the wordmark, then run the
       live 0→100 count over the progress rail. */
    gsap.timeline({ onComplete: reveal })
      .set('.pre-logo-img', { clipPath: 'inset(100% 0% 0% 0%)' })
      .from('.pre-logo', { scale: 0.7, opacity: 0, duration: 0.8, ease: 'expo.out' })
      .to('.pre-logo-img', { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'power3.out' }, '-=0.55')
      .from('.pre-wordmark', { yPercent: 80, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.35')
      .from('.pre-rotator, .pre-foot', { opacity: 0, y: 14, duration: 0.55, ease: 'power2.out', stagger: 0.08 }, '-=0.35')
      .to(progress, {
        v: 100,
        duration: 2.0,
        ease: 'power1.inOut',
        onUpdate: () => {
          const p = Math.round(progress.v);
          countEl.textContent = p;
          barFill.style.width = p + '%';
          const s = statuses[Math.min(statuses.length - 1, Math.floor(progress.v / (100 / statuses.length)))];
          if (statusEl.textContent !== s) statusEl.textContent = s;
        },
      }, '-=0.15')
      .to({}, { duration: 0.25 });   // brief hold at 100%
  }

  /* Subtle parallax on the hero glow as user scrolls past hero (desktop only) */
  if (!isMobile) {
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
  }

  /* ---------------- Scroll-linked parallax reveals (27n.gg-style) ----------------
     Opacity + motion are tied directly to scroll position (scrub), so content
     parallaxes into place as you scroll rather than snapping in once.
     data-reveal values: '' (drift up), 'left'/'right' (slide in), 'scale' (grow
     from its own centre — used for the Values cards).                          */
  const reveals = gsap.utils.toArray('[data-reveal]');
  if (reduceMotion) {
    gsap.set(reveals, { opacity: 1, x: 0, y: 0, scale: 1 });
  } else if (isMobile) {
    /* Mobile: a single lightweight fade-up per element (no scrub, no
       sideways/scale slides) — cheaper to run and keeps scrolling smooth. */
    reveals.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onComplete: () => gsap.set(el, { clearProps: 'transform' }),
        }
      );
    });
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

  /* ---------------- Collaborations: pinned scatter reveal ----------------
     The section PINS when it reaches the top of the viewport. While pinned,
     continued scrolling scrubs the pills outward from behind the title to
     their final positions; once they've all arrived the pin releases and the
     page scrolls on. Because it's scrub-linked: scrolling back up runs the
     pills back into the centre, and leaving above the section resets it — so
     scrolling down again replays the whole thing.
     On mobile the CSS lays the pills out as a static row, so skip this.     */
  const collabsCloud = document.getElementById('collabs-cloud');
  if (collabsCloud && !isMobile) {
    const stage = collabsCloud.closest('.collabs-stage');
    const pills = gsap.utils.toArray(collabsCloud.children);
    if (reduceMotion) {
      gsap.set(pills, { '--p': 1 });
    } else {
      gsap.set(pills, { '--p': 0 });
      gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',            // pin the moment the section fills the screen
          end: '+=110%',               // ~1 screen of scroll to complete the reveal
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      }).to(pills, { '--p': 1, ease: 'none', stagger: 0.06 });
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

  /* ---------------- Parallax on media (desktop only) ---------------- */
  if (!reduceMotion && !isMobile) {
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
  if (track && !reduceMotion && !isMobile) {
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
