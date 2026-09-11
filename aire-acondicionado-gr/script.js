/**
 * AIRE ACONDICIONADO GR
 * Simulador interactivo de presupuesto, cálculo de cañería y WhatsApp directo.
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '5493585170230';

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

  // 3. Simulador de Instalación
  const radiosJob = document.querySelectorAll('input[name="jobType"]');
  const selectPipe = document.getElementById('pipeDistance');
  const selectAccess = document.getElementById('accessType');
  const inputNotes = document.getElementById('simNotes');
  const previewBox = document.getElementById('simPreviewText');
  const btnSendSim = document.getElementById('btnSendSim');

  function updateSimulator() {
    let selectedJob = 'Instalación Básica Split';
    const checkedRadio = document.querySelector('input[name="jobType"]:checked');
    if (checkedRadio) selectedJob = checkedRadio.value;

    const pipe = selectPipe ? selectPipe.value : 'Hasta 3 metros (estándar)';
    const access = selectAccess ? selectAccess.value : 'Planta baja o balcón fácil';
    const notes = inputNotes && inputNotes.value.trim() ? inputNotes.value.trim() : 'Ninguna';

    const msg = 
`Hola Aire Acondicionado GR! 👋 Vi su web y quisiera consultar por un trabajo:

🔧 *Tipo de Trabajo:* ${selectedJob}
📏 *Distancia de cañería:* ${pipe}
🪜 *Acceso / Ubicación exterior:* ${access}
📝 *Aclaraciones:* ${notes}

📍 Ubicación: Río Cuarto / Zona.
¿Tienen disponibilidad esta semana y cuál sería el valor estimado con materiales? ¡Gracias!`;

    if (previewBox) previewBox.textContent = msg;
    if (btnSendSim) {
      btnSendSim.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    }
  }

  radiosJob.forEach(r => r.addEventListener('change', updateSimulator));
  selectPipe?.addEventListener('change', updateSimulator);
  selectAccess?.addEventListener('change', updateSimulator);
  inputNotes?.addEventListener('input', updateSimulator);

  updateSimulator();
});
