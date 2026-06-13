// ===== COLOR SWITCHER =====
const swatches = document.querySelectorAll('.swatch');
const html = document.documentElement;
const savedColor = localStorage.getItem('accentColor') || 'sand';
html.setAttribute('data-color', savedColor);
document.querySelector(`[data-color="${savedColor}"]`)?.classList.add('active');

swatches.forEach(s => {
  s.addEventListener('click', () => {
    const color = s.dataset.color;
    html.setAttribute('data-color', color);
    localStorage.setItem('accentColor', color);
    swatches.forEach(sw => sw.classList.remove('active'));
    s.classList.add('active');
  });
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
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navItems.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
});

// ===== HERO TEXT REVEAL =====
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal-text').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 200);
  });
});

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===== PARALLAX =====
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.22}px)`;
});

// ===== FOOTER YEAR =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();