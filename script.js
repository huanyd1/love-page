// script.js - dễ chỉnh: sửa mảng TIMELINE và GALLERY để cập nhật nội dung

// ----- DỮ LIỆU: chỉnh ở đây -----
const TIMELINE = [
  {
    id: 't1',
    date: '2021-06-15',
    title: 'Lần gặp đầu tiên',
    text: 'Lần đầu gặp nhau ở quán cà phê nhỏ… Anh nhớ em đã cười như thế nào.',
    img: 'images/img1.svg'
  },
  {
    id: 't2',
    date: '2022-02-14',
    title: 'Ngày chính thức',
    text: 'Ngày chúng ta bắt đầu chính thức, tim anh loạn nhịp.',
    img: 'images/img2.svg'
  },
  {
    id: 't3',
    date: '2023-08-10',
    title: 'Chuyến đi đầu tiên',
    text: 'Cùng nhau đi biển, chụp ảnh và ăn kem dưới nắng.',
    img: 'images/img3.svg'
  }
];

const GALLERY = [
  {src:'images/img1.svg', alt:'Ảnh kỷ niệm 1'},
  {src:'images/img2.svg', alt:'Ảnh kỷ niệm 2'},
  {src:'images/img3.svg', alt:'Ảnh kỷ niệm 3'},
  {src:'images/img1.svg', alt:'Ảnh kỷ niệm 4'},
  {src:'images/img2.svg', alt:'Ảnh kỷ niệm 5'},
  {src:'images/img3.svg', alt:'Ảnh kỷ niệm 6'}
];
// ----- HẾT phần chỉnh dữ liệu -----


