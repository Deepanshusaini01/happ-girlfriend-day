/* =========================================
   SCRIPT.JS — Happy Girlfriend Day 💕
   Two-step flow:
     Step 1 → heart tap   → card appears (sealed)
     Step 2 → card tap    → letter opens
   ========================================= */

const isMobile = window.innerWidth <= 480 || ('ontouchstart' in window);

/* ------ Particle system ------ */
(function createParticles() {
  const container = document.getElementById('particles');
  const emojis = ['❤️','💕','💖','💗','💓','💞','🌸','✨','💫','🌹'];
  const colors = ['#ff69b4','#ff1493','#e91e8c','#ffb3cc','#ff8fab','#f9c74f'];
  const count  = isMobile ? 25 : 60;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    if (Math.random() > 0.5) {
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.fontSize = `${Math.random() * 16 + 8}px`;
      p.style.background = 'none';
    } else {
      const size = Math.random() * 6 + 3;
      p.style.width  = size + 'px';
      p.style.height = size + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.boxShadow  = `0 0 ${size * 2}px ${colors[Math.floor(Math.random() * colors.length)]}`;
    }
    p.style.left              = Math.random() * 100 + 'vw';
    p.style.top               = Math.random() * 100 + 'vh';
    p.style.animationDuration = (Math.random() * 12 + 8) + 's';
    p.style.animationDelay    = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
})();

/* ------ Mini floating hearts ------ */
(function createMiniHearts() {
  const container   = document.getElementById('miniHearts');
  const heartEmojis = ['❤️','💕','💖','💗','💓','🌹','🌸'];

  function spawnHeart() {
    const h = document.createElement('div');
    h.className = 'mini-heart';
    h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    h.style.left              = Math.random() * 100 + 'vw';
    h.style.bottom            = '-40px';
    h.style.fontSize          = (Math.random() * 1.2 + 0.8) + 'rem';
    h.style.animationDuration = (Math.random() * 6 + 5) + 's';
    h.style.animationDelay    = '0s';
    container.appendChild(h);
    setTimeout(() => h.remove(), 12000);
  }

  const initCount = isMobile ? 6 : 12;
  for (let i = 0; i < initCount; i++) setTimeout(spawnHeart, i * 400);
  setInterval(spawnHeart, isMobile ? 1200 : 700);
})();

/* =========================================
   STATE
   ========================================= */
let cardShown         = false;   // step 1 done (card is visible)
let letterOpen        = false;   // step 2 done (letter content visible)
let letter2Open       = false;
let closingInProgress = false;

function sendNotification(title, message, tags) {
  fetch('https://ntfy.sh/girfriendday', {
    method: 'POST',
    body: message,
    headers: {
      'Title': title,
      'Tags': tags
    }
  }).catch(err => console.log('Notification failed:', err));
}

/* =========================================
   STEP 1 — Heart tap → show card (sealed)
   ========================================= */
function showCard() {
  if (cardShown || closingInProgress) return;
  cardShown = true;

  const overlay  = document.getElementById('letterOverlay');
  const envelope = document.getElementById('envelope');
  const card     = document.getElementById('letterCard');

  // Show overlay
  overlay.classList.add('active');

  // Send Notification
  sendNotification("Happy Girlfriend Day", "She clicked the heart to view the card!", "heart,love");

  // Immediately hide envelope so it never blocks the card
  if (envelope) {
    envelope.style.opacity = '0';
    envelope.style.pointerEvents = 'none';
  }

  // Burst hearts
  createBurstHearts();

  // Card appears quickly
  setTimeout(() => {
    card.classList.add('visible');
  }, 200);
}

/* =========================================
   STEP 2 — Card tap → open letter
   ========================================= */
function openLetter() {
  if (!cardShown || letterOpen || closingInProgress) return;
  letterOpen = true;

  const tapOverlay = document.getElementById('cardTapOverlay');

  // Send Notification
  sendNotification("Letter Opened!", "She opened your first letter!", "love_letter,tada");

  // Fade out the tap-to-open overlay
  tapOverlay.classList.add('hidden');

  // Burst hearts as celebration
  createBurstHearts();

  // Animate paragraphs in one by one
  const paras = document.querySelectorAll('#letterCard .letter-para');
  paras.forEach((p, i) => {
    setTimeout(() => p.classList.add('visible'), 300 + i * 320);
  });
}

