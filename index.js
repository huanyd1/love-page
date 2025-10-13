// Init AOS
AOS.init({ duration: 900, once: true, easing: 'ease-in-out' });

// Parallax + Blur logic
(function () {
    const heroBg = document.getElementById('heroBg');
    const storyBg = document.getElementById('storyBg');
    const maxBlur = 6;
    const heroFactor = 0.35;
    const storyFactor = 0.18;

    function onScroll() {
        const sc = window.scrollY || window.pageYOffset;
        if (heroBg) {
            const heroOffset = Math.min(sc * heroFactor, 400);
            heroBg.style.transform = `translate3d(0, ${heroOffset}px, 0) scale(1.08)`;
            const blur = Math.min((sc / 100) * 0.6, maxBlur);
            heroBg.style.filter = `blur(${blur}px) saturate(1.02)`;
        }
        if (storyBg) {
            const sOff = Math.max(0, (window.scrollY - 200) * storyFactor);
            storyBg.style.transform = `translate3d(0, ${sOff}px, 0) scale(1.06)`;
            const sBlur = Math.min((window.scrollY / 200) * 0.6, maxBlur * 0.8);
            storyBg.style.filter = `blur(${sBlur}px) brightness(0.95)`;
        }
    }

    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(() => { onScroll(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });

    onScroll();
})();

// RSVP form
document.getElementById('rsvpForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const people = document.getElementById('people').value;
    const result = document.getElementById('rsvpResult');
    result.style.display = 'block';
    result.className = 'alert alert-success';
    result.textContent = `${name} — đã xác nhận: ${people}`;
    this.reset();
});

// --- Falling Hearts Effect ---
function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = "&#10084;"; // ký tự trái tim (♥)
    heart.style.left = Math.random() * 100 + "vw"; // vị trí ngẫu nhiên
    heart.style.fontSize = Math.random() * 10 + 10 + "px"; // kích thước ngẫu nhiên
    heart.style.animationDuration = Math.random() * 3 + 4 + "s"; // tốc độ rơi ngẫu nhiên
    document.body.appendChild(heart);

    // Xóa tim sau khi rơi
    setTimeout(() => {
        heart.remove();
    }, 7000);
}

// Tạo tim liên tục
setInterval(createHeart, 300); // mỗi 0.3s tạo 1 tim


// Thay đổi ngày bắt đầu yêu theo định dạng YYYY-MM-DD
const startDate = new Date("2022-09-13T00:00:00");
const startDateText = document.getElementById('startDateText');
//startDateText.textContent = `Bắt đầu từ: ${startDate.toLocaleDateString()}`;

function updateDays() {
    const now = new Date();
    const diffTime = now - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('daysCount').textContent = diffDays + "❤️";
}

// Cập nhật ngay lập tức và mỗi 1 giây
updateDays();
setInterval(updateDays, 1000);