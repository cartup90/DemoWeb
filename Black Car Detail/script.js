// Black Car Detail - Premium Interactive Landing

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation
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

  // AOS Animations
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic'
    });
  }

  // Swiper - Gallery
  if (typeof Swiper !== 'undefined') {
    new Swiper('.gallery-swiper', {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.gallery-swiper .swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });

    // Swiper - Testimonials
    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      loop: true,
      autoplay: {
        delay: 4800,
      },
      pagination: {
        el: '.testimonial-swiper .swiper-pagination',
        clickable: true,
      }
    });
  }

  // Before/After Slider (Interactive)
  initBeforeAfterSlider();
});

function initBeforeAfterSlider() {
  const slider = document.getElementById('slider');
  const handle = document.getElementById('sliderHandle');
  const beforeImg = document.getElementById('beforeImg');

  if (!slider || !handle || !beforeImg) return;

  let isDragging = false;

  const updateSlider = (x) => {
    const rect = slider.getBoundingClientRect();
    let percent = ((x - rect.left) / rect.width) * 100;
    
    // Clamp between 0 and 100
    percent = Math.max(5, Math.min(95, percent));
    
    beforeImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    handle.style.left = `${percent}%`;
  };

  // Mouse events
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
  });

  // Touch events for mobile
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Click anywhere on the slider to jump
  slider.addEventListener('click', (e) => {
    updateSlider(e.clientX);
  });

  // Initial position (50%)
  setTimeout(() => {
    beforeImg.style.clipPath = 'inset(0 50% 0 0)';
    handle.style.left = '50%';
  }, 100);
}