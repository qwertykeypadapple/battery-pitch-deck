const sections = [...document.querySelectorAll('.s')];
const deck = document.querySelector('.deck');
const nav = document.querySelector('.dots');
const current = () => Math.max(0, Math.min(sections.length - 1, Math.round(deck.scrollLeft / deck.clientWidth)));
const go = (i) => {
  const target = Math.max(0, Math.min(i, sections.length - 1));
  deck.scrollTo({ left: target * deck.clientWidth, behavior: 'smooth' });
};
const dots = sections.map((s, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Slide ' + (i + 1));
  b.onclick = () => go(i);
  nav.appendChild(b);
  return b;
});
document.querySelector('.nav-btn.prev').onclick = () => go(current() - 1);
document.querySelector('.nav-btn.next').onclick = () => go(current() + 1);

function countUp(el) {
  const target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10);
  const start = performance.now(), dur = 1800;
  const step = (now) => {
    const t = Math.min((now - start) / dur, 1);
    el.textContent = (target * (1 - Math.pow(1 - t, 3))).toFixed(dec);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('on');
    const i = sections.indexOf(e.target);
    dots.forEach((d, j) => d.classList.toggle('active', j === i));
    e.target.querySelectorAll('[data-count]').forEach(el => { if (!el.dataset.done) { el.dataset.done = '1'; countUp(el); } });
  });
}, { root: deck, threshold: 0.5 });
sections.forEach(s => io.observe(s));

document.addEventListener('keydown', e => {
  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(current() + 1); }
  if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(current() - 1); }
  if (e.key === 'Home') { e.preventDefault(); go(0); }
  if (e.key === 'End') { e.preventDefault(); go(sections.length - 1); }
});
