// =============================================================
// Edit points for later phases:
// 1) Her display name + nickname text are in index.html (hero section).
// 2) Song filename is in index.html: <audio id="bgAudio" src="song.mp3">.
// 3) Replace placeholders below with your real universe notes + 50 reasons.
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

// 50 placeholder reasons to replace in later phases.
const reasons50 = Array.from(
  { length: 50 },
  (_, i) => `Reason ${i + 1}: Placeholder text for a personal memory or quality.`
);

const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function renderUniverseCards() {
  const universeStory = document.getElementById("universeStory");
  if (!universeStory) return;

  universeStory.innerHTML = universeMessages
    .map((item, index) => {
      const universeNumber = String(index + 1).padStart(2, "0");
      return `
        <article class="universe-story-card" data-index="${index}">
          <div class="universe-story-head">
            <span class="universe-icon" aria-hidden="true">${item.icon}</span>
            <h3>Universe ${universeNumber}</h3>
          </div>
          <p>${item.message}</p>
        </article>
      `;
    })
    .join("");
}

function setupUniverseStory() {
  const cards = Array.from(document.querySelectorAll(".universe-story-card"));
  const progressIndicator = document.getElementById("universeProgress");
  if (!cards.length || !progressIndicator) return;

  const totalCards = cards.length;
  let activeIndex = 0;

  const setActiveIndex = (nextIndex) => {
    const safeIndex = Math.max(0, Math.min(totalCards - 1, nextIndex));
    if (safeIndex === activeIndex) return;
    activeIndex = safeIndex;
    progressIndicator.textContent = `Universe ${activeIndex + 1}/${totalCards}`;
  };

  progressIndicator.textContent = `Universe 1/${totalCards}`;

  if (reduceMotionQuery.matches) {
    cards.forEach((card) => card.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -12% 0px" }
    );

    cards.forEach((card) => revealObserver.observe(card));
  }

  const visibilityMap = new Map(cards.map((_, index) => [index, 0]));
  const getClosestCardIndex = () => {
    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const syncProgress = () => {
    let bestIndex = -1;
    let bestRatio = 0;

    visibilityMap.forEach((ratio, index) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestIndex = index;
      }
    });

    if (bestIndex === -1 || bestRatio === 0) {
      bestIndex = getClosestCardIndex();
    }

    setActiveIndex(bestIndex);
  };

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.dataset.index);
        visibilityMap.set(index, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      syncProgress();
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-18% 0px -34% 0px" }
  );

  cards.forEach((card) => activeObserver.observe(card));
}

function renderReasons() {
  const reasonsList = document.getElementById("reasonsList");
  if (!reasonsList) return;

  reasonsList.innerHTML = reasons50.map((reason) => `<li>${reason}</li>`).join("");
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
  setupSmoothScroll();
  setupAudioToggle();
  setupPetals();
  setupStarfield();
});
