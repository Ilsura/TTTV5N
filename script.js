// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar && navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
}

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const el = document.getElementById('tab-' + target);
    if (el) el.classList.add('active');
  });
});

// Modul Slider
const track = document.getElementById('modulTrack');
const btnL = document.getElementById('sliderLeft');
const btnR = document.getElementById('sliderRight');
if (track && btnL && btnR) {
  const STEP = 260;
  btnR.addEventListener('click', () => { track.scrollBy({ left: STEP, behavior: 'smooth' }); });
  btnL.addEventListener('click', () => { track.scrollBy({ left: -STEP, behavior: 'smooth' }); });
}

// Accordion
document.querySelectorAll('.prak-detail-header').forEach(h => {
  h.addEventListener('click', () => {
    // Setiap poin toggle independen — membuka satu poin tidak
    // menutup poin lain yang sedang terbuka.
    h.parentElement.classList.toggle('open');
  });
});

// Prak Tabs
document.querySelectorAll('.prak-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    const parent = tab.closest('.prak-detail-body');
    parent.querySelectorAll('.prak-tab').forEach(t => t.classList.remove('active'));
    parent.querySelectorAll('.prak-tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const content = parent.querySelector(`[data-content="${target}"]`);
    if (content) content.classList.add('active');
  });
});

// Dokumentasi Praktikum — auto slider (kanan ke kiri) + drag manual
(function initDokSlider() {
  const slider = document.getElementById('dokSlider');
  const track = document.getElementById('dokTrack');
  if (!slider || !track) return;

  const SPEED = 0.45;        // kecepatan auto-slide (px per frame)
  const RESUME_DELAY = 1800; // jeda sebelum auto-slide lanjut lagi (ms)

  let autoplay = true;
  let isPointerDown = false;
  let startX = 0;
  let startScroll = 0;
  let resumeTimer = null;

  function halfWidth() {
    return track.scrollWidth / 2; // set foto diduplikasi 2x untuk loop mulus
  }

  function loopCheck() {
    const half = halfWidth();
    if (half <= 0) return;
    if (slider.scrollLeft >= half) slider.scrollLeft -= half;
    else if (slider.scrollLeft < 0) slider.scrollLeft += half;
  }

  function pause() {
    autoplay = false;
    clearTimeout(resumeTimer);
  }
  function scheduleResume() {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { autoplay = true; }, RESUME_DELAY);
  }

  function tick() {
    if (autoplay && !isPointerDown) {
      slider.scrollLeft += SPEED;
      loopCheck();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Drag manual dengan mouse
  slider.addEventListener('mousedown', (e) => {
    isPointerDown = true;
    pause();
    startX = e.pageX;
    startScroll = slider.scrollLeft;
    slider.classList.add('dragging');
  });
  window.addEventListener('mousemove', (e) => {
    if (!isPointerDown) return;
    e.preventDefault();
    slider.scrollLeft = startScroll - (e.pageX - startX);
    loopCheck();
  });
  window.addEventListener('mouseup', () => {
    if (!isPointerDown) return;
    isPointerDown = false;
    slider.classList.remove('dragging');
    scheduleResume();
  });

  // Sentuhan (mobile) — biarkan scroll native, cukup jeda autoplay
  slider.addEventListener('touchstart', () => { pause(); }, { passive: true });
  slider.addEventListener('touchend', () => { scheduleResume(); }, { passive: true });
  slider.addEventListener('scroll', loopCheck, { passive: true });

  // Jeda saat kursor di atas slider, lanjut lagi saat kursor keluar
  slider.addEventListener('mouseenter', pause);
  slider.addEventListener('mouseleave', () => { if (!isPointerDown) scheduleResume(); });
})();

// Contact form (index)
function submitContact() {
  const n = document.getElementById('cname')?.value;
  const e = document.getElementById('cemail')?.value;
  const m = document.getElementById('cmsg')?.value;
  if (!n || !e || !m) { alert('Mohon lengkapi semua field'); return; }
  const el = document.getElementById('csSuccess');
  if (el) el.classList.add('show');
  ['cname','cemail','cmsg'].forEach(id => { const f = document.getElementById(id); if(f) f.value=''; });
}

// Contact form (contact page)
function submitForm() {
  const n = document.getElementById('name')?.value;
  const e = document.getElementById('email')?.value;
  const m = document.getElementById('message')?.value;
  if (!n || !e || !m) { alert('Mohon lengkapi semua field yang wajib diisi (*)'); return; }
  const el = document.getElementById('successMsg');
  if (el) el.classList.add('show');
  ['name','email','nim','topic','subject','message'].forEach(id => { const f = document.getElementById(id); if(f) f.value=''; });
}

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 70);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.modul-card, .kual-card, .dqg-card, .fas-card, .tim-c, .pop-card, .br-card, .vmv2, .ta-card, .alat-full-card, .jurnal-item, .cf-card, .prak-detail-item'
).forEach(el => { el.classList.add('reveal'); io.observe(el); });