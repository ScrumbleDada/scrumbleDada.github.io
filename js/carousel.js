/**
 * Accessible carousel: prev/next, dots, keyboard, touch swipe, optional autoplay.
 */
class ScrumbleCarousel {
  constructor(root, options = {}) {
    this.root = root;
    this.viewport = root.querySelector(".carousel-viewport");
    this.track = root.querySelector(".carousel-track");
    this.slides = Array.from(root.querySelectorAll(".carousel-slide"));
    this.prevBtn = root.querySelector("[data-carousel-prev]");
    this.nextBtn = root.querySelector("[data-carousel-next]");
    this.dotsContainer = root.querySelector(".carousel-dots");
    this.counterEl = root.querySelector(".carousel-counter");
    this.index = 0;
    this.autoplayMs = options.autoplayMs ?? 5000;
    this.autoplayTimer = null;
    this.touchStartX = 0;
    this.touchDeltaX = 0;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (this.slides.length === 0) return;

    this.buildDots();
    this.bindEvents();
    this.goTo(0, false);
    if (!this.reducedMotion && this.autoplayMs > 0) {
      this.startAutoplay();
    }
  }

  buildDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = "";
    this.slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dot.addEventListener("click", () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
    });
    this.dots = Array.from(this.dotsContainer.querySelectorAll(".carousel-dot"));
  }

  bindEvents() {
    this.prevBtn?.addEventListener("click", () => this.prev());
    this.nextBtn?.addEventListener("click", () => this.next());

    this.root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this.next();
      }
    });

    this.viewport?.addEventListener("touchstart", (e) => {
      this.touchStartX = e.changedTouches[0].clientX;
      this.touchDeltaX = 0;
      this.pauseAutoplay();
    }, { passive: true });

    this.viewport?.addEventListener("touchmove", (e) => {
      this.touchDeltaX = e.changedTouches[0].clientX - this.touchStartX;
    }, { passive: true });

    this.viewport?.addEventListener("touchend", () => {
      const threshold = 50;
      if (this.touchDeltaX > threshold) this.prev();
      else if (this.touchDeltaX < -threshold) this.next();
      this.resumeAutoplay();
    });

    this.root.addEventListener("mouseenter", () => this.pauseAutoplay());
    this.root.addEventListener("mouseleave", () => this.resumeAutoplay());
    this.root.addEventListener("focusin", () => this.pauseAutoplay());
    this.root.addEventListener("focusout", (e) => {
      if (!this.root.contains(e.relatedTarget)) this.resumeAutoplay();
    });
  }

  updateUI() {
    const offset = -this.index * 100;
    this.track.style.transform = `translateX(${offset}%)`;
    this.dots?.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === this.index);
      dot.setAttribute("aria-current", i === this.index ? "true" : "false");
    });
    if (this.counterEl) {
      this.counterEl.textContent = `${this.index + 1} / ${this.slides.length}`;
    }
    this.slides.forEach((slide, i) => {
      slide.setAttribute("aria-hidden", i === this.index ? "false" : "true");
    });
  }

  goTo(index, animate = true) {
    const len = this.slides.length;
    this.index = ((index % len) + len) % len;
    if (!animate) {
      this.track.style.transition = "none";
      this.updateUI();
      requestAnimationFrame(() => {
        this.track.style.transition = "";
      });
    } else {
      this.updateUI();
    }
  }

  next() {
    this.goTo(this.index + 1);
  }

  prev() {
    this.goTo(this.index - 1);
  }

  startAutoplay() {
    this.pauseAutoplay();
    this.autoplayTimer = window.setInterval(() => this.next(), this.autoplayMs);
  }

  pauseAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  resumeAutoplay() {
    if (!this.reducedMotion && this.autoplayMs > 0 && !this.autoplayTimer) {
      this.startAutoplay();
    }
  }
}

async function initCarouselsFromData() {
  const heroesRoot = document.getElementById("heroes-carousel");
  const villainsRoot = document.getElementById("villains-carousel");
  if (!heroesRoot && !villainsRoot) return;

  let data;
  try {
    const res = await fetch("data/characters.json");
    data = await res.json();
  } catch (e) {
    console.error("Failed to load characters.json", e);
    return;
  }

  function fillCarousel(root, items, type) {
    const track = root.querySelector(".carousel-track");
    if (!track) return;
    track.innerHTML = "";
    items.forEach((char) => {
      const slide = document.createElement("div");
      slide.className = "carousel-slide";
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      const img = document.createElement("img");
      img.src = char.image;
      img.alt = char.name;
      img.width = 220;
      img.height = 220;
      img.loading = "lazy";
      const name = document.createElement("p");
      name.className = "carousel-name";
      name.textContent = char.name;
      slide.appendChild(img);
      slide.appendChild(name);
      track.appendChild(slide);
    });
    return new ScrumbleCarousel(root, { autoplayMs: 5000 });
  }

  if (heroesRoot && data.heroes) fillCarousel(heroesRoot, data.heroes, "hero");
  if (villainsRoot && data.villains) fillCarousel(villainsRoot, data.villains, "villain");
}
