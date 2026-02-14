// =============================================================
// Edit points for later phases:
// 1) Her display name + nickname text are in index.html (hero section).
// 2) Song filename is in index.html: <audio id="bgAudio" src="song.mp3">.
// 3) Universe messages and reasons are editable in the arrays below.
// =============================================================

const universeMessages = [
  {
    icon: "✨",
    message:
      "In a world full of noise… you were the calm I didn’t know I needed. Hi Upeksha… my soft little universe.",
  },
  {
    icon: "🌸",
    message:
      "If love was a garden, you’d be the quiet flower that blooms slowly… beautiful without asking for attention.",
  },
  {
    icon: "🌙",
    message: "In another universe, you’d still be the gentle melody I play on repeat in my heart.",
  },
  {
    icon: "🌼",
    message: "When my days feel heavy, you feel like fresh air after rain… calm, warm, steady.",
  },
  {
    icon: "🌺",
    message:
      "And if the stars rewrote our story a thousand times… I would still look for the girl who loves flowers and listens to soft songs at night. I’d still choose you, baby doll.",
  },
];

const reasons50 = [
  "Your calm energy heals me.",
  "You make chaos feel quiet.",
  "Your smile feels like spring.",
  "You’re soft but strong.",
  "You love gently.",
  "You listen like it matters.",
  "Your eyes are peaceful.",
  "You’re my comfort person.",
  "You make silence feel warm.",
  "You bloom quietly like a flower.",
  "You’re beautiful without trying.",
  "Your kindness feels rare.",
  "You’re soft-spoken but powerful.",
  "You make my heart slow down.",
  "You’re my favorite calm moment.",
  "You glow differently.",
  "You make me feel chosen.",
  "Your laugh is soft and perfect.",
  "You’re delicate but brave.",
  "You make love feel safe.",
  "You like flowers — and you are one.",
  "You make simple things magical.",
  "You’re my peaceful place.",
  "You love with sincerity.",
  "You make my world softer.",
  "You’re gentle even when you’re tired.",
  "You make me want to protect you.",
  "You feel like late-night music.",
  "You’re my favorite melody.",
  "You calm my overthinking.",
  "You’re warm without being loud.",
  "You’re my baby doll.",
  "You look prettiest when you’re happy.",
  "You bring light quietly.",
  "You’re patient.",
  "You make love feel natural.",
  "You make ordinary days feel special.",
  "You’re graceful.",
  "You care deeply.",
  "You make my heart feel safe.",
  "You’re as pretty as the flowers you love.",
  "You feel like spring mornings.",
  "You make me proud to love you.",
  "You inspire me softly.",
  "You’re gentle but unforgettable.",
  "You make my world bloom.",
  "You feel like destiny.",
  "You’re my calm in every storm.",
  "You’re my always.",
  "In every universe, I’d still choose you.",
];

const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealedReasonIndexes = new Set();
let hasCelebratedReasons = false;

function renderUniverseCards() {
  const universeStory = document.getElementById("universeStory");
  if (!universeStory) return;

  universeStory.innerHTML = universeMessages
    .map((item, index) => {
      const universeNumber = String(index + 1).padStart(2, "0");
      return `
        <button
          class="universe-story-card"
          type="button"
          data-index="${index}"
          aria-label="Universe ${universeNumber}. Tap to bring next universe card."
        >
          <div class="universe-story-head">
            <span class="universe-icon" aria-hidden="true">${item.icon}</span>
            <h3>Universe ${universeNumber}</h3>
          </div>
          <p>${item.message}</p>
        </button>
      `;
    })
    .join("");
}

