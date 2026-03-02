/* ==========================================================
   PORTFOLIO — Futuristic Edition — JS
   ========================================================== */

/*  1. CONSTELLATION CANVAS BACKGROUND  */
(function initCanvas() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];
  let mouseX = -9999, mouseY = -9999;
  const COUNT = 130, LINK_DIST = 140, PULL_DIST = 110;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.22;
      this.vy = (Math.random() - 0.5) * 0.22;
      this.r  = Math.random() * 1.4 + 0.4;
      this.a  = Math.random() * 0.45 + 0.15;
    }
    constructor() { this.reset(); }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
      const dx = mouseX - this.x, dy = mouseY - this.y;
      const d  = Math.hypot(dx, dy);
      if (d < PULL_DIST) { this.x += dx * 0.005; this.y += dy * 0.005; }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,240,255,${this.a})`;
      ctx.fill();
    }
  }

  function init() { particles = Array.from({ length: COUNT }, () => new Particle()); }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,240,255,${(1 - d / LINK_DIST) * 0.14})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", () => { resize(); init(); });
  document.addEventListener("mousemove", e => { mouseX = e.clientX; mouseY = e.clientY; });
  resize(); init(); loop();
})();

/*  2. CUSTOM RADAR CURSOR  */
(function initCursor() {
  const cursor = document.querySelector(".custom-cursor");
  if (!cursor) return;
  const isTouch = window.matchMedia("(hover:none) and (pointer:coarse)").matches;
  if (isTouch) { cursor.style.display = "none"; return; }

  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    requestAnimationFrame(loop);
  })();

  document.addEventListener("mouseleave", () => { cursor.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { cursor.style.opacity = "1"; });
})();

/*  3. 3-D TILT CARDS  */
(function initTilt() {
  const MAX = 10;
  document.querySelectorAll(
    ".services-box, .skill-category-card, .timeline-content, .portfolio-box"
  ).forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateX(${-y * MAX}deg) rotateY(${x * MAX}deg) translateZ(8px) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform .55s cubic-bezier(.23,1,.32,1)";
      card.style.transform  = "";
      setTimeout(() => { card.style.transition = ""; }, 560);
    });
  });
})();

/*  4. MAGNETIC BUTTONS  */
(function initMagnetic() {
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.28}px,${dy * 0.28}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transition = "transform .55s cubic-bezier(.23,1,.32,1)";
      btn.style.transform  = "";
      setTimeout(() => { btn.style.transition = ""; }, 560);
    });
  });
})();

/*  5. NAVBAR TOGGLE  */
const menuIcon = document.querySelector("#menu-icon");
const navbar   = document.querySelector(".navbar");
menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};

/*  6. SCROLL: STICKY HEADER + ACTIVE NAV  */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header nav a");
const header   = document.querySelector("header");

window.addEventListener("scroll", () => {
  const sy = window.scrollY;
  sections.forEach(sec => {
    const id  = sec.getAttribute("id");
    if (sy >= sec.offsetTop - 160 && sy < sec.offsetTop + sec.offsetHeight - 160) {
      navLinks.forEach(l => l.classList.remove("active"));
      const link = document.querySelector(`header nav a[href*=${id}]`);
      if (link) link.classList.add("active");
    }
  });
  header.classList.toggle("sticky", sy > 100);
  menuIcon.classList.remove("bx-x");
  navbar.classList.remove("active");
});

/*  7. SCROLL REVEAL  */
ScrollReveal({ distance: "60px", duration: 1800, delay: 150 });
ScrollReveal().reveal(".home-content, .heading",                                          { origin: "top" });
ScrollReveal().reveal(".home-img, .services-container, .portfolio-box, .contact form",   { origin: "bottom" });
ScrollReveal().reveal(".home-content h1, .about-img",                                    { origin: "left" });
ScrollReveal().reveal(".home-content p, .about-content",                                 { origin: "right" });
ScrollReveal().reveal(".timeline-item",        { origin: "bottom", interval: 150 });
ScrollReveal().reveal(".skill-category-card",  { origin: "bottom", interval: 100 });

/*  8. TYPED.JS  */
const typed = new Typed(".multiple-text", {
  strings: ["Full Stack Developer", "MERN Stack Engineer", "Problem Solver"],
  typeSpeed: 90,
  backSpeed: 60,
  backDelay: 1800,
  loop: true,
});
