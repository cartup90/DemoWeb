// Bucal Servicios Odontológicos - Landing Script
document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP = '5493584627003';

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });

    // Close nav when clicking a link (mobile)
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // Current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Highlight current day in any schedule lists
  highlightCurrentDay();

  // Active nav link on scroll
  setupActiveNav();

  // Subtle entrance animation for cards (reduced motion friendly)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animateOnScroll();
  }

  // Optional: make the fake chat look alive (demo only)
  enhanceFakeChat();
});

function highlightCurrentDay() {
  const today = new Date().getDay();
  // Look for any schedule lists that use data-day
  document.querySelectorAll('[data-day]').forEach(el => {
    const day = parseInt(el.getAttribute('data-day'), 10);
    if (day === today) {
      el.style.background = 'rgba(20, 184, 166, 0.12)';
      el.style.borderRadius = '6px';
      el.style.paddingLeft = '6px';
      el.style.paddingRight = '6px';
    }
  });
}

function setupActiveNav() {
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const sections = Array.from(navLinks).map(link => {
    const id = link.getAttribute('href').slice(1);
    return document.getElementById(id);
  }).filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.main-nav a[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -55% 0px', threshold: 0.2 });

  sections.forEach(sec => observer.observe(sec));
}

function animateOnScroll() {
  const cards = document.querySelectorAll(
    '.u-card, .implante-card, .step, .testimonial, .trust-item'
  );
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(14px)';
    card.style.transition = `all 0.5s cubic-bezier(0.23,1,0.32,1) ${i * 35}ms`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => io.observe(card));
}

function enhanceFakeChat() {
  const chat = document.querySelector('.fake-chat');
  if (!chat) return;

  // Click the chat to simulate a new message (fun touch)
  chat.addEventListener('click', () => {
    const body = chat.querySelector('.chat-body');
    if (!body) return;

    const msg = document.createElement('div');
    msg.className = 'msg received';
    msg.textContent = 'Perfecto. ¿Querés que te envíe disponibilidad para esta semana?';
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
      if (msg && msg.parentNode) msg.parentNode.removeChild(msg);
    }, 5200);
  });
}
