// Viandas Como en Casa - Interactive Landing

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
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }));
  }

  // AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 750, once: true, offset: 60 });
  }

  // Swiper Testimonials
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      loop: true,
      autoplay: { delay: 4200 },
      pagination: { el: '.swiper-pagination', clickable: true }
    });
  }

  // Menu Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      menuItems.forEach(item => {
        if (filter === 'all') {
          item.classList.remove('hidden');
        } else {
          if (item.dataset.category === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        }
      });
    });
  });

  // Interactive Planner
  const planType = document.getElementById('planType');
  const people = document.getElementById('people');
  const mealType = document.getElementById('mealType');
  const totalPrice = document.getElementById('totalPrice');
  const planDetail = document.getElementById('planDetail');
  const sendPlanBtn = document.getElementById('sendPlan');

  function updatePlanner() {
    const days = parseInt(planType.value);
    const qty = parseInt(people.value);
    const type = mealType.value;

    let basePrice = 2650;

    if (type === 'vegetariana') basePrice = 2550;
    if (type === 'light') basePrice = 2790;
    if (type === 'mixto') basePrice = 2700;

    const total = days * qty * basePrice;
    totalPrice.textContent = '$' + total.toLocaleString('es-AR');

    const typeLabel = {
      'clasica': 'clásicas',
      'vegetariana': 'vegetarianas',
      'light': 'light',
      'mixto': 'mixtas'
    }[type] || 'clásicas';

    planDetail.textContent = `${days} viandas ${typeLabel} para ${qty} persona${qty > 1 ? 's' : ''}`;
  }

  [planType, people, mealType].forEach(el => {
    if (el) el.addEventListener('change', updatePlanner);
  });

  // Send to WhatsApp
  if (sendPlanBtn) {
    sendPlanBtn.addEventListener('click', () => {
      const days = planType.value;
      const qty = people.value;
      const type = mealType.options[mealType.selectedIndex].text;
      const price = totalPrice.textContent;

      const message = `Hola Viandas Como en Casa! Quiero el plan de ${days} días para ${qty} persona(s) de tipo ${type}. Precio aproximado: ${price}`;
      const url = `https://wa.me/5493584010083?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  }

  // Initial planner calculation
  updatePlanner();
});