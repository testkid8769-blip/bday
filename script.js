/***********************
 GLOBALS
************************/
let current = 0;
const screens = document.querySelectorAll(".screen");
const birthdayName = "Wifey"; // 🔁 CHANGE NAME
const birthYear = 2008;       // 🔁 CHANGE YEAR

/***********************
 COUNTDOWN
************************/
const timer = document.getElementById("timer");
const target = new Date("January 12, 2026 00:00:00").getTime();
let countdownInterval = null;

function startCountdown() {
  countdownInterval = setInterval(() => {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      goToBirthday();
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    timer.textContent = `${d}d ${h}h ${m}m ${s}s`;
  }, 1000);
}

startCountdown();

function skipCountdown() {
  clearInterval(countdownInterval);
  goToBirthday();
}

/***********************
 NAVIGATION
************************/
function next() {
  // If current screen is calendar, show ILYSM
  if (screens[current].querySelector(".calendar")) {
    showILSYSMMessage();
  }

  screens[current].classList.remove("active");
  current++;

  if (current >= screens.length) return;

  screens[current].classList.add("active");

  if (screens[current].classList.contains("birthday")) {
    startConfetti();
    requestAnimationFrame(() => requestAnimationFrame(revealNameAndAge));
  }
}

// ILYSM message function
function showILSYSMMessage() {
  const msg = document.createElement("div");
  msg.textContent = "ILYSM 💖";
  msg.style.position = "fixed";
  msg.style.top = "50%";
  msg.style.left = "50%";
  msg.style.transform = "translate(-50%, -50%)";
  msg.style.background = "#ff8ab5";
  msg.style.color = "white";
  msg.style.fontSize = "28px";
  msg.style.padding = "15px 30px";
  msg.style.borderRadius = "25px";
  msg.style.zIndex = 9999;
  msg.style.opacity = 0;
  msg.style.transition = "0.5s";

  document.body.appendChild(msg);

  requestAnimationFrame(() => {
    msg.style.opacity = 1;
  });

  setTimeout(() => {
    msg.style.opacity = 0;
    setTimeout(() => msg.remove(), 500);
  }, 2000);
}


/***********************
 GO TO BIRTHDAY SCREEN
************************/
function goToBirthday() {
  screens[current].classList.remove("active");
  current = 1; // birthday screen
  const birthdayScreen = screens[current];
  birthdayScreen.classList.add("active");

  startConfetti();
  startFireworks();
  requestAnimationFrame(() => requestAnimationFrame(revealNameAndAge));
}

/***********************
 MUSIC + HEART REACT + HINT
************************/
const audios = document.querySelectorAll("audio");
let audioCtx, analyser, dataArray;

function playSong(index) {
  audios.forEach(a => {
    a.pause();
    a.currentTime = 0;
  });

  const audio = audios[index];
  audio.play();

  // Show a temporary hint when song is played
  showSongHint(`Playing 🎵: ${document.querySelectorAll(".song strong")[index].textContent}`);

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }
}

// Temporary song hint
function showSongHint(msg) {
  let hint = document.createElement("div");
  hint.textContent = msg;
  hint.style.position = "fixed";
  hint.style.bottom = "80px";
  hint.style.left = "50%";
  hint.style.transform = "translateX(-50%)";
  hint.style.background = "#ff8ab5";
  hint.style.color = "white";
  hint.style.padding = "10px 20px";
  hint.style.borderRadius = "20px";
  hint.style.fontSize = "14px";
  hint.style.zIndex = 9999;
  hint.style.opacity = 0;
  hint.style.transition = "0.4s";

  document.body.appendChild(hint);

  requestAnimationFrame(() => {
    hint.style.opacity = 1;
  });

  setTimeout(() => {
    hint.style.opacity = 0;
    setTimeout(() => hint.remove(), 400);
  }, 2000);
}

/***********************
 FLOATING HEARTS
************************/
const heartsContainer = document.querySelector(".hearts");

function createHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.opacity = Math.random();
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 8000);
}

setInterval(createHeart, 300);

/***********************
 HEARTS BEAT
************************/
function pulseHearts() {
  if (analyser) {
    analyser.getByteFrequencyData(dataArray);
    const bass = dataArray.slice(0, 12).reduce((a, b) => a + b, 0) / 12;

    document.querySelectorAll(".heart").forEach(heart => {
      heart.style.transform = `scale(${1 + bass / 400}) rotate(45deg)`;
    });
  }
  requestAnimationFrame(pulseHearts);
}

pulseHearts();

/***********************
 CONFETTI
************************/
let canvas, ctx, confettiPieces = [];

function startConfetti() {
  canvas = document.getElementById("confetti");
  if (!canvas) return;

  ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  confettiPieces = [];

  for (let i = 0; i < 160; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 6 + 4,
      c: `hsl(${Math.random() * 360},100%,70%)`,
      v: Math.random() * 3 + 2
    });
  }

  animateConfetti();
}

