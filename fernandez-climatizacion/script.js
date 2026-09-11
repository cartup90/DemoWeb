/**
 * FERNÁNDEZ CLIMATIZACIÓN S.R.L.
 * Calculador interactivo de Frigorías, filtros de catálogo showroom y WhatsApp directo.
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '5493585096185';

  // 1. Menú Móvil
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isOpen = navLinks.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // 2. Header Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 3. Calculador Interactivo de Frigorías
  const inputWidth = document.getElementById('roomWidth');
  const inputLength = document.getElementById('roomLength');
  const selectSun = document.getElementById('sunExposure');
  const selectPeople = document.getElementById('peopleCount');

  const displayFrigorias = document.getElementById('displayFrigorias');
  const displayModel = document.getElementById('displayModel');
  const btnWhatsAppCalc = document.getElementById('btnWhatsAppCalc');

  function calculateFrigorias() {
    const width = parseFloat(inputWidth?.value) || 4;
    const length = parseFloat(inputLength?.value) || 4;
    const sunFactor = parseFloat(selectSun?.value) || 55; // frigorias por metro cúbico
    const extraPeople = parseInt(selectPeople?.value) || 0; // extra frigorías por personas

    const height = 2.6; // altura promedio en metros
    const volume = width * length * height;
    const area = Math.round(width * length);

    let rawFrigorias = Math.round(volume * sunFactor) + extraPeople;

    // Redondeo comercial a capacidad de aire estándar
    let commercialCapacity = 3000;
    let commercialWatts = 3500;
    let modelTag = 'Equipo Split Frío/Calor de 3000 Fg (Ideal dormitorio o living estándar)';

    if (rawFrigorias <= 2400) {
      commercialCapacity = 2250;
      commercialWatts = 2600;
      modelTag = 'Split 2250 Fg (Ambientes pequeños hasta 16 m²)';
    } else if (rawFrigorias <= 3300) {
      commercialCapacity = 3000;
      commercialWatts = 3500;
      modelTag = 'Split 3000 Fg (Ambientes medianos de 17 a 26 m²)';
    } else if (rawFrigorias <= 4800) {
      commercialCapacity = 4500;
      commercialWatts = 5200;
      modelTag = 'Split 4500 Fg / Inverter (Espacios amplios de 27 a 40 m²)';
    } else if (rawFrigorias <= 6500) {
      commercialCapacity = 6000;
      commercialWatts = 7000;
      modelTag = 'Split 6000 Fg (Livings grandes, locales o quinchos de 40 a 60 m²)';
    } else {
      commercialCapacity = Math.ceil(rawFrigorias / 1000) * 1000;
      commercialWatts = Math.round(commercialCapacity * 1.16);
      modelTag = `Equipo Comercial o Multi-Split (+${commercialCapacity} Fg para espacios de +60 m²)`;
    }

    if (displayFrigorias) {
      displayFrigorias.textContent = commercialCapacity.toLocaleString('es-AR');
    }

    if (displayModel) {
      displayModel.innerHTML = `<strong>Recomendación:</strong> ${modelTag}.<br><span style="font-size:0.85rem;color:#94a3b8;">Superficie calculada: ~${area} m² (${width}m x ${length}m)</span>`;
    }

    if (btnWhatsAppCalc) {
      const msg = 
`Hola Fernández Climatización SRL! 👋 Calculé los requerimientos en su web:

❄️ *Capacidad recomendada:* ${commercialCapacity} Frigorías (~${commercialWatts} W)
📐 *Dimensiones:* ${width}m x ${length}m (~${area} m²)
🏢 *Local Showroom:* Guardias Nacionales 2680, Río Cuarto

¿Tienen modelos disponibles en stock (convencional o inverter) y opciones de financiación? Gracias!`;

      btnWhatsAppCalc.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    }
  }

  [inputWidth, inputLength, selectSun, selectPeople].forEach(el => {
    el?.addEventListener('input', calculateFrigorias);
    el?.addEventListener('change', calculateFrigorias);
  });

  calculateFrigorias();

  // 4. Filtro del Catálogo Showroom
  const filterBtns = document.querySelectorAll('.catalog-filters .filter-btn');
  const productCards = document.querySelectorAll('.products-grid .product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      productCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
