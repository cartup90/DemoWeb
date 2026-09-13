/**
 * ODONTÓLOGO DR. ALEJANDRO AGUIRRE · Río Cuarto
 * Menú móvil, estado de atención en vivo, generador de turnos por WhatsApp
 * y animaciones de aparición.
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '5493586549736';

  /* ======================================================================
     HORARIOS OFICIALES DEL CONSULTORIO
     (índice 0 = Domingo, igual que Date.getDay())
     ====================================================================== */
  const SCHEDULE = {
    0: { label: 'Domingo',   open: '18:30', close: '19:30' },
    1: { label: 'Lunes',     open: '09:30', close: '20:30' },
    2: { label: 'Martes',    open: '09:30', close: '15:30' },
    3: { label: 'Miércoles', open: '09:30', close: '15:00' },
    4: { label: 'Jueves',    open: '17:30', close: '20:30' },
    5: { label: 'Viernes',   open: '09:30', close: '21:00' },
    6: { label: 'Sábado',    open: '15:00', close: '20:30' }
  };

  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  /** Fecha/hora actual en horario de Argentina (UTC-3) */
  function ahoraEnArgentina() {
    try {
      const fmt = new Intl.DateTimeFormat('es-AR', {
        timeZone: 'America/Argentina/Cordoba',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const parts = fmt.formatToParts(new Date());
      const map = {};
      parts.forEach(p => { map[p.type] = p.value; });
      const dias = { dom: 0, lun: 1, mar: 2, mié: 3, mie: 3, jue: 4, vie: 5, sáb: 6, sab: 6 };
      const key = (map.weekday || '').toLowerCase().replace('.', '').slice(0, 3);
      return {
        day: dias[key] !== undefined ? dias[key] : new Date().getDay(),
        minutes: Number(map.hour) * 60 + Number(map.minute)
      };
    } catch (e) {
      const now = new Date();
      return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes() };
    }
  }

  /* ======================================================================
     1. MENÚ MÓVIL
     ====================================================================== */
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
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  /* ======================================================================
     2. HEADER CON SCROLL
     ====================================================================== */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ======================================================================
     3. ESTADO "ABIERTO / CERRADO" + DÍA ACTUAL DESTACADO
     ====================================================================== */
  function proximoDiaConAtencion(desdeDay) {
    for (let i = 1; i <= 7; i++) {
      const d = (desdeDay + i) % 7;
      if (SCHEDULE[d]) {
        const nombre = i === 1 ? 'mañana' : SCHEDULE[d].label.toLowerCase();
        return { nombre, open: SCHEDULE[d].open };
      }
    }
    return null;
  }

  function pintarEstado() {
    const { day, minutes } = ahoraEnArgentina();
    const hoy = SCHEDULE[day];
    const abierto = hoy && minutes >= toMinutes(hoy.open) && minutes < toMinutes(hoy.close);

    const statusEl = document.getElementById('openStatus');
    const dot = document.querySelector('.pulse-dot');

    if (statusEl) {
      if (abierto) {
        statusEl.textContent = `Abierto ahora · ${hoy.label} hasta las ${hoy.close} hs`;
      } else if (hoy && minutes < toMinutes(hoy.open)) {
        statusEl.textContent = `Cerrado ahora · Hoy abrimos a las ${hoy.open} hs`;
      } else {
        const next = proximoDiaConAtencion(day);
        statusEl.textContent = next
          ? `Cerrado ahora · Atendemos ${next.nombre} desde las ${next.open} hs`
          : 'Cerrado ahora · Consultas por WhatsApp';
      }
    }

    if (dot) dot.classList.toggle('is-closed', !abierto);

    // Resaltar el día de hoy en la tarjeta del hero
    document.querySelectorAll('#scheduleList li').forEach(li => {
      li.classList.toggle('today', Number(li.dataset.day) === day);
    });

    // Resaltar el día de hoy en la lista de horarios de la sección ubicación
    document.querySelectorAll('.location-hours li').forEach((li, index) => {
      const dayIndex = (index + 1) % 7; // Lun..Dom → 1,2,3,4,5,6,0
      li.classList.toggle('today', dayIndex === day);
    });
  }

  pintarEstado();
  setInterval(pintarEstado, 60000);

  /* ======================================================================
     4. GENERADOR DE TURNO → WHATSAPP
     ====================================================================== */
  const radiosMotivo = document.querySelectorAll('input[name="motivo"]');
  const selectUrgencia = document.getElementById('urgenciaLevel');
  const selectFranja = document.getElementById('franja');
  const inputName = document.getElementById('patientName');
  const inputPhone = document.getElementById('patientPhone');
  const inputNotes = document.getElementById('simNotes');
  const previewBox = document.getElementById('simPreviewText');
  const btnSend = document.getElementById('btnSendBooking');

  function construirMensaje() {
    const checked = document.querySelector('input[name="motivo"]:checked');
    const motivo = checked ? checked.value : 'Consulta general / Otro motivo';
    const urgencia = selectUrgencia ? selectUrgencia.value : 'Consulta programada, sin dolor';
    const franja = selectFranja ? selectFranja.value : 'Me adapto a la disponibilidad del consultorio';
    const nombre = inputName && inputName.value.trim() ? inputName.value.trim() : '(sin especificar)';
    const telefono = inputPhone && inputPhone.value.trim() ? inputPhone.value.trim() : '(sin especificar)';
    const notas = inputNotes && inputNotes.value.trim() ? inputNotes.value.trim() : 'Sin detalles adicionales';
    const esUrgencia = motivo.toLowerCase().includes('urgencia');

    return `${esUrgencia ? '🚨 SOLICITUD DE URGENCIA ODONTOLÓGICA' : '🦷 SOLICITUD DE TURNO'} — Dr. Alejandro Aguirre

👤 *Paciente:* ${nombre}
📞 *Teléfono:* ${telefono}
🩺 *Motivo:* ${motivo}
⏱️ *Urgencia:* ${urgencia}
🗓️ *Franja preferida:* ${franja}
📝 *Detalles:* ${notas}

📍 Consultorio: Buenos Aires 1212, Río Cuarto.
¿Me confirman día y horario disponible? ¡Gracias!`;
  }

  function actualizarTurno() {
    const msg = construirMensaje();
    if (previewBox) previewBox.textContent = msg;
    if (btnSend) btnSend.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  }

  radiosMotivo.forEach(r => r.addEventListener('change', actualizarTurno));
  [selectUrgencia, selectFranja, inputName, inputPhone, inputNotes].forEach(el => {
    if (el) {
      el.addEventListener('input', actualizarTurno);
      el.addEventListener('change', actualizarTurno);
    }
  });

  actualizarTurno();

  /* ======================================================================
     5. ANIMACIONES DE APARICIÓN AL SCROLL
     ====================================================================== */
  const selectores = [
    '.section-header',
    '.trust-item',
    '.urgent-card',
    '.service-card',
    '.step-card',
    '.benefit-item',
    '.implants-cta',
    '.booking-box',
    '.review-card',
    '.faq-item',
    '.location-card',
    '.map-wrapper',
    '.google-hero-badge'
  ];

  const elementos = document.querySelectorAll(selectores.join(','));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    elementos.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elementos.forEach(el => observer.observe(el));
  }

  /* ======================================================================
     6. DETALLES FINALES
     ====================================================================== */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