function animateConfetti() {
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach(p => {
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    p.y += p.v;
    if (p.y > canvas.height) p.y = -p.r;
  });

  requestAnimationFrame(animateConfetti);
}

/***********************
 FIREWORKS
************************/
let fireworksCanvas, fireworksCtx, fireworksParticles = [];

function startFireworks() {
  fireworksCanvas = document.getElementById("fireworks");
  if (!fireworksCanvas) {
    fireworksCanvas = document.createElement("canvas");
    fireworksCanvas.id = "fireworks";
    document.body.appendChild(fireworksCanvas);
  }

  fireworksCtx = fireworksCanvas.getContext("2d");
  fireworksCanvas.width = innerWidth;
  fireworksCanvas.height = innerHeight;
  fireworksParticles = [];

  animateFireworks();
}

function animateFireworks() {
  if (!fireworksCtx) return;
  fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

  // Randomly spawn fireworks
  if (Math.random() < 0.05) spawnFirework();

  fireworksParticles.forEach((p, i) => {
    p.vx *= 0.98; // friction
    p.vy += 0.08; // gravity
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.01;
    if (p.alpha <= 0) fireworksParticles.splice(i, 1);

    fireworksCtx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.alpha})`;
    fireworksCtx.beginPath();
    fireworksCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fireworksCtx.fill();
  });

  requestAnimationFrame(animateFireworks);
}

function spawnFirework() {
  const x = Math.random() * fireworksCanvas.width;
  const y = Math.random() * fireworksCanvas.height / 2;
  const colors = [
    [255, 111, 165],
    [255, 200, 200],
    [255, 255, 111],
    [111, 255, 200],
  ];

  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    fireworksParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: color[0],
      g: color[1],
      b: color[2],
      alpha: 1,
      size: Math.random() * 3 + 1
    });
  }
}

/***********************
 ENVELOPE
************************/
function openEnvelope() {
  document.querySelector(".envelope").classList.toggle("open");
}

/***********************
 NAME + AGE REVEAL
************************/
function revealNameAndAge() {
  const nameEl = document.getElementById("nameReveal");
  const ageEl = document.getElementById("ageReveal");
  if (!nameEl || !ageEl) return;

  nameEl.innerHTML = "";
  nameEl.style.opacity = 1;
  [...birthdayName].forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.className = "letter-span";
    span.style.animationDelay = `${i * 0.15}s`;
    nameEl.appendChild(span);
  });

  const finalAge = new Date().getFullYear() - birthYear;
  let currentAge = 1;
  ageEl.style.opacity = 1;

  const interval = setInterval(() => {
    ageEl.textContent = `You are now ${currentAge} 💖`;
    currentAge++;
    if (currentAge > finalAge) clearInterval(interval);
  }, 200);
}

/***********************
 CAKE CUTTING
************************/
function initCakeCutting() {
  const cake = document.querySelector(".cake-container .cake");
  if (!cake) return;

  const dragLine = cake.querySelector(".drag-line");

  dragLine.addEventListener("click", () => {
    dragLine.textContent = "🎉 Cake Cut! 🎉";
    dragLine.style.color = "#ff6fa5";
    startFireworks();
  });
}

/***********************
 SEND BIRTHDAY KISSES + ILYSM MESSAGE
************************/
const sendKissesBtn = document.getElementById("sendKissesBtn");

function createKiss() {
  const kiss = document.createElement("div");
  kiss.className = "kiss";
  kiss.innerHTML = "💋";
  kiss.style.left = Math.random() * (window.innerWidth - 30) + "px";
  kiss.style.top = "-40px";
  document.body.appendChild(kiss);

  setTimeout(() => kiss.remove(), 3000);
}

function showILysm() {
  const message = document.createElement("div");
  message.textContent = "I LYSM 💖";
  message.style.position = "fixed";
  message.style.top = "50%";
  message.style.left = "50%";
  message.style.transform = "translate(-50%, -50%)";
  message.style.fontFamily = "'Pacifico', cursive";
  message.style.fontSize = "40px";
  message.style.color = "#ff6fa5";
  message.style.background = "rgba(255,255,255,0.8)";
  message.style.padding = "20px 40px";
  message.style.borderRadius = "20px";
  message.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
  message.style.zIndex = 99999;
  message.style.opacity = 0;
  message.style.transition = "0.5s";

  document.body.appendChild(message);

  // Fade in
  requestAnimationFrame(() => {
    message.style.opacity = 1;
  });

  // Fade out after 2.5 seconds
  setTimeout(() => {
    message.style.opacity = 0;
    setTimeout(() => message.remove(), 500);
  }, 2500);
}

if (sendKissesBtn) {
  sendKissesBtn.addEventListener("click", () => {
    for (let i = 0; i < 20; i++) {
      setTimeout(createKiss, i * 150);
    }
    showILysm(); // Show ILYSM message
  });
}
