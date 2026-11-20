import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

/* --------------------------------
   1. LENIS SMOOTH SCROLL + GSAP
-------------------------------- */
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.2,
  smoothWheel: true
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* --------------------------------
   2. HERO 3D TORUSKNOT SCENE
-------------------------------- */
const canvas = document.querySelector("#scene");
let scene, camera, renderer, core, ringOne, ringTwo, stars;
let mouseX = 0, mouseY = 0;

function initHero3D() {
  if (!canvas) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 6.6;

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  scene.add(new THREE.AmbientLight(0xe0e7ff, 1.5));

  const pLight = new THREE.PointLight(0xa78bfa, 40, 24);
  pLight.position.set(3.2, 3, 4);
  scene.add(pLight);

  const cLight = new THREE.PointLight(0x22d3ee, 36, 24);
  cLight.position.set(-3.2, -2, 3.5);
  scene.add(cLight);

  const roseLight = new THREE.PointLight(0xf472b6, 28, 22);
  roseLight.position.set(0, -3.4, 2.5);
  scene.add(roseLight);

  core = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.12, 0.33, 180, 24, 2, 3),
    new THREE.MeshPhysicalMaterial({
      color: 0xa78bfa,
      metalness: 0.65,
      roughness: 0.16,
      clearcoat: 1,
      emissive: 0x311068,
      emissiveIntensity: 0.5
    })
  );
  scene.add(core);

  const ringGeo = new THREE.TorusGeometry(1.85, 0.015, 12, 140);
  ringOne = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x22d3ee }));
  ringOne.rotation.set(1.1, 0.4, 0);
  scene.add(ringOne);

  ringTwo = new THREE.Mesh(
    ringGeo,
    new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.72 })
  );
  ringTwo.scale.setScalar(1.22);
  ringTwo.rotation.set(0.5, 1.3, 0);
  scene.add(ringTwo);

  const starCount = 1100;
  const pos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 15;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xe0f2fe, size: 0.02, transparent: true, opacity: 0.85 })
  );
  scene.add(stars);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  (function loop3D() {
    requestAnimationFrame(loop3D);
    core.rotation.x += 0.004;
    core.rotation.y += 0.006;
    ringOne.rotation.z += 0.002;
    ringTwo.rotation.z -= 0.0016;
    stars.rotation.y += 0.0003;

    camera.position.x += (mouseX * 0.45 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.45 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  })();
}

initHero3D();

window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

/* --------------------------------
   3. LIVE NEURAL CONSTELLATION CANVAS (STAGE 2)
-------------------------------- */
(function initNeuralStageCanvas() {
  const c = document.querySelector("#neuralFieldCanvas");
  if (!c) return;
  const ctx = c.getContext("2d");

  let w = 0, h = 0;
  const nodes = [];
  const count = 68;
  let pointer = { x: -9999, y: -9999 };

  function resize() {
    const rect = c.parentElement.getBoundingClientRect();
    w = c.width = rect.width;
    h = c.height = rect.height;
  }

  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * (w || 900),
      y: Math.random() * (h || 500),
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      r: 2 + Math.random() * 2.5
    });
  }

  c.parentElement.addEventListener("mousemove", (e) => {
    const rect = c.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx;
      a.y += a.vy;

      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;

      const dxp = pointer.x - a.x;
      const dyp = pointer.y - a.y;
      const distp = Math.hypot(dxp, dyp);
      if (distp < 150 && distp > 1) {
        a.x += dxp * 0.012;
        a.y += dyp * 0.012;
      }

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - d / 130) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = i % 3 === 0 ? "#f472b6" : i % 2 === 0 ? "#22d3ee" : "#a78bfa";
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* --------------------------------
   4. LIVE PROJECT CANVASES (PROJECT 01 & 02)
-------------------------------- */
(function initProjectCanvases() {
  const c1 = document.querySelector("#projCanvas1");
  if (c1) {
    const ctx = c1.getContext("2d");
    let t = 0;

    function fit1() {
      c1.width = c1.clientWidth;
      c1.height = c1.clientHeight;
    }
    fit1();
    window.addEventListener("resize", fit1);

    (function anim1() {
      t += 0.025;
      ctx.clearRect(0, 0, c1.width, c1.height);

      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < c1.width; gx += 40) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, c1.height); ctx.stroke();
      }
      for (let gy = 0; gy < c1.height; gy += 40) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(c1.width, gy); ctx.stroke();
      }

      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x <= c1.width; x += 6) {
        const y =
          c1.height * 0.55 +
          Math.sin(x * 0.015 + t) * 34 +
          Math.cos(x * 0.007 - t * 0.6) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= c1.width; x += 8) {
        const y = c1.height * 0.55 + Math.sin(x * 0.015 + t - 0.5) * 26;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      requestAnimationFrame(anim1);
    })();
  }

  const c2 = document.querySelector("#projCanvas2");
  if (c2) {
    const ctx = c2.getContext("2d");
    let pulse = 0;

    function fit2() {
      c2.width = c2.clientWidth;
      c2.height = c2.clientHeight;
    }
    fit2();
    window.addEventListener("resize", fit2);

    (function anim2() {
      pulse += 0.03;
      ctx.clearRect(0, 0, c2.width, c2.height);

      const cols = [0.2, 0.5, 0.8];
      const rows = [0.25, 0.5, 0.75];

      const pts = cols.map((cx, ci) =>
        rows.map((ry, ri) => ({
          x: c2.width * cx,
          y: c2.height * ry + Math.sin(pulse + ci + ri) * 8
        }))
      );

      for (let i = 0; i < pts.length - 1; i++) {
        for (const a of pts[i]) {
          for (const b of pts[i + 1]) {
            ctx.strokeStyle = "rgba(34, 211, 238, 0.25)";
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      pts.forEach((layer, li) => {
        layer.forEach((p, pi) => {
          const glow = 6 + Math.sin(pulse * 1.6 + li + pi) * 2.5;
          ctx.fillStyle = li === 1 ? "#f472b6" : "#22d3ee";
          ctx.beginPath();
          ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      requestAnimationFrame(anim2);
    })();
  }
})();

/* --------------------------------
   5. INTERACTIVE QUIZ DEMO WIDGET (PROJECT 03)
-------------------------------- */
document.querySelectorAll(".qm-opt").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".qm-opt").forEach((b) => b.classList.remove("active-opt"));
    btn.classList.add("active-opt");

    const acc = btn.getAttribute("data-acc") || "85%";
    const scoreEl = document.querySelector("#qmScore");
    const barEl = document.querySelector("#qmBar");
    if (scoreEl) scoreEl.textContent = `CONFIDENCE: ${acc}`;
    if (barEl) barEl.style.width = acc;
  });
});

