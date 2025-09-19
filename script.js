/* 
  script.js - All-in-one features:
  - TIMELINE, GALLERY data (edit here)
  - Welcome card + typing + play music
  - Hearts animation (burst + falling)
  - AOS init (scroll animations)
  - Swiper init (gallery slider)
  - Lightbox image & video
  - Days together + countdown
  - Mini-game hearts
  - Dark mode toggle
*/

/* ----------------- DỮ LIỆU: chỉnh ở đây ----------------- */
const START_DATE = '2022-02-14'; // ngày bắt đầu yêu nhau (YYYY-MM-DD)
const NEXT_EVENT = { label: 'Kỷ niệm tiếp theo', date: '2025-12-31' }; // ví dụ đếm ngược đến ngày này (hoặc null)

const TIMELINE = [
  { id: 't1', date: '2021-06-15', title: 'Lần gặp đầu tiên', text: 'Lần đầu gặp nhau ở quán cà phê nhỏ… Anh nhớ em đã cười như thế nào.', img: 'images/img1.jpg' },
  { id: 't2', date: '2022-02-14', title: 'Ngày chính thức', text: 'Ngày chúng ta bắt đầu chính thức, tim anh loạn nhịp.', img: 'images/img2.jpg' },
  { id: 't3', date: '2023-08-10', title: 'Chuyến đi đầu tiên', text: 'Cùng nhau đi biển, chụp ảnh và ăn kem dưới nắng.', img: 'images/img3.jpg' }
];

const GALLERY = [
  { src: 'images/img1.jpg', alt: 'Kỷ niệm 1' },
  { src: 'images/img2.jpg', alt: 'Kỷ niệm 2' },
  { src: 'images/img3.jpg', alt: 'Kỷ niệm 3' }
];

const MINI_MESSAGES = [
  "Anh yêu em rất nhiều ❤️",
  "Cảm ơn em vì đã ở bên anh.",
  "Mỗi ngày cùng em là một món quà.",
  "Em là người khiến anh mỉm cười.",
  "Chúng ta sẽ còn nhiều kỷ niệm nữa."
];
/* ----------------- HẾT phần chỉnh dữ liệu ----------------- */

/* Utility short-hands */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ---------- Welcome + typing + music ---------- */
const welcomeEl = $('#welcome');
const openCardBtn = $('#open-card');
const openPlayBtn = $('#open-play');
const audio = $('#bg-music');
const playToggle = $('#play-toggle');
const darkToggle = $('#dark-toggle');

function typeHero() {
  const el = $('#hero-title');
  const txt = el.textContent;
  el.textContent = '';
  let i = 0;
  const t = setInterval(() => {
    el.textContent += txt[i++] || '';
    if (i > txt.length) clearInterval(t);
  }, 50);
}

openCardBtn.addEventListener('click', () => {
  welcomeEl.classList.add('hidden');
  burstHearts(window.innerWidth / 2, window.innerHeight / 3);
  setTimeout(() => typeHero(), 250);
  tryPlayAudio();
});

openPlayBtn.addEventListener('click', () => {
  tryPlayAudio(true);
});

function tryPlayAudio(userInitiated = false) {
  if (!audio) return;
  const p = audio.play();
  if (p && p.then) {
    p.then(() => {
      updatePlayButton(true);
    }).catch(() => {
      // autoplay blocked; if user clicked openPlay, then we tried because it's user-initiated
      if (userInitiated) updatePlayButton(!audio.paused);
      else updatePlayButton(audio && !audio.paused);
    });
  } else {
    updatePlayButton(!audio.paused);
  }
}
function updatePlayButton(isPlaying) {
  playToggle.textContent = isPlaying ? '🔈' : '🔇';
}

/* top play toggle */
playToggle.addEventListener('click', () => {
  if (!audio) return;
  if (audio.paused) audio.play().catch(()=>{});
  else audio.pause();
  updatePlayButton(!audio.paused);
});

/* dark mode */
function applyDark(pref) {
  if (pref) document.body.classList.add('dark');
  else document.body.classList.remove('dark');
  localStorage.setItem('dark', pref ? '1' : '0');
}
darkToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('dark', isDark ? '1' : '0');
});
const storedDark = localStorage.getItem('dark');
if (storedDark === '1') applyDark(true);

