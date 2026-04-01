(function () {
  'use strict';

  // ─── Page Loader ───
  const loader = document.getElementById('loader');
  document.body.style.overflow = 'hidden';
  setTimeout(function () {
    loader.classList.add('hide');
    setTimeout(function () { document.body.style.overflow = ''; }, 750);
  }, 2000);

  // ─── Navbar + Scroll Progress ───
  const navbar   = document.getElementById('navbar');
  const progress = document.getElementById('scroll-progress');

  window.addEventListener('scroll', function () {
    var scrollTop  = document.documentElement.scrollTop;
    var docHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    navbar.classList.toggle('scrolled', scrollTop > 50);
    if (progress) progress.style.width = (scrollTop / docHeight * 100).toFixed(2) + '%';
    updateActiveNav(scrollTop);
  }, { passive: true });

  // ─── Active Nav ───
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('section[id]');
  function updateActiveNav(scrollTop) {
    var current = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop - 120 <= scrollTop) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  // ─── Hamburger ───
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── Scroll Reveal ───
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  // ─── Custom Cursor (desktop only) ───
  if (window.matchMedia('(pointer: fine)').matches) {
    var dot  = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    if (dot && ring) {
      var mx = -300, my = -300, rx = -300, ry = -300;
      document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
      }, { passive: true });
      (function animRing() {
        rx += (mx - rx) * 0.13;
        ry += (my - ry) * 0.13;
        ring.style.left = rx.toFixed(2) + 'px';
        ring.style.top  = ry.toFixed(2) + 'px';
        requestAnimationFrame(animRing);
      })();
      document.querySelectorAll('a,button,.service-card,.gallery-item,.plan-card,.review-card,.timing-card,.contact-item').forEach(function (el) {
        el.addEventListener('mouseenter', function () { ring.classList.add('expanded'); });
        el.addEventListener('mouseleave', function () { ring.classList.remove('expanded'); });
      });
    }
  }

  // ─── Hero Mouse Parallax Orbs ───
  var orb1 = document.getElementById('heroOrb1');
  var orb2 = document.getElementById('heroOrb2');
  if (orb1 && orb2) {
    var ox1=0,oy1=0, ox2=0,oy2=0, tx1=0,ty1=0, tx2=0,ty2=0;
    document.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth  - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;
      tx1 = x * 32; ty1 = y * 22;
      tx2 = x * -24; ty2 = y * -16;
    }, { passive: true });
    (function animOrbs() {
      ox1 += (tx1-ox1)*0.05; oy1 += (ty1-oy1)*0.05;
      ox2 += (tx2-ox2)*0.05; oy2 += (ty2-oy2)*0.05;
      orb1.style.transform = 'translate('+ox1.toFixed(2)+'px,'+oy1.toFixed(2)+'px)';
      orb2.style.transform = 'translate('+ox2.toFixed(2)+'px,'+oy2.toFixed(2)+'px)';
      requestAnimationFrame(animOrbs);
    })();
  }

  // ─── Card Tilt ───
  function addTilt(selector, deg) {
    deg = deg || 5;
    document.querySelectorAll(selector).forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left)  / r.width  - 0.5;
        var y = (e.clientY - r.top)   / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateX('+(-y*deg).toFixed(2)+'deg) rotateY('+(x*deg).toFixed(2)+'deg) translateY(-10px)';
        card.style.transition = 'transform 0.1s linear, box-shadow 0.5s ease, border-color 0.4s ease';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.5s ease, border-color 0.4s ease';
        setTimeout(function () { card.style.transition = ''; }, 650);
      });
    });
  }
  addTilt('.service-card', 5);
  addTilt('.review-card',  4);
  addTilt('.timing-card',  4);

  // ─── Particle Canvas ───
  (function () {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w, h, particles;
    function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
    function createParticles() {
      particles = [];
      var count = Math.floor((w * h) / 16000);
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random()*w, y: Math.random()*h,
          r: Math.random()*1.5+0.2,
          dx: (Math.random()-0.5)*0.35, dy: (Math.random()-0.5)*0.35,
          alpha: Math.random()*0.5+0.05,
          color: Math.random()>0.75 ? '#E8FF00' : '#ffffff'
        });
      }
    }
    function draw() {
      ctx.clearRect(0,0,w,h);
      particles.forEach(function (p) {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill();
        p.x+=p.dx; p.y+=p.dy;
        if(p.x<0||p.x>w) p.dx*=-1;
        if(p.y<0||p.y>h) p.dy*=-1;
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', function () { resize(); createParticles(); }, { passive: true });
    resize(); createParticles(); draw();
  })();

  // ─── Stat Counter ───
  function animateCounter(el, target, suffix, dec) {
    var dur = 2200, t0 = performance.now();
    (function tick(now) {
      var p = Math.min((now-t0)/dur, 1);
      var e = 1-Math.pow(1-p,3);
      el.textContent = (e*target).toFixed(dec||0) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var items = entry.target.querySelectorAll('.stat-value');
        if (items[0]) animateCounter(items[0], 4.9, '★', 1);
        if (items[1]) animateCounter(items[1], 107, '+', 0);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  var statsEl = document.getElementById('stats');
  if (statsEl) statsObserver.observe(statsEl);

})();
