// ----- DỮ LIỆU -----
const TIMELINE = [
  {date: '2021-06-15', title: 'Lần gặp đầu tiên', text: 'Anh nhớ em đã cười thế nào.', img: 'images/img1.svg'},
  {date: '2022-02-14', title: 'Ngày chính thức', text: 'Ngày chúng ta bắt đầu chính thức.', img: 'images/img2.svg'},
  {date: '2023-08-10', title: 'Chuyến đi đầu tiên', text: 'Cùng nhau đi biển.', img: 'images/img3.svg'}
];
const GALLERY = [
  {src:'images/img1.svg', alt:'Ảnh 1'},
  {src:'images/img2.svg', alt:'Ảnh 2'},
  {src:'images/img3.svg', alt:'Ảnh 3'}
];

// Render timeline
function renderTimeline(){
  const wrap = document.getElementById('timeline');
  TIMELINE.forEach((it,i)=>{
    const div=document.createElement('article');div.className='timeline-item fade-in';
    div.innerHTML=`<div class="timeline-badge">${i+1}</div>
      <img src="${it.img}" alt="${it.title}">
      <div class="meta"><h3>${it.title}</h3><time>${it.date}</time><p>${it.text}</p></div>`;
    wrap.appendChild(div);
  });
}

// Render gallery
function renderGallery(){
  const wrap=document.getElementById('gallery');
  GALLERY.forEach((g,i)=>{
    const img=document.createElement('img');
    img.src=g.src;img.alt=g.alt;img.classList.add("fade-in");
    img.addEventListener('click',()=>openLightbox(i));
    wrap.appendChild(img);
  });
}

// Lightbox
let current=-1;
const lb=document.getElementById('lightbox');
const lbImg=lb.querySelector('.lb-img');
lb.querySelector('.lb-close').onclick=()=>lb.setAttribute('aria-hidden','true');
lb.querySelector('.lb-prev').onclick=()=>openLightbox((current-1+GALLERY.length)%GALLERY.length);
lb.querySelector('.lb-next').onclick=()=>openLightbox((current+1)%GALLERY.length);
function openLightbox(i){current=i;lbImg.src=GALLERY[i].src;lbImg.alt=GALLERY[i].alt;lb.setAttribute('aria-hidden','false')}

// Typing effect
function typeHero(){
  const h=document.getElementById('hero-title');
  const txt=h.textContent;h.textContent='';let i=0;
  const t=setInterval(()=>{h.textContent+=txt[i++]||'';if(i>txt.length)clearInterval(t)},60);
}

// Hearts animation
const cvs=document.getElementById('hearts-canvas'),ctx=cvs.getContext('2d');
function resize(){cvs.width=innerWidth;cvs.height=innerHeight}
window.onresize=resize;resize();
let hearts=[];
class Heart{
  constructor(x,y){this.x=x;this.y=y;this.vx=(Math.random()-0.5)*1.6;this.vy=-(Math.random()*2+1.2);this.size=Math.random()*12+8;this.a=1;}
  upd(){this.vy+=0.03;this.x+=this.vx;this.y+=this.vy;this.a-=0.01;}
  draw(){ctx.globalAlpha=this.a;ctx.beginPath();let s=this.size;
    ctx.moveTo(this.x,this.y+s/4);
    ctx.bezierCurveTo(this.x+s/2,this.y-s/2,this.x+s*1.2,this.y+s/3,this.x,this.y+s);
    ctx.bezierCurveTo(this.x-s*1.2,this.y+s/3,this.x-s/2,this.y-s/2,this.x,this.y+s/4);
    ctx.fillStyle="red";ctx.fill();ctx.globalAlpha=1;}
}
function burst(x=innerWidth/2,y=innerHeight/2){for(let i=0;i<18;i++)hearts.push(new Heart(x,y))}
function loop(){ctx.clearRect(0,0,cvs.width,cvs.height);hearts.forEach(h=>{h.upd();h.draw()});hearts=hearts.filter(h=>h.a>0);requestAnimationFrame(loop)}loop();

// Nhạc
const audio=document.getElementById('bg-music');
document.getElementById('music-toggle').onclick=(e)=>{
  if(audio.paused){audio.play();e.target.textContent='Tắt nhạc'}
  else{audio.pause();e.target.textContent='Bật nhạc'}
};
document.getElementById('music-vol').oninput=e=>audio.volume=e.target.value;

// Thiệp mở đầu
const welcome=document.getElementById('welcome');
document.getElementById('open-card').onclick=()=>{
  welcome.classList.add('hidden');
  typeHero();
  burst();
  audio.play().catch(()=>{}); // auto play nếu được phép
};
document.getElementById('open-play').onclick=()=>audio.play();

// Nút cuộn
document.getElementById('open-timeline').onclick=()=>document.getElementById('timeline-section').scrollIntoView({behavior:'smooth'});
document.getElementById('open-gallery').onclick=()=>document.getElementById('gallery-section').scrollIntoView({behavior:'smooth'});
document.getElementById('surprise-btn').onclick=e=>{
  const r=e.target.getBoundingClientRect();
  burst(r.left+r.width/2,r.top);
};
document.getElementById('top-btn').onclick=()=>scrollTo({top:0,behavior:'smooth'});

// Dark mode toggle
const darkBtn=document.createElement('button');
darkBtn.textContent="🌙/☀️";
darkBtn.style.position="fixed";
darkBtn.style.right="12px";darkBtn.style.bottom="12px";
darkBtn.style.zIndex="1200";
document.body.appendChild(darkBtn);
darkBtn.onclick=()=>document.body.classList.toggle("dark");

// Scroll animation (Intersection Observer)
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
},{threshold:0.2});

// Áp dụng cho các item có class fade-in
function observeElements(){
  document.querySelectorAll(".fade-in").forEach(el=>observer.observe(el));
}

// Init
renderTimeline();
renderGallery();
observeElements();