/* ---------- Hearts animation (canvas) ---------- */
const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');
let hearts = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Heart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = - (Math.random() * 2 + 1.2);
    this.size = Math.random() * 14 + 8;
    this.alpha = 1;
    this.spin = (Math.random() - 0.5) * 0.06;
    this.angle = 0;
    this.color = `rgba(255,${120 + Math.floor(Math.random() * 100)},${140 + Math.floor(Math.random() * 100)},1)`;
  }
  update() {
    this.vy += 0.03;
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.spin;
    this.alpha -= 0.01;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = Math.max(this.alpha, 0);
    ctx.beginPath();
    const s = this.size;
    ctx.moveTo(0, s / 4);
    ctx.bezierCurveTo(s / 2, -s / 2, s * 1.2, s / 3, 0, s);
    ctx.bezierCurveTo(-s * 1.2, s / 3, -s / 2, -s / 2, 0, s / 4);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

function burstHearts(x = window.innerWidth / 2, y = window.innerHeight / 2) {
  for (let i = 0; i < 20; i++) {
    hearts.push(new Heart(x + (Math.random() - 0.5) * 80, y + (Math.random() - 0.5) * 40));
  }
}
function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach(h => {
    h.update();
    h.draw();
  });
  hearts = hearts.filter(h => h.alpha > 0);
  requestAnimationFrame(animateHearts);
}
animateHearts();

/* ---------- Render timeline & gallery & lightbox ---------- */
function renderTimeline() {
  const wrap = $('#timeline');
  wrap.innerHTML = '';
  TIMELINE.forEach((it, idx) => {
    const item = document.createElement('article');
    item.className = 'timeline-item';
    item.setAttribute('data-aos', 'fade-right');
    item.innerHTML = `
      <div class="timeline-badge">${idx + 1}</div>
      <img src="${it.img}" alt="${it.title}" loading="lazy">
      <div class="meta">
        <h3>${it.title}</h3>
        <time>${it.date}</time>
        <p>${it.text}</p>
        <div style="margin-top:8px">
          <button class="primary view-img">Xem ảnh</button>
          <button class="secondary surprise">Bấm bất ngờ</button>
        </div>
      </div>
    `;
    wrap.appendChild(item);

    item.querySelector('.view-img').addEventListener('click', () => openLightboxFromURL(it.img));
    item.querySelector('.surprise').addEventListener('click', () => {
      const r = item.getBoundingClientRect();
      burstHearts(r.left + r.width / 2, r.top + 40);
    });
  });
}

function renderGallery() {
  const wrap = $('#gallery');
  wrap.innerHTML = '';
  GALLERY.forEach((g, idx) => {
    const img = document.createElement('img');
    img.src = g.src;
    img.alt = g.alt || '';
    img.loading = 'lazy';
    img.addEventListener('click', () => openLightboxFromIndex(idx));
    wrap.appendChild(img);
  });
}

/* Lightbox */
const LB = $('#lightbox');
const LB_IMG = LB.querySelector('.lb-img');
let currentIndex = -1;
LB.querySelector('.lb-close').addEventListener('click', closeLightbox);
LB.querySelector('.lb-prev').addEventListener('click', () => openLightboxFromIndex((currentIndex - 1 + GALLERY.length) % GALLERY.length));
LB.querySelector('.lb-next').addEventListener('click', () => openLightboxFromIndex((currentIndex + 1) % GALLERY.length));

