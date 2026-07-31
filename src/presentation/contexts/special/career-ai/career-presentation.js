const presentationSlides = Array.from(document.querySelectorAll("[data-presentation-slide]"));
const presentationPrev = document.getElementById("presentationPrev");
const presentationNext = document.getElementById("presentationNext");
const presentationProgress = document.getElementById("presentationProgress");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let currentPresentationIndex = 0;

function updatePresentationControls(index) {
  currentPresentationIndex = Math.max(0, Math.min(index, presentationSlides.length - 1));

  if (presentationProgress) {
    presentationProgress.textContent = `${currentPresentationIndex + 1} / ${presentationSlides.length}`;
  }
  if (presentationPrev) {
    presentationPrev.disabled = currentPresentationIndex === 0;
  }
  if (presentationNext) {
    presentationNext.disabled = currentPresentationIndex === presentationSlides.length - 1;
  }
}

function showPresentationSlide(index) {
  const nextIndex = Math.max(0, Math.min(index, presentationSlides.length - 1));
  const slide = presentationSlides[nextIndex];

  if (!slide) {
    return;
  }

  updatePresentationControls(nextIndex);
  slide.scrollIntoView({
    behavior: reduceMotion.matches ? "auto" : "smooth",
    block: "start"
  });
}

presentationPrev?.addEventListener("click", () => showPresentationSlide(currentPresentationIndex - 1));
presentationNext?.addEventListener("click", () => showPresentationSlide(currentPresentationIndex + 1));

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLElement && (
    target.matches("input, textarea, select, button, a, pre") ||
    target.isContentEditable
  );

  if (isTyping) {
    return;
  }

  if (["ArrowRight", "PageDown"].includes(event.key)) {
    event.preventDefault();
    showPresentationSlide(currentPresentationIndex + 1);
  }
  if (["ArrowLeft", "PageUp"].includes(event.key)) {
    event.preventDefault();
    showPresentationSlide(currentPresentationIndex - 1);
  }
});

if ("IntersectionObserver" in window && presentationSlides.length) {
  const visibilityBySlide = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visibilityBySlide.set(entry.target, entry.intersectionRatio));

    let bestIndex = currentPresentationIndex;
    let bestRatio = 0;

    presentationSlides.forEach((slide, index) => {
      const ratio = visibilityBySlide.get(slide) || 0;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestIndex = index;
      }
    });

    if (bestRatio > 0.2) {
      updatePresentationControls(bestIndex);
    }
  }, {
    rootMargin: "-15% 0px -35% 0px",
    threshold: [0.2, 0.4, 0.6, 0.8]
  });

  presentationSlides.forEach((slide) => observer.observe(slide));
}

updatePresentationControls(0);