function setupUniverseStory() {
  const storyContainer = document.getElementById("universeStory");
  const cards = Array.from(document.querySelectorAll(".universe-story-card"));
  const progressIndicator = document.getElementById("universeProgress");
  const dotsContainer = document.getElementById("universeProgressDots");
  if (!cards.length || !progressIndicator || !storyContainer) return;

  const totalCards = cards.length;
  let frontIndex = 0;
  const dots = [];

  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalCards; i += 1) {
      const dot = document.createElement("span");
      dot.className = "universe-progress-dot";
      if (i === 0) {
        dot.classList.add("is-active");
      }
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
  }

  const updateProgress = () => {
    progressIndicator.textContent = `Universe ${frontIndex + 1}/${totalCards}`;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === frontIndex);
    });
  };

  const applyDeckState = () => {
    cards.forEach((card, index) => {
      const relativeIndex = (index - frontIndex + totalCards) % totalCards;
      const depth = Math.min(relativeIndex, 4);
      const rotation = relativeIndex === 0 ? 0 : (relativeIndex % 2 === 0 ? 0.9 : -0.9) * depth;

      card.classList.toggle("is-front", relativeIndex === 0);
      card.style.setProperty("--stack-offset", String(depth));
      card.style.setProperty("--stack-z", String(totalCards - relativeIndex));
      card.style.setProperty("--stack-scale", String(1 - depth * 0.015));
      card.style.setProperty("--stack-y", `${depth * 10}px`);
      card.style.setProperty("--stack-rotate", `${rotation}deg`);
      card.style.setProperty("--stack-opacity", String(Math.max(0.72, 1 - depth * 0.08)));
      card.tabIndex = relativeIndex === 0 ? 0 : -1;
    });
  };

  const syncDeckHeight = () => {
    const previousHeight = storyContainer.style.getPropertyValue("--universe-deck-height");
    storyContainer.style.setProperty("--universe-deck-height", "auto");

    let tallestCardHeight = 0;

    cards.forEach((card) => {
      tallestCardHeight = Math.max(tallestCardHeight, card.offsetHeight);
    });

    const visibleDepth = Math.min(totalCards - 1, 4);
    const stackTail = visibleDepth * 10 + 10;
    const nextHeight = Math.ceil(tallestCardHeight + stackTail);

    if (Number.isFinite(nextHeight) && nextHeight > 0) {
      storyContainer.style.setProperty("--universe-deck-height", `${nextHeight}px`);
      return;
    }

    storyContainer.style.setProperty("--universe-deck-height", previousHeight || "250px");
  };

  const rotateDeck = () => {
    frontIndex = (frontIndex + 1) % totalCards;
    applyDeckState();
    updateProgress();
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("is-front")) return;
      rotateDeck();
    });

    card.addEventListener("keydown", (event) => {
      if (!card.classList.contains("is-front")) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      rotateDeck();
    });
  });

  syncDeckHeight();
  window.addEventListener("resize", syncDeckHeight, { passive: true });
  applyDeckState();
  updateProgress();
}

function updateReasonsProgress(totalCount) {
  const progressElement = document.getElementById("reasonsProgress");
  if (!progressElement) return;
  progressElement.textContent = `Revealed ${revealedReasonIndexes.size}/${totalCount}`;
}

function triggerReasonsCelebration() {
  if (hasCelebratedReasons) return;
  hasCelebratedReasons = true;

  const stage = document.getElementById("reasonsStage");
  const finalMessage = document.getElementById("reasonsFinalMessage");
  if (finalMessage) {
    finalMessage.classList.add("is-visible");
  }

  if (reduceMotionQuery.matches || !stage) return;

  const canvas = document.getElementById("reasonsCelebration");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const bounds = stage.getBoundingClientRect();
  const cssWidth = Math.max(1, Math.floor(bounds.width));
  const cssHeight = Math.max(1, Math.floor(bounds.height));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
  canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(dpr, dpr);

  const palette = ["#ffd6ea", "#f8dfff", "#fff0dc", "#ffe3f1", "#e9ddff"];
  const particleCount = Math.min(96, Math.max(56, Math.floor(cssWidth / 7)));
  const originX = cssWidth / 2;
  const originY = Math.min(cssHeight * 0.38, 220);

  const particles = Array.from({ length: particleCount }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.8 + Math.random() * 2.1;
    return {
      x: originX + (Math.random() - 0.5) * 36,
      y: originY + (Math.random() - 0.5) * 18,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.2,
      size: 1.6 + Math.random() * 2.4,
      alpha: 0.55 + Math.random() * 0.35,
      life: 70 + Math.floor(Math.random() * 28),
      color: palette[Math.floor(Math.random() * palette.length)],
    };
  });

  stage.classList.add("is-celebrating");

  const animate = () => {
    context.clearRect(0, 0, cssWidth, cssHeight);

    let activeParticles = 0;
    particles.forEach((particle) => {
      if (particle.life <= 0) return;

      activeParticles += 1;
      particle.life -= 1;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.02;
      particle.vx *= 0.992;

      const fade = Math.max(0, particle.life / 90);
      context.globalAlpha = particle.alpha * fade;
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.globalAlpha = 1;

    if (activeParticles > 0) {
      window.requestAnimationFrame(animate);
      return;
    }

    context.clearRect(0, 0, cssWidth, cssHeight);
    stage.classList.remove("is-celebrating");
  };

  window.requestAnimationFrame(animate);
}

function revealReasonCard(card, totalCount) {
  if (!card || card.classList.contains("is-revealed")) return;

  const cardIndex = Number(card.dataset.index);
  card.classList.add("is-revealed");
  card.setAttribute("aria-pressed", "true");
  card.setAttribute("aria-label", `Reason ${cardIndex + 1} revealed`);
  revealedReasonIndexes.add(cardIndex);
  updateReasonsProgress(totalCount);

  if (revealedReasonIndexes.size === totalCount) {
    triggerReasonsCelebration();
  }
}

function setupReasonsSection() {
  const reasonCards = Array.from(document.querySelectorAll(".reason-card"));
  const totalCount = reasonCards.length;
  if (!totalCount) return;

  reasonCards.forEach((card) => {
    card.addEventListener("click", () => {
      revealReasonCard(card, totalCount);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      revealReasonCard(card, totalCount);
    });
  });
}

function renderReasons() {
  const reasonsGrid = document.getElementById("reasonsGrid");
  const finalMessage = document.getElementById("reasonsFinalMessage");
  if (!reasonsGrid) return;

  hasCelebratedReasons = false;
  revealedReasonIndexes.clear();
  if (finalMessage) {
    finalMessage.classList.remove("is-visible");
  }

  reasonsGrid.innerHTML = reasons50
    .map((reason, index) => {
      const cardNo = index + 1;
      return `
        <button
          class="reason-card"
          type="button"
          data-index="${index}"
          aria-pressed="false"
          aria-label="Reveal reason ${cardNo}"
        >
          <span class="reason-card-inner">
            <span class="reason-face reason-front">💌 #${cardNo}</span>
            <span class="reason-face reason-back">${reason}</span>
          </span>
        </button>
      `;
    })
    .join("");

  updateReasonsProgress(reasons50.length);
}

function setupSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", targetId);
    });
  });
}