function openLightboxFromIndex(i) {
  if (!GALLERY[i]) return;
  currentIndex = i;
  LB_IMG.src = GALLERY[i].src;
  LB_IMG.alt = GALLERY[i].alt || '';
  LB.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function openLightboxFromURL(url) {
  LB_IMG.src = url;
  LB_IMG.alt = '';
  LB.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  LB.setAttribute('aria-hidden', 'true');
  LB_IMG.src = '';
  currentIndex = -1;
  document.body.style.overflow = '';
}
document.addEventListener('keydown', (e) => {
  if (LB.getAttribute('aria-hidden') === 'false') {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightboxFromIndex((currentIndex - 1 + GALLERY.length) % GALLERY.length);
    if (e.key === 'ArrowRight') openLightboxFromIndex((currentIndex + 1) % GALLERY.length);
  }
});

/* Video modal */
const videoModal = $('#video-modal');
const messageVideo = $('#message-video');
$('#open-video').addEventListener('click', () => {
  videoModal.setAttribute('aria-hidden', 'false');
  messageVideo.currentTime = 0;
  messageVideo.play().catch(()=>{});
});
videoModal.querySelector('.lb-close').addEventListener('click', () => {
  videoModal.setAttribute('aria-hidden', 'true');
  messageVideo.pause();
});

/* ---------- Swiper (carousel) ---------- */
let mySwiper;
function initSwiper() {
  const wrapper = $('#swiper-wrapper');
  wrapper.innerHTML = '';
  GALLERY.forEach(g => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `<img src="${g.src}" alt="${g.alt || ''}">`;
    wrapper.appendChild(slide);
  });

  if (mySwiper) mySwiper.destroy(true, true);
  mySwiper = new Swiper('.mySwiper', {
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 1.1,
    spaceBetween: 16,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      700: { slidesPerView: 2.0 }
    }
  });

  // clicking a slide opens lightbox
  $$('.swiper .swiper-slide img').forEach((imgEl, i) => {
    imgEl.addEventListener('click', () => openLightboxFromIndex(i % GALLERY.length));
  });
}

/* ---------- Days together + countdown ---------- */
function daysBetween(a, b) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor((b - a) / oneDay);
}

function updateDates() {
  // days together
  const start = new Date(START_DATE + 'T00:00:00');
  const today = new Date();
  const days = daysBetween(start, today) + 1; // include start day
  $('#days-together').textContent = days;

  // next countdown
  if (NEXT_EVENT && NEXT_EVENT.date) {
    const target = new Date(NEXT_EVENT.date + 'T00:00:00');
    let diff = target - today;
    if (diff <= 0) {
      $('#next-countdown').textContent = 'Đã tới!';
    } else {
      const d = Math.floor(diff / (24*60*60*1000));
      const h = Math.floor((diff % (24*60*60*1000)) / (60*60*1000));
      const m = Math.floor((diff % (60*60*1000)) / (60*1000));
      $('#next-countdown').textContent = `${d}d ${h}h ${m}m`;
    }
  } else {
    $('#next-countdown').textContent = '--';
  }
}
setInterval(updateDates, 1000 * 60); // update every minute
updateDates();

/* ---------- Mini-game hearts ---------- */
function initGame() {
  const wrap = $('#hearts-game');
  const result = $('#game-result');
  wrap.innerHTML = '';
  const n = 6;
  for (let i = 0; i < n; i++) {
    const btn = document.createElement('button');
    btn.className = 'heart-btn';
    btn.innerHTML = '❤️';
    btn.addEventListener('click', () => {
      const msg = MINI_MESSAGES[Math.floor(Math.random() * MINI_MESSAGES.length)];
      result.textContent = msg;
      burstHearts(btn.getBoundingClientRect().left + 36, btn.getBoundingClientRect().top + 36);
    });
    wrap.appendChild(btn);
  }
}

/* ---------- UI buttons ---------- */
$('#open-timeline').addEventListener('click', () => {
  $('#timeline-section').scrollIntoView({ behavior: 'smooth' });
});
$('#open-gallery').addEventListener('click', () => {
  $('#gallery-section').scrollIntoView({ behavior: 'smooth' });
});
$('#surprise-btn').addEventListener('click', (e) => {
  const r = e.target.getBoundingClientRect();
  burstHearts(r.left + r.width / 2, r.top);
});
$('#open-game').addEventListener('click', () => {
  $('#game-section').scrollIntoView({ behavior: 'smooth' });
});
$('#top-btn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Init AOS, render everything ---------- */
function initAll() {
  renderTimeline();
  renderGallery();
  initSwiper();
  initGame();
  AOS.init({ duration: 700, once: true, offset: 80 });
}

window.addEventListener('load', () => {
  initAll();
  // set stored dark preference
  if (localStorage.getItem('dark') === '1') document.body.classList.add('dark');
});

/* Accessibility: close welcome with Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!welcomeEl.classList.contains('hidden')) {
      welcomeEl.classList.add('hidden');
      setTimeout(() => typeHero(), 200);
    } else {
      if (LB.getAttribute('aria-hidden') === 'false') closeLightbox();
      if (videoModal.getAttribute('aria-hidden') === 'false') { videoModal.setAttribute('aria-hidden','true'); messageVideo.pause(); }
    }
  }
});
