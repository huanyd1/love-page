// --- Password ---
const correctPassword = "1234";
function pressKey(num){ document.getElementById('pass').value+=num; }
function clearPass(){ document.getElementById('pass').value=''; }
function checkPassword(){
  if(document.getElementById('pass').value === correctPassword){
    document.getElementById('login').style.display='none';
    document.getElementById('mainContent').style.display='block';
    initPuzzle();
  } else alert('Sai mật khẩu!');
}

// --- Đếm ngày yêu ---
const startDate = new Date("2024-01-01");
function updateDays() {
  const now = new Date();
  let years = now.getFullYear()-startDate.getFullYear();
  let months = now.getMonth()-startDate.getMonth();
  let days = now.getDate()-startDate.getDate();
  if(days<0){ months--; days+= new Date(now.getFullYear(), now.getMonth(),0).getDate();}
  if(months<0){ years--; months+=12;}
  document.getElementById('loveDays').innerText=`Đã yêu nhau ${years} năm, ${months} tháng, ${days} ngày`;
}
updateDays();
setInterval(updateDays,1000*60*60);

// --- Nhắc nhở ---
const events=[
  {date:"2025-09-25", name:"Ngày đầu gặp nhau", img:"https://via.placeholder.com/50/ff6b81"},
  {date:"2025-10-20", name:"Sinh nhật người yêu", img:"https://via.placeholder.com/50/6bafff"},
  {date:"2025-11-05", name:"Kỷ niệm 1 năm", img:"https://via.placeholder.com/50/6bff9b"}
];
function nextEvent(){
  const now=new Date();
  let next=events[0];
  events.forEach(e=>{
    const eDate=new Date(e.date);
    if(eDate>=now && eDate<new Date(next.date)) next=e;
  });
  document.getElementById('nextEvent').innerText=`Sự kiện gần nhất: ${next.date} - ${next.name}`;
}
nextEvent();

// --- Slideshow ---
let slideIndex=0;
const slidesContainer=document.getElementById('slidesContainer');
events.forEach(e=>{
  const img=document.createElement('img');
  img.src=e.img; if(slideIndex===0) img.classList.add('active');
  slidesContainer.appendChild(img);
});
const slides=document.querySelectorAll('#slidesContainer img');
function showSlide(n){ slides.forEach(s=>s.classList.remove('active')); slides[n].classList.add('active'); }
function nextSlide(){ slideIndex=(slideIndex+1)%slides.length; showSlide(slideIndex);}
function prevSlide(){ slideIndex=(slideIndex-1+slides.length)%slides.length; showSlide(slideIndex);}
setInterval(nextSlide,3000);

// --- Timeline ---
const timelineEl=document.getElementById('timeline');
events.forEach((e,i)=>{
  const div=document.createElement('div');
  div.classList.add('event');
  div.innerHTML=`<img src="${e.img}"><span>${i+1}. ${e.date}: ${e.name}</span>`;
  timelineEl.appendChild(div);
});

// --- Mini game click tim ---
let score=0;
function clickLove(){
  score++; 
  document.getElementById('score').innerText=score;
  const msgArr=["Bạn là người tuyệt vời ❤️","Thương em nhiều 😘","Chúc mừng tình yêu của chúng ta 🥰"];
  document.getElementById('gameMsg').innerText=msgArr[Math.floor(Math.random()*msgArr.length)];

  // Tạo tim bay lên
  const btn=document.querySelector('#game button');
  const heart=document.createElement('span');
  heart.classList.add('flying-heart');
  heart.innerText='❤️';
  document.body.appendChild(heart);
  const rect=btn.getBoundingClientRect();
  heart.style.left=rect.left + rect.width/2 + 'px';
  heart.style.top=rect.top + 'px';
  setTimeout(()=>heart.remove(),1000);
}

// --- Mini game puzzle ---
let puzzleOrder=[];
function initPuzzle(){
  const puzzleContainer=document.getElementById('puzzleContainer');
  puzzleContainer.innerHTML='';
  puzzleOrder=[...events.keys()];
  puzzleOrder.sort(()=>Math.random()-0.5);
  puzzleOrder.forEach(i=>{
    const img=document.createElement('img');
    img.src=events[i].img;
    img.draggable=true;
    img.dataset.index=i;
    img.addEventListener('dragstart',dragStart);
    puzzleContainer.appendChild(img);
  });
}
let dragged=null;
function dragStart(e){ dragged=e.target; }
document.getElementById('puzzleContainer').addEventListener('dragover',e=>e.preventDefault());
document.getElementById('puzzleContainer').addEventListener('drop',drop);
function drop(e){
  e.preventDefault();
  const target=e.target;
  if(target.tagName==='IMG' && target!==dragged){
    const container=target.parentNode;
    container.insertBefore(dragged,target);
    checkPuzzle();
  }
}
function checkPuzzle(){
  const imgs=document.querySelectorAll('#puzzleContainer img');
  let correct=true;
  imgs.forEach((img,i)=>{
    if(parseInt(img.dataset.index)!==i) correct=false;
  });
  if(correct){
    score+=5;
    document.getElementById('score').innerText=score;
    document.getElementById('gameMsg').innerText='Chúc mừng! Bạn đã xếp đúng ❤️';
    imgs.forEach(img=>img.classList.add('puzzle-correct'));
    setTimeout(()=>{
      imgs.forEach(img=>img.classList.remove('puzzle-correct'));
      initPuzzle();
    },800);
  }
}

// --- Dark mode ---
function toggleDarkMode(){ document.body.classList.toggle('dark'); }

// --- Tạo numpad cho login ---
const numpad = document.getElementById('numpad');
const passInput = document.getElementById('passInput');
const PASSWORD = "1234"; // bạn đổi mật khẩu tại đây

['1','2','3','4','5','6','7','8','9','0','Xóa','OK'].forEach(key=>{
  const btn=document.createElement('button');
  btn.textContent=key;
  btn.onclick=()=>{
    if(key==="Xóa"){
      passInput.value=passInput.value.slice(0,-1);
    } else if(key==="OK"){
      if(passInput.value===PASSWORD){
        document.getElementById('login').style.display="none";
        document.getElementById('main').style.display="block";
      } else {
        alert("Sai mật khẩu rồi 😢");
        passInput.value="";
      }
    } else {
      passInput.value+=key;
    }
  };
  numpad.appendChild(btn);
});