function setupAudioToggle() {
  const audio = document.getElementById("bgAudio");
  const toggleButton = document.getElementById("audioToggle");
  const status = document.getElementById("audioStatus");

  if (!audio || !toggleButton || !status) return;

  const setStatus = (message) => {
    status.textContent = message;
  };

  const markUnavailable = () => {
    toggleButton.disabled = true;
    toggleButton.textContent = "Song Unavailable";
    toggleButton.setAttribute("aria-label", "Background song unavailable");
    setStatus("song.mp3 not found. Add it beside index.html to enable music.");
  };

  if (!audio.getAttribute("src")) {
    markUnavailable();
    return;
  }

  toggleButton.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        toggleButton.textContent = "Pause Our Soft Song 🎧";
        toggleButton.setAttribute("aria-label", "Pause our soft song");
        setStatus("Playing softly.");
      } catch (error) {
        setStatus("Unable to play audio right now. Tap again after adding song.mp3.");
      }
    } else {
      audio.pause();
      toggleButton.textContent = "Play Our Soft Song 🎧";
      toggleButton.setAttribute("aria-label", "Play our soft song");
      setStatus("Paused.");
    }
  });

  audio.addEventListener("error", () => {
    markUnavailable();
  });
}

function setupPetals() {
  const petalField = document.getElementById("petalField");
  if (!petalField || reduceMotionQuery.matches) return;

  const totalPetals = 14;

  for (let i = 0; i < totalPetals; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";

    const left = Math.random() * 100;
    const duration = 18 + Math.random() * 18;
    const delay = Math.random() * 16;
    const drift = -70 + Math.random() * 140;
    const scale = 0.7 + Math.random() * 0.7;

    petal.style.left = `${left}%`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;
    petal.style.setProperty("--drift-x", `${drift}px`);
    petal.style.setProperty("--petal-scale", `${scale}`);

    petalField.appendChild(petal);
  }
}

function setupStarfield() {
  const canvas = document.getElementById("starfieldCanvas");
  if (!canvas) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let stars = [];
  let rafId = null;

  const makeStar = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 0.45 + Math.random() * 1.6,
    speed: 0.015 + Math.random() * 0.055,
    alpha: 0.3 + Math.random() * 0.45,
    twinkleSpeed: 0.002 + Math.random() * 0.01,
    phase: Math.random() * Math.PI * 2,
  });

  const buildStars = () => {
    const starCount = Math.max(80, Math.min(220, Math.floor((width * height) / 9000)));
    stars = Array.from({ length: starCount }, makeStar);
  };

  const drawFrame = () => {
    context.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i += 1) {
      const star = stars[i];
      star.phase += star.twinkleSpeed;
      const twinkle = 0.45 + Math.sin(star.phase) * 0.25;

      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 245, 255, ${Math.max(0.12, star.alpha * twinkle)})`;
      context.fill();

      if (!reduceMotionQuery.matches) {
        star.y += star.speed;
        if (star.y > height + 3) {
          star.y = -3;
          star.x = Math.random() * width;
        }
      }
    }

    if (!reduceMotionQuery.matches) {
      rafId = window.requestAnimationFrame(drawFrame);
    }
  };

  const resize = () => {
    const nextWidth = window.innerWidth;
    const nextHeight = window.innerHeight;

    width = Math.max(1, Math.floor(nextWidth * dpr));
    height = Math.max(1, Math.floor(nextHeight * dpr));

    canvas.width = width;
    canvas.height = height;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(dpr, dpr);

    width = nextWidth;
    height = nextHeight;

    buildStars();

    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }

    drawFrame();
  };

  const onMotionChange = () => {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    drawFrame();
  };

  window.addEventListener("resize", resize, { passive: true });
  reduceMotionQuery.addEventListener("change", onMotionChange);

  resize();
}

document.addEventListener("DOMContentLoaded", () => {
  renderUniverseCards();
  setupUniverseStory();
  renderReasons();
  setupReasonsSection();
  setupSmoothScroll();
  setupAudioToggle();
  setupPetals();
  setupStarfield();
});