// Utility để tạo element nhanh
function el(tag, props={}, ...children){
  const e = document.createElement(tag);
  for(const k in props){
    if(k.startsWith('on') && typeof props[k] === 'function'){
      e.addEventListener(k.substring(2), props[k]);
    } else if(k === 'html'){
      e.innerHTML = props[k];
    } else if(k === 'cls'){
      e.className = props[k];
    } else {
      e.setAttribute(k, props[k]);
    }
  }
  children.flat().forEach(c => {
    if(c == null) return;
    e.append(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return e;
}

// Render timeline from TIMELINE array
function renderTimeline(){
  const wrap = document.getElementById('timeline');
  wrap.innerHTML = '';
  TIMELINE.forEach((it, idx) => {
    const item = el('article', {cls:'timeline-item', id:it.id});
    const badge = el('div', {cls:'timeline-badge'}, String(idx+1));
    const thumb = el('img', {src:it.img, alt:it.title, loading:'lazy'});
    const meta = el('div', {cls:'meta'});
    const h3 = el('h3', {}, it.title);
    const time = el('time', {}, it.date);
    const p = el('p', {}, it.text);
    const btn = el('button', {}, 'Xem ảnh');
    btn.addEventListener('click', () => openLightbox(it.img, it.title));
    const effectBtn = el('button', {cls:'secondary'}, 'Bấm bất ngờ');
    effectBtn.addEventListener('click', event => {
      const rect = item.getBoundingClientRect();
      burstHearts(rect.left + rect.width/2, rect.top + 40);
    });

    meta.append(h3, time, p, btn, effectBtn);
    item.append(badge, thumb, meta);
    wrap.appendChild(item);
  });
}

// Render gallery
function renderGallery(){
  const wrap = document.getElementById('gallery');
  wrap.innerHTML = '';
  GALLERY.forEach((g, idx) => {
    const img = el('img', {src:g.src, alt:g.alt, loading:'lazy'});
    img.addEventListener('click', () => openLightbox(g.src, g.alt, idx));
    wrap.appendChild(img);
  });
}

// Lightbox
const LB = {
  el: document.getElementById('lightbox'),
  img: null,
  currentIdx: -1
};
LB.img = LB.el.querySelector('.lb-img');
LB.el.querySelector('.lb-close').addEventListener('click', closeLightbox);
LB.el.querySelector('.lb-prev').addEventListener('click', prevLightbox);
LB.el.querySelector('.lb-next').addEventListener('click', nextLightbox);

function openLightbox(src, alt='', idx=-1){
  LB.el.setAttribute('aria-hidden','false');
  LB.img.src = src;
  LB.img.alt = alt;
  LB.currentIdx = idx;
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  LB.el.setAttribute('aria-hidden','true');
  LB.img.src = '';
  LB.currentIdx = -1;
  document.body.style.overflow = '';
}
function prevLightbox(){
  if(LB.currentIdx === -1) return;
  LB.currentIdx = (LB.currentIdx - 1 + GALLERY.length) % GALLERY.length;
  LB.img.src = GALLERY[LB.currentIdx].src;
  LB.img.alt = GALLERY[LB.currentIdx].alt;
}
function nextLightbox(){
  if(LB.currentIdx === -1) return;
  LB.currentIdx = (LB.currentIdx + 1) % GALLERY.length;
  LB.img.src = GALLERY[LB.currentIdx].src;
  LB.img.alt = GALLERY[LB.currentIdx].alt;
}
document.addEventListener('keydown', (e)=>{
  if(LB.el.getAttribute('aria-hidden') === 'false'){
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') prevLightbox();
    if(e.key === 'ArrowRight') nextLightbox();
  }
});

// Simple "typing" effect for hero title
function typeHero(){
  const elh = document.getElementById('hero-title');
  const txt = elh.textContent;
  elh.textContent = '';
  let i=0;
  const t = setInterval(()=> {
    elh.textContent += txt[i++] || '';
    if(i>txt.length) clearInterval(t);
  }, 60);
}

// Hearts canvas animation (spawn hearts and animate)
const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');
let hearts = [];
function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Heart {
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.vx = (Math.random()-0.5) * 1.6;
    this.vy = - (Math.random()*2 + 1.2);
    this.size = Math.random()*12 + 8;
    this.alpha = 1;
    this.spin = (Math.random()-0.5)*0.06;
    this.angle = 0;
    this.color = `rgba(255,${100+Math.floor(Math.random()*120)},${120+Math.floor(Math.random()*100)},1)`;
  }
  update(){
    this.vy += 0.03; // gravity-ish
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.spin;
    this.alpha -= 0.01;
  }
  draw(){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = Math.max(this.alpha,0);
    // draw simple heart path
    ctx.beginPath();
    let s = this.size;
    ctx.moveTo(0, s/4);
    ctx.bezierCurveTo(s/2, -s/2, s*1.2, s/3, 0, s);
    ctx.bezierCurveTo(-s*1.2, s/3, -s/2, -s/2, 0, s/4);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function burstHearts(clientX = window.innerWidth/2, clientY= window.innerHeight/2){
  // clientX/Y assumed in viewport coords
  const rect = document.documentElement.getBoundingClientRect();
  const x = clientX;
  const y = clientY;
  for(let i=0;i<18;i++){
    hearts.push(new Heart(x + (Math.random()-0.5)*60, y + (Math.random()-0.5)*40));
  }
}

// animation loop
function animateHearts(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  hearts.forEach((h,i) => {
    h.update();
    h.draw();
  });
  hearts = hearts.filter(h => h.alpha > 0);
  requestAnimationFrame(animateHearts);
}
animateHearts();

// Music controls
const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');
const musicVol = document.getElementById('music-vol');

musicBtn.addEventListener('click', () => {
  if(!audio) return;
  if(audio.paused){
    const p = audio.play();
    if(p && p.then){
      p.catch(()=> {
        // autoplay blocked; inform user visually by changing button text
        musicBtn.textContent = 'Mở (chạm để phát)';
      });
    }
    musicBtn.textContent = 'Tắt nhạc';
  } else {
    audio.pause();
    musicBtn.textContent = 'Bật nhạc';
  }
});
musicVol.addEventListener('input', ()=> {
  audio.volume = Number(musicVol.value);
});

// UI bindings
document.getElementById('open-timeline').addEventListener('click', () => {
  document.getElementById('timeline-section').scrollIntoView({behavior:'smooth'});
});
document.getElementById('open-gallery').addEventListener('click', () => {
  document.getElementById('gallery-section').scrollIntoView({behavior:'smooth'});
});
document.getElementById('surprise-btn').addEventListener('click', (e) => {
  const rect = e.target.getBoundingClientRect();
  burstHearts(rect.left + rect.width/2, rect.top + 10);
});

document.getElementById('top-btn').addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

// Init
typeHero();
renderTimeline();
renderGallery();
