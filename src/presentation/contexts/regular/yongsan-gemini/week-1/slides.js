(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const previousButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const currentSlide = document.getElementById("currentSlide");
  const totalSlides = document.getElementById("totalSlides");
  const progressBar = document.getElementById("progressBar");
  const fullscreenButton = document.getElementById("fullscreenButton");
  const initial = Number(new URLSearchParams(location.hash.slice(1)).get("slide")) || 1;
  let index = Math.min(Math.max(initial - 1, 0), slides.length - 1);
  let touchStartX = 0;

  function showSlide(nextIndex, updateHash = true) {
    index = Math.min(Math.max(nextIndex, 0), slides.length - 1);
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    currentSlide.textContent = String(index + 1);
    totalSlides.textContent = String(slides.length);
    progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
    previousButton.disabled = index === 0;
    nextButton.disabled = index === slides.length - 1;
    document.title = `${index + 1}/${slides.length} · Gemini 생성형 AI 놀이터 1주차`;
    if (updateHash) history.replaceState(null, "", `#slide=${index + 1}`);
  }

  function advance() {
    const nextStep = slides[index].querySelector(".reveal-step:not(.is-revealed)");
    if (nextStep) {
      nextStep.classList.add("is-revealed");
      return;
    }
    showSlide(index + 1);
  }

  previousButton.addEventListener("click", () => showSlide(index - 1));
  nextButton.addEventListener("click", advance);
  fullscreenButton.addEventListener("click", async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen?.();
  });
  document.addEventListener("fullscreenchange", () => {
    fullscreenButton.textContent = document.fullscreenElement ? "전체화면 종료" : "전체화면";
  });
  document.addEventListener("keydown", (event) => {
    if (["ArrowRight", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      advance();
    } else if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
      event.preventDefault();
      showSlide(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      showSlide(0);
    } else if (event.key === "End") {
      event.preventDefault();
      showSlide(slides.length - 1);
    }
  });
  document.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive:true });
  document.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) < 50) return;
    if (distance < 0) advance();
    else showSlide(index - 1);
  }, { passive:true });
  window.addEventListener("hashchange", () => {
    const value = Number(new URLSearchParams(location.hash.slice(1)).get("slide"));
    if (value) showSlide(value - 1, false);
  });
  showSlide(index);
})();