/* --------------------------------
   6. SCROLL-DRIVEN GSAP MOTION
-------------------------------- */
gsap.to("#heroTitle", {
  scale: 1.22,
  y: -26,
  ease: "none",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: 1
  }
});

gsap.to("#heroBgLayer", {
  scale: 1.18,
  y: 70,
  ease: "none",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: 1
  }
});

gsap.to("#zoomFrame", {
  width: "100%",
  height: "100%",
  borderRadius: "0px",
  ease: "none",
  scrollTrigger: {
    trigger: "#stage",
    start: "top bottom",
    end: "center center",
    scrub: 1
  }
});

gsap.to(".fan-1", {
  x: -285,
  y: 10,
  rotate: -14,
  ease: "none",
  scrollTrigger: { trigger: "#fannedDeck", start: "top 85%", end: "bottom 35%", scrub: 1 }
});

gsap.to(".fan-2", {
  x: -95,
  y: -8,
  rotate: -4,
  ease: "none",
  scrollTrigger: { trigger: "#fannedDeck", start: "top 85%", end: "bottom 35%", scrub: 1 }
});

gsap.to(".fan-3", {
  x: 95,
  y: -8,
  rotate: 4,
  ease: "none",
  scrollTrigger: { trigger: "#fannedDeck", start: "top 85%", end: "bottom 35%", scrub: 1 }
});

gsap.to(".fan-4", {
  x: 285,
  y: 10,
  rotate: 14,
  ease: "none",
  scrollTrigger: { trigger: "#fannedDeck", start: "top 85%", end: "bottom 35%", scrub: 1 }
});

gsap.utils.toArray(".split-showcase").forEach((card) => {
  gsap.from(card, {
    y: 48,
    opacity: 0.45,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: { trigger: card, start: "top 85%", once: true }
  });
});

ScrollTrigger.create({
  trigger: ".stats-grid",
  start: "top 84%",
  once: true,
  onEnter: () => {
    document.querySelectorAll(".counter").forEach((el) => {
      const target = +el.getAttribute("data-target");
      gsap.to(el, {
        innerText: target,
        duration: 1.5,
        snap: { innerText: 1 },
        ease: "power2.out"
      });
    });
  }
});

/* --------------------------------
   7. SUBTLE 3D TILT ON CARDS
-------------------------------- */
if (window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-py * 6}deg) rotateY(${px * 6}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* --------------------------------
   8. TYPING EFFECT + CURSOR + MENU
-------------------------------- */
const typingEl = document.querySelector("#typing");
const roles = ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Interactive Web"];
let rIdx = 0, cIdx = 0, isDeleting = false;

function runTyping() {
  if (!typingEl) return;
  const word = roles[rIdx];
  cIdx += isDeleting ? -1 : 1;
  typingEl.textContent = word.substring(0, cIdx);

  let speed = isDeleting ? 40 : 75;
  if (!isDeleting && cIdx === word.length) {
    isDeleting = true;
    speed = 1200;
  } else if (isDeleting && cIdx === 0) {
    isDeleting = false;
    rIdx = (rIdx + 1) % roles.length;
    speed = 320;
  }
  setTimeout(runTyping, speed);
}
runTyping();

const cursor = document.querySelector("#cursor");
const dot = document.querySelector("#cursorDot");
if (window.matchMedia("(pointer: fine)").matches) {
  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (dot) {
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    }
  });
  (function loopCursor() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    if (cursor) {
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
    }
    requestAnimationFrame(loopCursor);
  })();

  document.querySelectorAll("a, button, .tilt-card").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor?.classList.add("active"));
    el.addEventListener("mouseleave", () => cursor?.classList.remove("active"));
  });
}

const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
menuToggle?.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));

function hideLoader() {
  document.querySelector("#loader")?.classList.add("hide");
}

window.addEventListener("load", () => {
  setTimeout(hideLoader, 500);
});

setTimeout(hideLoader, 2000);