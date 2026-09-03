const sections = document.querySelectorAll('.section');
sections.forEach((section, index) => {
    section.classList.add('reveal');
    section.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`);
});

const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }) : null;
sections.forEach((section) => revealObserver?.observe(section));
if (!revealObserver) sections.forEach((section) => section.classList.add('in-view'));

const overlay = document.querySelector('#sobre-overlay');
const content = document.querySelector('#site');
const music = document.querySelector('#music');
const musicBtn = document.querySelector('#musicToggle');
const sealImage = document.querySelector('.env-sello img');
sealImage?.addEventListener('error', () => {
    sealImage.remove();
    const fallback = document.createElement('span');
    fallback.textContent = 'I & A';
    document.querySelector('.env-sello')?.appendChild(fallback);
});

document.body.style.overflow = 'hidden';
function openInvitation() {
    if (!overlay || overlay.classList.contains('abierto')) return;
    overlay.classList.add('abierto');
    setTimeout(() => content?.classList.add('revelado'), 450);
    setTimeout(() => { overlay.remove(); document.body.style.overflow = ''; }, 1750);
    music?.play().then(() => musicBtn?.classList.add('playing')).catch(() => { });
}
overlay?.addEventListener('click', openInvitation);
overlay?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openInvitation(); }
});

const target = new Date('2026-12-05T17:00:00-05:00');
function tick() {
    const diff = Math.max(0, target.getTime() - Date.now());
    const vals = [Math.floor(diff / 864e5), Math.floor(diff / 36e5) % 24, Math.floor(diff / 6e4) % 60, Math.floor(diff / 1e3) % 60];
    ['days', 'hours', 'minutes', 'seconds'].forEach((unit, index) => {
        const element = document.querySelector(`[data-unit="${unit}"]`);
        if (element) element.textContent = String(vals[index]).padStart(2, '0');
    });
}
tick();
setInterval(tick, 1000);

document.querySelectorAll('.guests button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.guests button').forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    const status = document.querySelector('#rsvpStatus');
    if (status) status.textContent = `Has seleccionado ${button.dataset.guests} ${button.dataset.guests === '1' ? 'persona' : 'personas'}.`;
}));
document.querySelector('#confirmButton')?.addEventListener('click', () => {
    const selected = document.querySelector('.guests .selected');
    const status = document.querySelector('#rsvpStatus');
    if (status) status.textContent = selected ? `¡Gracias! Tu confirmación de ${selected.dataset.guests} ${selected.dataset.guests === '1' ? 'persona' : 'personas'} ha sido registrada.` : 'Selecciona primero el número de personas.';
});
document.querySelector('#songForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = document.querySelector('#songStatus');
    if (status) status.textContent = 'Gracias por ayudarnos a elegir la música de nuestra celebración.';
    event.target.reset();
});
document.querySelector('#shareButton')?.addEventListener('click', async () => {
    const text = '#BodaIsabellaYAdolfo';
    try { await navigator.clipboard.writeText(text); document.querySelector('#shareButton').textContent = 'Hashtag copiado'; }
    catch { window.prompt('Copia nuestro hashtag:', text); }
});
musicBtn?.addEventListener('click', () => {
    if (!music) return;
    if (music.paused) music.play().then(() => musicBtn.classList.add('playing')).catch(() => { });
    else { music.pause(); musicBtn.classList.remove('playing'); }
});
