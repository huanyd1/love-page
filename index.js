// Init AOS
AOS.init({ duration: 900, once: true, easing: 'ease-in-out' });

// Parallax + Blur logic
(function(){
  const heroBg = document.getElementById('heroBg');
  const storyBg = document.getElementById('storyBg');
  const maxBlur = 6;
  const heroFactor = 0.35;
  const storyFactor = 0.18;

  function onScroll(){
    const sc = window.scrollY || window.pageYOffset;
    if(heroBg){
      const heroOffset = Math.min(sc * heroFactor, 400);
      heroBg.style.transform = `translate3d(0, ${heroOffset}px, 0) scale(1.08)`;
      const blur = Math.min((sc / 100) * 0.6, maxBlur);
      heroBg.style.filter = `blur(${blur}px) saturate(1.02)`;
    }
    if(storyBg){
      const sOff = Math.max(0, (window.scrollY - 200) * storyFactor);
      storyBg.style.transform = `translate3d(0, ${sOff}px, 0) scale(1.06)`;
      const sBlur = Math.min((window.scrollY / 200) * 0.6, maxBlur * 0.8);
      storyBg.style.filter = `blur(${sBlur}px) brightness(0.95)`;
    }
  }

  let ticking = false;
  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  onScroll();
})();

// RSVP form
document.getElementById('rsvpForm').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const people = document.getElementById('people').value;
  const result = document.getElementById('rsvpResult');
  result.style.display = 'block';
  result.className = 'alert alert-success';
  result.textContent = `${name} — đã xác nhận: ${people}`;
  this.reset();
});
