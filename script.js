/* script.js - full features integrated
   - START_DATE set to 13/09/2022
   - NEXT_EVENT set to Valentine 14/02/2026
   - Edit TIMELINE / GALLERY arrays below to update content
*/

/* ----------------- DỮ LIỆU (chỉnh ở đây) ----------------- */
const START_DATE = '2022-09-13'; // YYYY-MM-DD
const NEXT_EVENT = { label: 'Valentine 2026', date: '2026-02-14' };

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

/* Helpers */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* ---------------- Welcome card, typing, music ---------------- */
const welcomeEl = $('#welcome');
const openCardBtn = $('#open-card');
const openPlayBtn = $('#open-play');
const audio = $('#bg-music');
const playToggle = $('#play-toggle');
const darkToggle = $('#dark-toggle');

// typing effect for hero title (run after welcome closed)
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

// try to play audio (handles promise)
function tryPlayAudio(userInitiated = false) {
  if (!audio) return;
  const p = audio.play();
  if (p && p.then) {
    p.then(() => updatePlayButton(true)).catch(() => {
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

/* Open welcome */
openCardBtn.addEventListener('click', () => {
  welcomeEl.classList.add('hidden');
  burstHearts(window.innerWidth/2, window.innerHeight/3);
  setTimeout(() => typeHero(), 200);
  tryPlayAudio();
});
openPlayBtn.addEventListener('click', () => tryPlayAudio(true));

/* top play toggle */
playToggle.addEventListener('click', () => {
  if (!audio) return;
  if (audio.paused) audio.play().catch(()=>{});
  else audio.pause();
  updatePlayButton(!audio.paused);
});

/* dark mode toggle */
function setDark(v) {
  if (v) document.body.classList.add('dark'); else document.body.classList.remove('dark');
  localStorage.setItem('dark', v ? '1' : '0');
}
darkToggle.addEventListener('click', () => {
  const now = !document.body.classList.contains('dark');
  setDark(now);
});
const stored = localStorage.getItem('dark');
if (stored === '1') setDark(true);

/* ---------------- Hearts canvas (burst + falling) ---------------- */
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
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.vx = (Math.random()-0.5)*1.8;
    this.vy = -(Math.random()*2 + 1.2);
    this.size = Math.random()*14 + 8;
    this.alpha = 1;
    this.spin = (Math.random()-0.5)*0.06;
    this.angle = 0;
    this.color = `rgba(255,${120+Math.floor(Math.random()*100)},${140+Math.floor(Math.random()*100)},1)`;
  }
  update(){
    this.vy += 0.03;
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.spin;
    this.alpha -= 0.01;
  }
  draw(){
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = Math.max(this.alpha,0);
    ctx.beginPath();
    const s = this.size;
    ctx.moveTo(0, s/4);
    ctx.bezierCurveTo(s/2, -s/2, s*1.2, s/3, 0, s);
    ctx.bezierCurveTo(-s*1.2, s/3, -s/2, -s/2, 0, s/4);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}
function burstHearts(x = window.innerWidth/2, y = window.innerHeight/2) {
  for (let i=0;i<22;i++) hearts.push(new Heart(x + (Math.random()-0.5)*80, y + (Math.random()-0.5)*40));
}
function animateHearts() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  hearts.forEach(h=>{h.update();h.draw();});
  hearts = hearts.filter(h=>h.alpha>0);
  requestAnimationFrame(animateHearts);
}
animateHearts();

/* ---------------- Render timeline & gallery & lightbox ---------------- */
function renderTimeline(){
  const wrap = $('#timeline');
  wrap.innerHTML = '';
  TIMELINE.forEach((it, idx) => {
    const item = document.createElement('article');
    item.className = 'timeline-item fade-in';
    item.setAttribute('data-id', it.id || idx);
    item.innerHTML = `
      <div class="timeline-badge">${idx+1}</div>
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
      burstHearts(r.left + r.width/2, r.top + 40);
    });
  });
}

function renderGallery(){
  const wrap = $('#gallery');
  wrap.innerHTML = '';
  GALLERY.forEach((g, idx) => {
    const img = document.createElement('img');
    img.src = g.src; img.alt = g.alt || ''; img.loading = 'lazy';
    img.className = 'fade-in';
    img.addEventListener('click', () => openLightboxFromIndex(idx));
    wrap.appendChild(img);
  });
}

/* Lightbox */
const LB = $('#lightbox'); const LB_IMG = LB.querySelector('.lb-img');
let currentIndex = -1;
LB.querySelector('.lb-close').addEventListener('click', closeLightbox);
LB.querySelector('.lb-prev').addEventListener('click', () => openLightboxFromIndex((currentIndex-1+GALLERY.length)%GALLERY.length));
LB.querySelector('.lb-next').addEventListener('click', () => openLightboxFromIndex((currentIndex+1)%GALLERY.length));

function openLightboxFromIndex(i){
  if (!GALLERY[i]) return;
  currentIndex = i;
  LB_IMG.src = GALLERY[i].src;
  LB_IMG.alt = GALLERY[i].alt || '';
  LB.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function openLightboxFromURL(url){
  LB_IMG.src = url; LB_IMG.alt = '';
  LB.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  LB.setAttribute('aria-hidden','true'); LB_IMG.src = ''; currentIndex = -1; document.body.style.overflow = '';
}
document.addEventListener('keydown', (e)=>{
  if (LB.getAttribute('aria-hidden') === 'false') {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightboxFromIndex((currentIndex-1+GALLERY.length)%GALLERY.length);
    if (e.key === 'ArrowRight') openLightboxFromIndex((currentIndex+1)%GALLERY.length);
  }
});

/* Video modal */
const videoModal = $('#video-modal'); const messageVideo = $('#message-video');
$('#open-video').addEventListener('click', () => {
  if(!messageVideo) return alert('Không tìm thấy video. Hãy đặt file tại videos/message.mp4');
  videoModal.setAttribute('aria-hidden','false');
  messageVideo.currentTime = 0;
  messageVideo.play().catch(()=>{});
});
videoModal.querySelector('.lb-close').addEventListener('click', () => {
  videoModal.setAttribute('aria-hidden','true'); messageVideo.pause();
});

/* ---------------- Swiper init (carousel) ---------------- */
let mySwiper;
function initSwiper(){
  const wrapper = $('#swiper-wrapper'); wrapper.innerHTML = '';
  GALLERY.forEach(g => {
    const slide = document.createElement('div'); slide.className = 'swiper-slide';
    slide.innerHTML = `<img src="${g.src}" alt="${g.alt||''}">`;
    wrapper.appendChild(slide);
  });
  if (mySwiper) mySwiper.destroy(true, true);
  mySwiper = new Swiper('.mySwiper', {
    loop: true, grabCursor: true, centeredSlides: true, slidesPerView: 1.1, spaceBetween: 16,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: { 700: { slidesPerView: 2.0 } }
  });
  // slide click -> lightbox
  setTimeout(()=>{
    $$('.swiper .swiper-slide img').forEach((imgEl,i)=>{
      imgEl.addEventListener('click', ()=> openLightboxFromIndex(i % GALLERY.length));
    });
  },300);
}

/* ---------------- Days together & countdown ---------------- */
function daysBetween(a,b){ const day=24*60*60*1000; return Math.floor((b-a)/day); }
function updateDates(){
  const start = new Date(START_DATE + 'T00:00:00');
  const today = new Date();
  const days = daysBetween(start,today) + 1;
  $('#days-together').textContent = days;

  if (NEXT_EVENT && NEXT_EVENT.date){
    const target = new Date(NEXT_EVENT.date + 'T00:00:00');
    const diff = target - today;
    $('#next-label').textContent = NEXT_EVENT.label || 'Đếm ngược';
    if (diff <= 0) $('#next-countdown').textContent = 'Đã tới!';
    else {
      const d = Math.floor(diff / (24*60*60*1000));
      const h = Math.floor((diff % (24*60*60*1000)) / (60*60*1000));
      const m = Math.floor((diff % (60*60*1000)) / (60*1000));
      $('#next-countdown').textContent = `${d}d ${h}h ${m}m`;
    }
  } else $('#next-countdown').textContent = '--';
}
updateDates(); setInterval(updateDates, 60*1000);

/* ---------------- Mini-game hearts ---------------- */
function initGame(){
  const wrap = $('#hearts-game'); wrap.innerHTML = '';
  const result = $('#game-result'); result.textContent = '';
  const n = 6;
  for (let i=0;i<n;i++){
    const btn = document.createElement('button'); btn.className = 'heart-btn'; btn.innerHTML = '❤️';
    btn.addEventListener('click', () => {
      const msg = MINI_MESSAGES[Math.floor(Math.random()*MINI_MESSAGES.length)];
      result.textContent = msg;
      const rect = btn.getBoundingClientRect();
      burstHearts(rect.left + rect.width/2, rect.top + rect.height/2);
    });
    wrap.appendChild(btn);
  }
}

/* ---------------- Intersection Observer for scroll animations ---------------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
},{threshold: 0.15});
function observeElements(){
  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
}

/* ---------------- UI buttons ---------------- */
$('#open-timeline').addEventListener('click', () => $('#timeline-section').scrollIntoView({behavior:'smooth'}));
$('#open-gallery').addEventListener('click', () => $('#gallery-section').scrollIntoView({behavior:'smooth'}));
$('#surprise-btn').addEventListener('click', (e) => { const r = e.target.getBoundingClientRect(); burstHearts(r.left + r.width/2, r.top); });
$('#open-game').addEventListener('click', () => $('#game-section').scrollIntoView({behavior:'smooth'}));
$('#top-btn').addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

/* ---------------- Init everything ---------------- */
function initAll(){
  renderTimeline();
  renderGallery();
  initSwiper();
  initGame();
  observeElements();
  // init AOS optionally for any elements that use it
  if (window.AOS) AOS.init({ duration: 700, once: true, offset: 80 });
}
window.addEventListener('load', () => {
  initAll();
  // apply stored dark
  if (localStorage.getItem('dark') === '1') setDark(true);
});

/* Accessibility: Escape closes modals/welcome */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!welcomeEl.classList.contains('hidden')) { welcomeEl.classList.add('hidden'); setTimeout(()=>typeHero(),200); }
    if (LB.getAttribute('aria-hidden') === 'false') closeLightbox();
    if (videoModal.getAttribute('aria-hidden') === 'false') { videoModal.setAttribute('aria-hidden','true'); if(messageVideo) messageVideo.pause(); }
  }
});

// ---- Password gate MD5 ----
const PW_GATE = document.getElementById('pw-gate');
const PW_INPUT = document.getElementById('pw-input');
const PW_SUBMIT = document.getElementById('pw-submit');
const PW_ERROR = document.getElementById('pw-error');

// Thay chuỗi bên dưới bằng MD5 hash của mật khẩu bạn chọn
const PASSWORD_HASH_MD5 = "81dc9bdb52d04dc20036dbd8313ed055"; // = MD5("1234")

PW_SUBMIT.addEventListener('click', () => {
  const input = PW_INPUT.value.trim();
  if (md5(input) === PASSWORD_HASH_MD5) {
    PW_GATE.style.display = 'none'; // mở khóa
  } else {
    PW_ERROR.style.display = 'block';
    PW_INPUT.value = "";
  }
});

// Cho phép Enter
PW_INPUT.addEventListener('keydown', (e) => {
  if (e.key === "Enter") PW_SUBMIT.click();
});

// ---- Password gate với keypad ----
const PW_GATE = document.getElementById('pw-gate');
const PW_DOTS = document.querySelectorAll('#pw-dots span');
const PW_ERROR = document.getElementById('pw-error');
const PW_CLEAR = document.getElementById('pw-clear');
const PW_OK = document.getElementById('pw-ok');
const PW_BTNS = document.querySelectorAll('.pw-keypad button:not(#pw-clear):not(#pw-ok)');

// Mật khẩu: 1234 (MD5 hash)
const PASSWORD_HASH_MD5 = "81dc9bdb52d04dc20036dbd8313ed055";

let inputCode = "";

// Cập nhật chấm
function updateDots() {
  PW_DOTS.forEach((dot, i) => {
    dot.classList.toggle('filled', i < inputCode.length);
  });
}

function checkPassword() {
  if (md5(inputCode) === PASSWORD_HASH_MD5) {
    PW_GATE.style.display = 'none';
    PW_ERROR.style.display = 'none';
  } else {
    PW_ERROR.style.display = 'block';
    inputCode = "";
    updateDots();
  }
}

// Xử lý bấm số
PW_BTNS.forEach(btn => {
  btn.addEventListener('click', () => {
    if (inputCode.length < 4) {
      inputCode += btn.textContent;
      updateDots();
    }
  });
});

// Xoá
PW_CLEAR.addEventListener('click', () => {
  inputCode = inputCode.slice(0, -1);
  updateDots();
});

// OK
PW_OK.addEventListener('click', () => {
  if (inputCode.length === 4) {
    checkPassword();
  }
});
