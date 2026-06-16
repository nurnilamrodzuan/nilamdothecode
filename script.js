// ===== PAGE LOADER =====
(function () {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const start = Date.now();
  const minVisible = 2800; // satu kitaran penuh animasi = 2.5s, jadi tunggu ~2.8s supaya nampak 4 flip habis

  function hideLoader() {
    const elapsed = Date.now() - start;
    const wait = Math.max(0, minVisible - elapsed);
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, wait);
  }

  document.body.style.overflow = 'hidden'; // kunci scroll masa loading
  window.addEventListener('load', hideLoader);
  // fallback: kalau 'load' tak cetus dalam 6s, sorok juga supaya tak tersangkut
  setTimeout(hideLoader, 6000);
})();

// ===== THEME TOGGLE (light / dark) =====
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function getSavedTheme() {
  try {
    return localStorage.getItem('theme');
  } catch (e) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    // localStorage blocked (e.g. some browsers on file://) — ignore, theme still applies for this session
  }
}

const savedTheme = getSavedTheme() || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  saveTheme(next);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) {
      current = s.id;
    }
  });

  navItems.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
  });
});

// ===== HERO TEXT REVEAL =====
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal-text').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 200);
  });
});

// ===== SCROLL REVEAL (semua jenis animasi) =====
(function () {
  // Pecahkan heading bertanda .reveal-letters jadi <span> huruf (kekalkan <br>)
  document.querySelectorAll('.reveal-letters').forEach(el => {
    const nodes = Array.from(el.childNodes);
    el.textContent = '';
    let i = 0;
    nodes.forEach(node => {
      if (node.nodeName === 'BR') {
        el.appendChild(document.createElement('br'));
        return;
      }
      const text = node.textContent;
      text.split('').forEach(ch => {
        const span = document.createElement('span');
        span.className = 'ltr';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.transitionDelay = (i * 0.035) + 's';
        el.appendChild(span);
        i++;
      });
    });
  });

  // Perhatikan semua elemen beranimasi
  const selector = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-letters, .reveal-line';
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target); // sekali je, kekal lepas tu
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(selector).forEach(el => revealObs.observe(el));
})();

// ===== LAYERED TITLE — 3D goyang ikut tetikus =====
(function () {
  const wrap = document.getElementById('layered-title');
  if (!wrap) return;
  const copies = wrap.getElementsByClassName('lt-copy');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return; // hormati setting kurangkan gerakan

  const center = { x: 0, y: 0 };
  const dist = { x: 0, y: 0 };
  const lerp = { x: 0, y: 0 };
  let simulate = true;
  const tz = -12, rot = 3, skew = 3;

  function updateCenter() {
    const r = wrap.getBoundingClientRect();
    center.x = r.left + r.width / 2;
    center.y = r.top + r.height / 2;
  }

  document.addEventListener('mousemove', (e) => {
    simulate = false;
    dist.x = center.x - e.clientX;
    dist.y = center.y - e.clientY;
  });

  function tick(t) {
    if (simulate) {
      dist.x = Math.sin(t / 500) * window.innerWidth * 0.5;
      dist.y = Math.cos(t / 500) * window.innerWidth * 0.2;
    }
    lerp.x += (dist.x - lerp.x) * 0.2;
    lerp.y += (dist.y - lerp.y) * 0.2;
    for (let i = 1; i <= copies.length; i++) {
      const c = copies[i - 1];
      const y = i * lerp.y * 0.03;
      const z = i * tz;
      const r = i * rot * (lerp.x * 0.003);
      const s = i * skew * (lerp.x * 0.003);
      c.style.transform = `perspective(500px) translate3d(0px, ${y}px, ${z}px) rotate(${r}deg) skew(${s}deg)`;
    }
    requestAnimationFrame(tick);
  }

  updateCenter();
  window.addEventListener('resize', updateCenter);
  requestAnimationFrame(tick);
})();

// ===== FOOTER YEAR =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();