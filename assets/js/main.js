/* CHERRY BURGER — interactions */
(function () {
  'use strict';

  var docEl = document.documentElement;

  /* ---------- smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (window.Lenis && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  /* ---------- video preloader ---------- */
  var pre = document.getElementById('preloader');
  var started = false;

  function startSite() {
    if (started) return;
    started = true;
    if (pre) {
      pre.classList.add('done');
      setTimeout(function () { pre.remove(); }, 950);
    }
    document.body.classList.add('loaded');
    if (lenis) lenis.start();
    revealInView();
    setTimeout(revealInView, 450);
    setTimeout(revealInView, 1400);
  }

  if (pre) {
    if (lenis) lenis.stop();
    var vid = pre.querySelector('video');
    if (vid) {
      vid.muted = true;
      vid.playsInline = true;
      var p = vid.play();
      if (p && p.catch) p.catch(function () { setTimeout(startSite, 600); });
      vid.addEventListener('ended', startSite);
      /* fallbacks: video error or never starts */
      vid.addEventListener('error', function () { setTimeout(startSite, 400); });
      setTimeout(function () {
        if (!started && (vid.readyState < 2 || vid.paused)) startSite();
      }, 3500);
      /* absolute safety net */
      setTimeout(startSite, 8000);
    } else {
      startSite();
    }
  } else {
    document.body.classList.add('loaded');
  }

  /* ---------- custom cursor: flying ingredients ---------- */
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var cssLink = document.querySelector('link[href*="assets/css/style.css"]');
    var imgRoot = cssLink ? cssLink.getAttribute('href').replace('css/style.css', 'img/') : 'assets/img/';
    var ING = ['lettuce.webp', 'tomato.webp', 'cheese-logo.webp', 'meat.webp'];
    var trail = ING.map(function (src, i) {
      var im = document.createElement('img');
      im.className = 'cursor-ing';
      im.src = imgRoot + src;
      im.alt = '';
      document.body.appendChild(im);
      return {
        el: im,
        x: innerWidth / 2, y: innerHeight / 2,
        lag: 0.09 + i * 0.035,
        phase: i * Math.PI / 2,
        r: 30 + i * 7,
        sp: (i % 2 ? 0.0011 : -0.0014)
      };
    });
    var mx = -300, my = -300, cursorOn = false, boost = 1, boostT = 1;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!cursorOn) {
        cursorOn = true;
        document.body.classList.add('cursor-on');
        trail.forEach(function (t) { t.x = mx; t.y = my; });
      }
    }, { passive: true });
    document.addEventListener('mouseleave', function () {
      cursorOn = false;
      document.body.classList.remove('cursor-on');
    });
    document.addEventListener('mouseover', function (e) {
      boostT = e.target.closest('a,button,.menu-item,.card-b') ? 1.8 : 1;
    }, { passive: true });
    (function fly() {
      var now = performance.now();
      boost += (boostT - boost) * 0.1;
      trail.forEach(function (t) {
        var ang = now * t.sp + t.phase;
        var gx = mx + Math.cos(ang) * t.r * boost;
        var gy = my + Math.sin(ang) * t.r * 0.7 * boost;
        t.x += (gx - t.x) * t.lag;
        t.y += (gy - t.y) * t.lag;
        var w = t.el.offsetWidth || 32;
        t.el.style.transform = 'translate(' + (t.x - w / 2) + 'px,' + (t.y - w / 2) + 'px) rotate(' + (Math.sin(ang) * 16) + 'deg)';
      });
      requestAnimationFrame(fly);
    })();
  }

  /* ---------- nav dropdown ---------- */
  var mw = document.querySelector('.menu-wrap');
  if (mw) {
    var btn = mw.querySelector('.menu-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      mw.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!mw.contains(e.target)) mw.classList.remove('open');
    });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') mw.classList.remove('open'); });
  }

  /* ---------- page transition curtain ---------- */
  var curtain = document.getElementById('curtain');
  function isInternal(a) {
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|http)/i.test(href) && a.host !== location.host) return false;
    return true;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || !isInternal(a) || !curtain) return;
    var href = a.getAttribute('href');
    if (href.charAt(0) === '#') return;
    e.preventDefault();
    curtain.style.display = '';
    curtain.classList.remove('wipe-out');
    curtain.classList.add('wipe-in');
    setTimeout(function () { location.href = a.href; }, 580);
  });
  /* play curtain exit on load (after preloader on home, immediately elsewhere) */
  window.addEventListener('pageshow', function (e) {
    if (curtain && e.persisted) { curtain.classList.remove('wipe-in'); }
  });
  if (curtain && !pre) {
    curtain.style.transform = 'translateY(0)';
    setTimeout(function () {
      curtain.style.transform = '';
      curtain.classList.add('wipe-out');
      setTimeout(function () { curtain.classList.remove('wipe-out'); }, 620);
    }, 80);
    /* failsafe: never let the curtain linger */
    setTimeout(function () {
      curtain.classList.remove('wipe-in', 'wipe-out');
      curtain.style.transform = '';
      curtain.style.display = 'none';
    }, 1800);
  }

  /* ---------- anchor scrolling ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(t, { offset: 0 }); else t.scrollIntoView({ behavior: 'smooth' });
    if (mw) mw.classList.remove('open');
  });

  /* ---------- scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px' });

  function watch(el) { io.observe(el); }
  document.querySelectorAll('.reveal, .fade-up, .menu-cat').forEach(watch);

  /* menu items: per-item stagger inside each category */
  document.querySelectorAll('.menu-cat').forEach(function (cat) {
    var items = cat.querySelectorAll('.menu-item');
    items.forEach(function (it, i) {
      it.style.transitionDelay = (Math.min(i * 55, 550)) + 'ms';
      io.observe(it);
    });
  });

  function revealInView() {
    document.querySelectorAll('.reveal, .fade-up').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add('in');
    });
  }

  /* split reveal headings into word spans */
  document.querySelectorAll('.reveal[data-split]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) {
      return '<span class="wc"><span class="w">' + w + '</span></span>';
    }).join(' ');
  });
  /* re-observe after split */
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* stagger word delays */
  document.querySelectorAll('.reveal').forEach(function (el) {
    el.querySelectorAll('.w').forEach(function (w, i) {
      w.style.transitionDelay = (i * 70) + 'ms';
    });
  });

  /* ---------- cheesy parallax ---------- */
  var cheesy = document.querySelector('.cheesy img');
  if (cheesy) {
    var tick = false;
    function par() {
      tick = false;
      var wrap = cheesy.parentElement.getBoundingClientRect();
      var prog = (innerHeight - wrap.top) / (innerHeight + wrap.height);
      if (prog > 0 && prog < 1) {
        cheesy.style.transform = 'translateY(' + ((prog - 0.5) * 14) + '%)';
      }
    }
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; requestAnimationFrame(par); }
    }, { passive: true });
    par();
  }

  /* ---------- plane drift in take-away ---------- */
  var plane = document.querySelector('.away .plane');
  if (plane) {
    var tick2 = false;
    window.addEventListener('scroll', function () {
      if (tick2) return;
      tick2 = true;
      requestAnimationFrame(function () {
        tick2 = false;
        var sec = plane.closest('.away').getBoundingClientRect();
        var prog = Math.max(0, Math.min(1, (innerHeight - sec.top) / (innerHeight + sec.height)));
        plane.style.transform = 'translate(' + (prog * 70) + 'vw,' + (prog * 24) + 'vw) rotate(' + (prog * 10) + 'deg)';
      });
    }, { passive: true });
  }

  /* ---------- contact form (demo) ---------- */
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var b = form.querySelector('.btn-blob .lb');
      if (b) { b.textContent = 'SENT! WE\'LL BE IN TOUCH'; }
      form.reset();
    });
  }
})();
