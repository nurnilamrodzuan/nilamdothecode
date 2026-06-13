// ===== CUSTOM CURSOR =====
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
const cursorText = document.getElementById('cursor-text');

let mouse = { x: 0, y: 0 };
let ringPos = { x: 0, y: 0 };

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  dot.style.left = mouse.x + 'px';
  dot.style.top = mouse.y + 'px';
  cursorText.style.left = mouse.x + 'px';
  cursorText.style.top = mouse.y + 'px';
});

function animateRing() {
  ringPos.x += (mouse.x - ringPos.x) * 0.15;
  ringPos.y += (mouse.y - ringPos.y) * 0.15;
  ring.style.left = ringPos.x + 'px';
  ring.style.top = ringPos.y + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover detection on links & buttons
const hoverEls = document.querySelectorAll('a, button, .work-card, .stat-card, .btn-primary, .btn-outline');

hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => {
    document.body.classList.add('cursor-hover');
    const tag = el.tagName.toLowerCase();
    const isExternal = el.getAttribute('target') === '_blank';
    const isBtn = el.classList.contains('btn-primary') || el.classList.contains('btn-outline');
    const isWork = el.classList.contains('work-card');
    const isNav = el.classList.contains('nav-link') || el.classList.contains('nav-logo');
    const isToggle = el.classList.contains('theme-toggle') || el.classList.contains('hamburger');

    if (isWork) cursorText.textContent = 'OPEN';
    else if (isBtn) cursorText.textContent = 'GO';
    else if (isNav) cursorText.textContent = 'VIEW';
    else if (isToggle) cursorText.textContent = 'CLICK';
    else cursorText.textContent = 'VIEW';
  });

  el.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-hover');
  });
});

// ===== THEME TOGGLE =====
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const saved = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', saved);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
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
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.section, .stat-card, .work-card, .skill-group, .about-text, .about-stats');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('revealed');
  });
}, { threshold: 0.08 });

revealEls.forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});