/* =========================================
   CLOSE — reset everything
   ========================================= */
function closeLetter() {
  if (closingInProgress) return;
  closingInProgress = true;

  const overlay    = document.getElementById('letterOverlay');
  const envelope   = document.getElementById('envelope');
  const card1      = document.getElementById('letterCard');
  const card2      = document.getElementById('letterCard2');
  const tapOverlay = document.getElementById('cardTapOverlay');

  // Hide both cards
  card1.classList.remove('visible');
  card2.classList.remove('visible');

  // Reset inline styles from explodeAndOpen
  card1.style.opacity    = '';
  card1.style.transform  = '';
  card1.style.transition = '';
  card1.style.animation  = '';
  card1.style.display    = '';
  card2.style.display    = 'none';

  // Restore envelope for next open
  if (envelope) {
    envelope.style.opacity      = '';
    envelope.style.pointerEvents = '';
  }

  // Reset tap overlay (restore seal for next open)
  tapOverlay.classList.remove('hidden');

  // Reset all paragraphs
  document.querySelectorAll('.letter-para, .letter-para-2')
    .forEach(p => p.classList.remove('visible'));

  // Fade out overlay
  setTimeout(() => {
    overlay.classList.remove('active');
  }, 400);

  // Full reset after animation completes
  setTimeout(() => {
    cardShown         = false;
    letterOpen        = false;
    letter2Open       = false;
    closingInProgress = false;
  }, 950);
}

/* =========================================
   EXPLOSION → LETTER 2
   ========================================= */
function explodeAndOpen() {
  if (letter2Open) return;
  letter2Open = true;

  // Send Notification
  sendNotification("Sawan Wish Opened!", "Mishu clicked 'Click me' and opened the Sawan letter!", "sparkles,moon,heart");

  const card1   = document.getElementById('letterCard');
  const card2   = document.getElementById('letterCard2');
  const expCont = document.getElementById('explosionContainer');
  const rect    = card1.getBoundingClientRect();
  const cx      = rect.left + rect.width  / 2;
  const cy      = rect.top  + rect.height / 2;

  const symbols = ['❤️','💕','💖','💗','💓','💞','🌸','🌹','✨','💫','🌙','💜'];
  const count   = isMobile ? 120 : 200;

  for (let i = 0; i < count; i++) {
    const h     = document.createElement('div');
    h.className = 'exp-heart';
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const angle = Math.random() * 2 * Math.PI;
    const dist  = Math.random() * (isMobile ? 280 : 380) + 60;
    const ex    = Math.cos(angle) * dist;
    const ey    = Math.sin(angle) * dist;
    const s0    = Math.random() * 0.5 + 0.3;
    const s1    = Math.random() * 1.2 + 0.4;
    const rot   = (Math.random() * 720 - 360) + 'deg';
    const dur   = (Math.random() * 500 + (isMobile ? 1000 : 1200)) + 'ms';
    const delay = Math.random() * 150;

    h.style.left     = cx + 'px';
    h.style.top      = cy + 'px';
    h.style.fontSize = (Math.random() * 18 + 10) + 'px';
    h.style.setProperty('--ex',  ex  + 'px');
    h.style.setProperty('--ey',  ey  + 'px');
    h.style.setProperty('--s0',  s0);
    h.style.setProperty('--s1',  s1);
    h.style.setProperty('--rot', rot);
    h.style.setProperty('--dur', dur);
    h.style.animationDelay = delay + 'ms';

    expCont.appendChild(h);
    setTimeout(() => h.remove(), parseInt(dur) + delay + 200);
  }

  // Shake card1
  card1.style.animation = 'cardShake 0.4s ease';
  if (!document.getElementById('shake-kf')) {
    const s = document.createElement('style');
    s.id = 'shake-kf';
    s.textContent = `
      @keyframes cardShake {
        0%,100%{ transform:scale(1) rotate(0deg); }
        20%    { transform:scale(1.04) rotate(-2deg); }
        40%    { transform:scale(1.06) rotate(2deg); }
        60%    { transform:scale(1.03) rotate(-1deg); }
        80%    { transform:scale(1.05) rotate(1deg); }
      }
    `;
    document.head.appendChild(s);
  }

  // Fade card1 out
  setTimeout(() => {
    card1.style.opacity    = '0';
    card1.style.transform  = 'scale(0.6)';
    card1.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  }, 350);

  // Show card2
  setTimeout(() => {
    card1.style.display = 'none';
    card2.style.display = 'flex';
    void card2.offsetWidth; // reflow
    card2.classList.add('visible');

    document.querySelectorAll('.letter-para-2').forEach((p, i) => {
      setTimeout(() => p.classList.add('visible'), 400 + i * 300);
    });
  }, 820);
}

