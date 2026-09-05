const ICON_MUSIC = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3v11.2a3.5 3.5 0 1 1-2-3.16V7.9L10 9.6v7.6a3.5 3.5 0 1 1-2-3.16V5.4z"/></svg>';
const ICON_PAUSE = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
const ICON_HEART = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-6.5-4-9-8.5C1.3 8.2 3 5 6.2 5c1.9 0 3.2 1 4 2.3C11 6 12.3 5 14.2 5 17.4 5 19 8.2 21 11.5 18.5 16 12 20 12 20z"/></svg>';

document.body.style.overflow = 'hidden';

// La portada se mantiene enfocada en la fotografía y la información esencial.
// La segunda sección utiliza foto5 como imagen principal de la promesa de matrimonio.

const invitationSections = document.querySelectorAll('.page');
invitationSections.forEach((section) => section.setAttribute('aria-label', 'Sección de la invitación'));


function openEnvelope() {
  const cover = document.getElementById('coverEnvelope');
  if (cover.classList.contains('opened')) return;

  cover.classList.add('opened');

  const audio = document.getElementById('music');
  const musicBtn = document.getElementById('musicBtn');
  if (audio) {
    audio.play().then(() => {
      musicBtn.classList.add('playing');
      musicBtn.innerHTML = ICON_PAUSE;
    }).catch(() => {
      musicBtn.innerHTML = ICON_MUSIC;
    });
  }

  setTimeout(() => {
    cover.style.display = 'none';
    document.body.style.overflow = '';
  }, 1250);
}

document.getElementById('coverEnvelope').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openEnvelope();
  }
});

function toggleMusic() {
  const audio = document.getElementById('music');
  const musicBtn = document.getElementById('musicBtn');

  if (audio.paused) {
    audio.play().then(() => {
      musicBtn.innerHTML = ICON_PAUSE;
      musicBtn.classList.add('playing');
    }).catch(() => {
      showInlineToast('Por favor interactúa con la pantalla primero para activar la música.');
    });
  } else {
    audio.pause();
    musicBtn.innerHTML = ICON_MUSIC;
    musicBtn.classList.remove('playing');
  }
}

const urlParams = new URLSearchParams(window.location.search);
let cups = parseInt(urlParams.get('cupos') || '4', 10);

if (isNaN(cups) || cups < 1) cups = 1;
if (cups > 12) cups = 12;

const assignedEl = document.getElementById('assigned');
const qtySelect = document.getElementById('qty');

assignedEl.textContent = `TIENES ${cups} ${cups === 1 ? 'CUPO ASIGNADO' : 'CUPOS ASIGNADOS'}`;

for (let i = 1; i <= cups; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = i + (i === 1 ? ' persona' : ' personas');
  qtySelect.appendChild(option);
}

function saveSong() {
  const input = document.getElementById('songSuggestion');
  const msg = document.getElementById('songMsg');
  const value = input.value.trim();

  if (!value) {
    msg.textContent = 'Escribe el nombre de la canción antes de enviar.';
    msg.style.color = '#d9534f';
    return;
  }

  try {
    localStorage.setItem('sugerenciaCancion', value);
  } catch (e) {
    console.warn('LocalStorage no disponible');
  }

  msg.style.color = 'var(--gold)';
  msg.innerHTML = `¡Gracias! Tu sugerencia fue guardada correctamente. ${ICON_HEART}`;
}

function confirmRSVP() {
  const msg = document.getElementById('msg');
  const val = qtySelect.value;
  msg.style.color = 'var(--gold)';
  msg.innerHTML = `Confirmación registrada: <b>${val}</b> ${val === '1' ? 'persona' : 'personas'}. ¡Te esperamos! ${ICON_HEART}`;
}

const targetDate = new Date('2026-12-05T17:00:00-05:00').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const difference = Math.max(0, targetDate - now);

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  document.getElementById('c-days').textContent = String(days).padStart(2, '0');
  document.getElementById('c-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('c-mins').textContent = String(minutes).padStart(2, '0');
  document.getElementById('c-secs').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

function showInlineToast(text) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '85px';
  toast.style.right = '20px';
  toast.style.background = 'var(--ink)';
  toast.style.color = '#fff';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '10px';
  toast.style.fontSize = '13px';
  toast.style.zIndex = '3000';
  toast.style.boxShadow = 'var(--shadow-md)';
  toast.textContent = text;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.5s ease';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}