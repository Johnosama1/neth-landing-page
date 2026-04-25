// ──────────────────────────────────────────
//  PARTICLE BACKGROUND
// ──────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.r = Math.random() * 1.5 + 0.5;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function spawnParticles(n) {
    particles = [];
    for (let i = 0; i < n; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fill();
    });

    const MAX_DIST = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,155,246,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    spawnParticles(Math.min(90, Math.floor((W * H) / 12000)));
    cancelAnimationFrame(animId);
    draw();
  }

  window.addEventListener('resize', () => { resize(); spawnParticles(Math.min(90, Math.floor((W * H) / 12000))); });
  start();
})();


// ──────────────────────────────────────────
//  STICKY NAV
// ──────────────────────────────────────────
(function initNav() {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }, { passive: true });
})();


// ──────────────────────────────────────────
//  SCROLL REVEAL
// ──────────────────────────────────────────
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
})();


// ──────────────────────────────────────────
//  ANIMATED COUNTER
// ──────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const dec = el.dataset.dec || 0;
      const duration = 1800;
      const start = performance.now();

      function tick(now) {
        const elapsed = Math.min(now - start, duration);
        const progress = elapsed / duration;
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = target * eased;
        el.textContent = val.toFixed(dec);
        if (elapsed < duration) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(dec);
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


// ──────────────────────────────────────────
//  TERMINAL TEXT – generate fake log lines
// ──────────────────────────────────────────
(function initTerminals() {
  const terminals = document.querySelectorAll('.project-terminal');
  terminals.forEach(term => {
    const lines = [];
    for (let i = 0; i < 25; i++) {
      const ts = new Date(Date.now() - Math.random() * 3600000).toISOString();
      const hex = Math.random().toString(16).slice(2, 10).toUpperCase();
      const ops = ['INFO', 'DEBUG', 'TRACE'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      const msgs = [
        `executing sequence 0x${hex}... OK`,
        `tick processed: latency=3ms`,
        `order_id=${hex.slice(0,6)} filled MARKET`,
        `heartbeat OK [node-${Math.floor(Math.random()*9)+1}]`,
        `stream buffer flush — 512 events`,
        `auth token refreshed`,
        `db write committed: 0x${hex.slice(0,6)}`,
      ];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      lines.push(`[${ts}] ${op}: ${msg}`);
    }
    term.textContent = lines.join('\n');
  });
})();


// ──────────────────────────────────────────
//  SMOOTH SCROLL on anchor links
// ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Scroll indicator
const scrollBtn = document.getElementById('scroll-down');
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  });
}