/* =========================================
   WIRE UP HEART — both click & touchstart
   ========================================= */
const heartContainer = document.getElementById('heartContainer');

heartContainer.addEventListener('touchstart', function(e) {
  if (!cardShown && !closingInProgress) {
    e.preventDefault();
    showCard();
  }
}, { passive: false });

heartContainer.addEventListener('click', function() {
  if (!cardShown && !closingInProgress) {
    showCard();
  }
});

/* =========================================
   WIRE UP CARD TAP OVERLAY — both click & touchstart
   ========================================= */
const tapOverlay = document.getElementById('cardTapOverlay');

tapOverlay.addEventListener('touchstart', function(e) {
  e.preventDefault();
  openLetter();
}, { passive: false });

tapOverlay.addEventListener('click', function() {
  openLetter();
});

/* =========================================
   CLOSE BUTTONS — click + touchend (most reliable on iOS)
   ========================================= */
function attachCloseButtons() {
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.removeAttribute('onclick');

    function doClose(e) {
      e.stopPropagation();
      e.preventDefault();
      closeLetter();
    }

    btn.addEventListener('click',    doClose);
    btn.addEventListener('touchend', doClose, { passive: false });
  });
}
attachCloseButtons();

/* =========================================
   CLOSE ON OVERLAY BACKGROUND TAP
   ========================================= */
document.getElementById('letterOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeLetter();
});

document.getElementById('letterOverlay').addEventListener('touchmove', function(e) {
  const card1 = document.getElementById('letterCard');
  const card2 = document.getElementById('letterCard2');
  if (!card1.contains(e.target) && !card2.contains(e.target)) {
    e.preventDefault();
  }
}, { passive: false });

/* =========================================
   BURST HEARTS
   ========================================= */
function createBurstHearts() {
  const container    = document.getElementById('burstHearts');
  const heartSymbols = ['❤️','💕','💖','💗','💓','💞','✨'];
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < 24; i++) {
    const h = document.createElement('div');
    h.className = 'burst-heart';
    h.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

    const angle = Math.random() * 2 * Math.PI;
    const dist  = Math.random() * 200 + 80;
    h.style.left = cx + 'px';
    h.style.top  = cy + 'px';
    h.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
    h.style.setProperty('--dy', (Math.sin(angle) * dist) + 'px');
    h.style.animationDelay = (Math.random() * 0.3) + 's';
    h.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';

    container.appendChild(h);
    setTimeout(() => h.remove(), 2000);
  }
}

/* =========================================
   KEYBOARD SUPPORT
   ========================================= */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLetter();
  if ((e.key === 'Enter' || e.key === ' ') && !cardShown) {
    e.preventDefault();
    showCard();
  }
});

/* =========================================
   SPARKLE ON HOVER (desktop only)
   ========================================= */
if (!isMobile) {
  heartContainer.addEventListener('mousemove', (e) => {
    const rect = heartContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!document.getElementById('sparkle-keyframes')) {
      const style = document.createElement('style');
      style.id = 'sparkle-keyframes';
      style.textContent = `
        @keyframes sparkleAnim {
          0%   { transform:translate(-50%,-50%) scale(0); opacity:1; }
          50%  { transform:translate(-50%,-50%) scale(1.5); opacity:0.8; }
          100% { transform:translate(-50%,-50%) scale(0.5) translateY(-20px); opacity:0; }
        }
      `;
      document.head.appendChild(style);
    }

    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
      position:absolute; left:${x}px; top:${y}px;
      width:8px; height:8px;
      background:radial-gradient(circle,#fff,#ff69b4);
      border-radius:50%; pointer-events:none;
      transform:translate(-50%,-50%) scale(0);
      animation:sparkleAnim 0.6s ease forwards; z-index:10;
    `;
    heartContainer.style.position = 'relative';
    heartContainer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 700);
  });
}
