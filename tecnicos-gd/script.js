/**
 * TÉCNICOS GD - LA EVOLUCIÓN DE LA CLIMATIZACIÓN
 * Lógica interactiva: Cotizador dinámico WhatsApp, acordeón FAQ, menú móvil.
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '5493585608356';

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

    // Cerrar al hacer clic en un link
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

  // 3. Cotizador / Estimador Dinámico de Presupuesto WhatsApp
  const serviceInputs = document.querySelectorAll('input[name="service"]');
  const propertySelect = document.getElementById('propType');
  const sizeSelect = document.getElementById('sizeRange');
  const urgencySelect = document.getElementById('urgencyLevel');
  const customNotes = document.getElementById('clientNotes');
  const previewBox = document.getElementById('whatsappPreviewText');
  const btnSendQuote = document.getElementById('btnSendQuote');

  function updateQuotePreview() {
    // Servicio seleccionado
    let selectedService = 'Calefacción Central';
    const checkedRadio = document.querySelector('input[name="service"]:checked');
    if (checkedRadio) {
      selectedService = checkedRadio.value;
    }

    const prop = propertySelect ? propertySelect.value : 'Casa / Vivienda';
    const size = sizeSelect ? sizeSelect.value : '3 a 4 ambientes';
    const urgency = urgencySelect ? urgencySelect.value : 'Estándar';
    const notes = customNotes && customNotes.value.trim() ? customNotes.value.trim() : 'Ninguna';

    const messageTemplate = 
`Hola Técnicos GD! 👋 Vi su web y quisiera solicitar un presupuesto:

❄️🔥 *Servicio:* ${selectedService}
🏠 *Tipo de Inmueble:* ${prop}
📐 *Dimensiones / Ambientes:* ${size}
⚡ *Prioridad:* ${urgency}
📝 *Detalles adicionales:* ${notes}

📍 Ubicación: Río Cuarto / Zona.
¿Podrían indicarme disponibilidad y costo estimado? ¡Gracias!`;

    if (previewBox) {
      previewBox.textContent = messageTemplate;
    }

    if (btnSendQuote) {
      const encodedMsg = encodeURIComponent(messageTemplate);
      btnSendQuote.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMsg}`;
    }
  }

  // Escuchar cambios en los inputs del cotizador
  serviceInputs.forEach(input => input.addEventListener('change', updateQuotePreview));
  propertySelect?.addEventListener('change', updateQuotePreview);
  sizeSelect?.addEventListener('change', updateQuotePreview);
  urgencySelect?.addEventListener('change', updateQuotePreview);
  customNotes?.addEventListener('input', updateQuotePreview);

  // Inicializar preview
  updateQuotePreview();

  // 4. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Cerrar otros
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      // Toggle actual
      if (!isCurrentlyActive) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
});
