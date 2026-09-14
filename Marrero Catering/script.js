// Marrero Catering - Dynamic Landing Script

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // Footer Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // AOS Initialization
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 80,
      easing: 'ease-out-cubic'
    });
  }

  // Swiper - Menu
  if (typeof Swiper !== 'undefined') {
    new Swiper('.menu-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3200,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.menu-swiper .swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });

    // Swiper - Testimonials
    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.testimonial-swiper .swiper-pagination',
        clickable: true,
      }
    });
  }

  // Parallax effect on hero background (subtle)
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.4;
      heroBg.style.transform = `translateY(${rate}px)`;
    });
  }

  // Simple counter animation for stats
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => {
    const target = stat.textContent;
    if (target.includes('+') || target.includes('.')) {
      // Don't animate mixed values
      return;
    }
    const final = parseInt(target);
    let current = 0;
    const increment = Math.ceil(final / 40);
    const timer = setInterval(() => {
      current += increment;
      if (current >= final) {
        stat.textContent = final;
        clearInterval(timer);
      } else {
        stat.textContent = current;
      }
    }, 50);
  });
});