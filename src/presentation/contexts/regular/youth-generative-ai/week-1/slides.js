(() => {
  "use strict";
  const slides = [...document.querySelectorAll(".slide")];
  const previousButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const currentSlide = document.getElementById("currentSlide");
  const totalSlides = document.getElementById("totalSlides");
  const progressBar = document.getElementById("progressBar");
  const fullscreenButton = document.getElementById("fullscreenButton");
  const guideButton = document.getElementById("guideButton");
  const guideDialog = document.getElementById("guideDialog");
  const copyStatus = document.getElementById("copyStatus");
  const initial = Number(new URLSearchParams(location.hash.slice(1)).get("slide")) || 1;
  let index = Math.min(Math.max(initial - 1, 0), slides.length - 1);
  let touchStartX = 0;
  let hideStatusTimer;

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
    document.title = `${index + 1}/${slides.length} · 생성형 AI 활용 1주차`;
    if (updateHash) history.replaceState(null, "", `#slide=${index + 1}`);
  }

  function announce(message) {
    copyStatus.textContent = message;
    copyStatus.classList.add("is-visible");
    clearTimeout(hideStatusTimer);
    hideStatusTimer = setTimeout(() => copyStatus.classList.remove("is-visible"), 3000);
  }

  async function copyPrompt(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return announce("복사할 문장을 찾지 못했습니다.");
    const prompt = target.textContent;
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const input = document.createElement("textarea");
      input.value = prompt;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      let copied = false;
      try { copied = document.execCommand("copy"); } catch { copied = false; }
      input.remove();
      if (!copied) return announce("복사하지 못했습니다. 문장을 직접 선택해 복사해 주세요.");
    }
    announce("프롬프트 전체를 복사했습니다.");
  }

  previousButton.addEventListener("click", () => showSlide(index - 1));
  nextButton.addEventListener("click", () => showSlide(index + 1));
  fullscreenButton.addEventListener("click", async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen?.();
  });
  document.addEventListener("fullscreenchange", () => {
    fullscreenButton.textContent = document.fullscreenElement ? "전체화면 종료" : "전체화면";
  });
  guideButton.addEventListener("click", () => guideDialog.showModal());
  document.getElementById("closeGuide").addEventListener("click", () => guideDialog.close());
  document.querySelectorAll(".copy-button[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => copyPrompt(button.dataset.copyTarget));
  });
  document.addEventListener("keydown", (event) => {
    if (guideDialog.open || event.target.closest?.("button, a, input, textarea, pre")) return;
    if (["ArrowRight", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      showSlide(index + 1);
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
  document.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive:true });
  document.addEventListener("touchend", (event) => {
    if (guideDialog.open || event.target.closest?.("pre")) return;
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) < 50) return;
    showSlide(index + (distance < 0 ? 1 : -1));
  }, { passive:true });
  window.addEventListener("hashchange", () => {
    const value = Number(new URLSearchParams(location.hash.slice(1)).get("slide"));
    if (value) showSlide(value - 1, false);
  });
  showSlide(index);
})();
