// =============================================================
// Edit points for later phases:
// 1) Her display name + nickname text are in index.html (hero section).
// 2) Song filename is in index.html: <audio id="bgAudio" src="song.mp3">.
// 3) Replace placeholders below with your real universe notes + 50 reasons.
// =============================================================

const universeMessages = [
  {
    title: "Universe 01",
    message: "Even in a city of endless lights, I still find home in your eyes.",
  },
  {
    title: "Universe 02",
    message: "If time ran backward, I would still walk toward you first.",
  },
  {
    title: "Universe 03",
    message: "Across quiet winters and soft summers, your laugh is still my season.",
  },
  {
    title: "Universe 04",
    message: "If we met as strangers, I would fall in love with you all over again.",
  },
  {
    title: "Universe 05",
    message: "In every stormy sky, your voice is the warm light I search for.",
  },
  {
    title: "Universe 06",
    message: "No matter the path, my heart keeps choosing your direction.",
  },
];

// 50 placeholder reasons to replace in later phases.
const reasons50 = Array.from(
  { length: 50 },
  (_, i) => `Reason ${i + 1}: Placeholder text for a personal memory or quality.`
);

const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function renderUniverseCards() {
  const universeGrid = document.getElementById("universeGrid");
  if (!universeGrid) return;

  universeGrid.innerHTML = universeMessages
    .map(
      (item) => `
        <article class="universe-card">
          <h3>${item.title}</h3>
          <p>${item.message}</p>
        </article>
      `
    )
    .join("");
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
  renderReasons();
  setupSmoothScroll();
  setupAudioToggle();
  setupPetals();
  setupStarfield();
});
