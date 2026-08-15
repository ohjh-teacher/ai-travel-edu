function placeSlidesAfter(anchor, ...slides) {
  let cursor = anchor;
  slides.forEach((slide) => {
    cursor.after(slide);
    cursor = slide;
  });
}

placeSlidesAfter(
  document.getElementById("self-overview"),
  document.getElementById("document-overview"),
  document.getElementById("career-analysis-screen")
);
placeSlidesAfter(
  document.getElementById("starTheoryTitle").closest("[data-presentation-slide]"),
  document.getElementById("achievement-screen")
);
placeSlidesAfter(
  document.getElementById("competencyTitle").closest("[data-presentation-slide]"),
  document.getElementById("job-match-screen"),
  document.getElementById("resume-screen")
);
placeSlidesAfter(
  document.getElementById("futurePlanTitle").closest("[data-presentation-slide]"),
  document.getElementById("cover-letter-screen")
);
placeSlidesAfter(
  document.getElementById("postingTitle").closest("[data-presentation-slide]"),
  document.getElementById("company-tailor-screen")
);
placeSlidesAfter(
  document.getElementById("proofreadingTitle").closest("[data-presentation-slide]"),
  document.getElementById("review-screen"),
  document.getElementById("length-screen"),
  document.getElementById("tone-screen"),
  document.getElementById("career-description-screen")
);

const presentationSlides = Array.from(document.querySelectorAll("[data-presentation-slide]"));
const presentationPrev = document.getElementById("presentationPrev");
const presentationNext = document.getElementById("presentationNext");
const presentationProgress = document.getElementById("presentationProgress");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const promptPersonas = {
  careerAnalysisPrompt: "당신은 전·현직 경찰의 취업을 돕는 커리어 코치입니다.",
  jobMatchPrompt: "당신은 경찰 경력을 보안직 역량으로 바꾸는 직무 분석가입니다.",
  resumePrompt: "당신은 성과 중심 이력서를 쓰는 채용 서류 전문가입니다.",
  coverLetterPrompt: "당신은 경찰 경험을 STAR로 구성하는 자기소개서 전문가입니다.",
  documentReviewPrompt: "당신은 채용담당자 관점의 자기소개서 첨삭 전문가입니다.",
  companyTailorPrompt: "당신은 지원 기업에 맞게 자기소개서를 다듬는 채용 컨설턴트입니다.",
  achievementPrompt: "당신은 경찰 경력에서 확인 가능한 성과를 찾는 인터뷰어입니다.",
  careerDescriptionPrompt: "당신은 경찰 경력을 기업용 경력기술서로 바꾸는 전문가입니다.",
  resumePhotoPrompt: "당신은 중장년 지원자의 전문성과 신뢰감을 표현하는 프로필 이미지 디렉터입니다.",
  fullBodyProfilePrompt: "당신은 취업 목적에 맞는 자연스럽고 전문적인 전신 프로필을 연출하는 이미지 디렉터입니다.",
  profileVariationPrompt: "당신은 인물의 정체성은 유지하면서 의상과 자세를 목적에 맞게 변형하는 이미지 디렉터입니다.",
  careerImagePrompt: "당신은 새로운 출발과 경력의 의미를 한 장의 포스터로 표현하는 비주얼 디렉터입니다.",
  songLyricsPrompt: "당신은 인생 경험과 새로운 출발을 따뜻한 노랫말로 구성하는 작사가입니다."
};
const typingDelay = 20;
const revealSelector = [
  ".theory-key-list li",
  ".theory-row-list article",
  ".theory-mapping-grid article",
  ".theory-five-grid article",
  ".theory-two-grid article",
  ".star-grid article",
  ".outcome-grid article",
  ".learning-objectives-list article",
  ".timeline li",
  ".prompt-stage-grid span",
  ".mini-steps li",
  ".finish-check label",
  ".question-grid span",
  ".lead:not(.security-lead)",
  ".security-line",
  ".theory-closing"
].join(",");

let currentPresentationIndex = 0;
let typingTimer = 0;

document.querySelectorAll(".prompt-screen pre").forEach((prompt) => {
  const persona = promptPersonas[prompt.id];
  if (persona && !prompt.textContent.startsWith(persona)) {
    prompt.textContent = `${persona}\n\n${prompt.textContent.trimStart()}`;
  }
});

presentationSlides.forEach((slide) => {
  const steps = Array.from(slide.querySelectorAll(revealSelector));
  steps.forEach((step) => {
    const isCard = step.matches("article, li, label, .prompt-stage-grid span, .question-grid span");
    step.classList.add("career-reveal-step", "is-pending");
    step.dataset.revealMode = isCard ? "card" : "type";
    if (!isCard) {
      step.dataset.fullText = step.textContent.trim();
      step.textContent = "";
    }
  });
  slide.dataset.revealIndex = "0";
});

function stopTyping(finish = false) {
  window.clearTimeout(typingTimer);
  const activeTyping = document.querySelector(".career-reveal-step.is-typing");
  if (!activeTyping) return;
  if (finish) activeTyping.textContent = activeTyping.dataset.fullText || "";
  activeTyping.classList.remove("is-typing");
  activeTyping.classList.add("is-visible");
}

function showStep(step) {
  stopTyping(true);
  step.classList.remove("is-pending");
  step.classList.add("is-visible");

  if (step.dataset.revealMode !== "type" || reduceMotion.matches) {
    if (step.dataset.fullText) step.textContent = step.dataset.fullText;
    return;
  }

  const text = step.dataset.fullText || "";
  let character = 0;
  step.textContent = "";
  step.classList.add("is-typing");

  function typeCharacter() {
    character += 1;
    step.textContent = text.slice(0, character);
    if (character < text.length) typingTimer = window.setTimeout(typeCharacter, typingDelay);
    else step.classList.remove("is-typing");
  }

  typeCharacter();
}

function revealNextStep() {
  const slide = presentationSlides[currentPresentationIndex];
  const steps = Array.from(slide.querySelectorAll(".career-reveal-step"));
  const activeTyping = slide.querySelector(".career-reveal-step.is-typing");
  if (activeTyping) {
    stopTyping(true);
    return true;
  }

  const revealIndex = Number(slide.dataset.revealIndex || 0);
  if (revealIndex >= steps.length) return false;
  showStep(steps[revealIndex]);
  slide.dataset.revealIndex = String(revealIndex + 1);
  const needsLastRowLift = Boolean(slide.querySelector(".timeline, .theory-mapping-grid"))
    && revealIndex === Math.max(0, steps.length - 2)
    && slide.dataset.lastRowLifted !== "true";
  if (needsLastRowLift) {
    slide.dataset.lastRowLifted = "true";
    window.setTimeout(() => {
      window.scrollBy({
        top: Math.min(140, window.innerHeight * 0.14),
        behavior: reduceMotion.matches ? "auto" : "smooth"
      });
    }, reduceMotion.matches ? 0 : 160);
  }
  updatePresentationControls(currentPresentationIndex);
  return true;
}

function resetSlide(slide) {
  stopTyping(false);
  slide.dataset.revealIndex = "0";
  slide.dataset.lastRowLifted = "false";
  slide.querySelectorAll(".career-reveal-step").forEach((step) => {
    step.classList.remove("is-visible", "is-typing");
    step.classList.add("is-pending");
    if (step.dataset.revealMode === "type") step.textContent = "";
  });
}

function showAllSteps(slide) {
  const steps = Array.from(slide.querySelectorAll(".career-reveal-step"));
  steps.forEach((step) => {
    if (step.dataset.fullText) step.textContent = step.dataset.fullText;
    step.classList.remove("is-pending", "is-typing");
    step.classList.add("is-visible");
  });
  slide.dataset.revealIndex = String(steps.length);
}

function updatePresentationControls(index) {
  currentPresentationIndex = Math.max(0, Math.min(index, presentationSlides.length - 1));
  const activeSlide = presentationSlides[currentPresentationIndex];
  const pendingSteps = activeSlide?.querySelectorAll(".career-reveal-step.is-pending").length || 0;

  if (presentationProgress) {
    presentationProgress.textContent = `${currentPresentationIndex + 1} / ${presentationSlides.length}`;
  }
  if (presentationPrev) presentationPrev.disabled = currentPresentationIndex === 0;
  if (presentationNext) {
    presentationNext.disabled = currentPresentationIndex === presentationSlides.length - 1 && pendingSteps === 0;
  }
}

function showPresentationSlide(index, showCompleted = false) {
  stopTyping(true);
  const nextIndex = Math.max(0, Math.min(index, presentationSlides.length - 1));
  currentPresentationIndex = nextIndex;

  presentationSlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === nextIndex;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
    if (!isActive) resetSlide(slide);
  });

  if (showCompleted) showAllSteps(presentationSlides[nextIndex]);
  const activeSlide = presentationSlides[nextIndex];
  const topbar = document.querySelector(".special-topbar");
  const topbarOffset = (topbar?.getBoundingClientRect().height || 0) + 16;
  const slideTop = window.scrollY + activeSlide.getBoundingClientRect().top - topbarOffset;
  window.scrollTo({ top: Math.max(0, slideTop), behavior: "auto" });
  history.replaceState(null, "", `#slide=${nextIndex + 1}`);
  updatePresentationControls(nextIndex);
}

function next() {
  if (revealNextStep()) return;
  showPresentationSlide(currentPresentationIndex + 1);
}

function previous() {
  if (currentPresentationIndex === 0) return;
  showPresentationSlide(currentPresentationIndex - 1, true);
}

presentationPrev?.addEventListener("click", previous);
presentationNext?.addEventListener("click", next);

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTypingTarget = target instanceof HTMLElement && (
    target.matches("input, textarea, select, button, a, pre") || target.isContentEditable
  );
  if (isTypingTarget) return;

  if (["ArrowRight", "PageDown", "Enter", " "].includes(event.key)) {
    event.preventDefault();
    next();
  } else if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
    event.preventDefault();
    previous();
  }
});

window.addEventListener("hashchange", () => {
  const match = window.location.hash.match(/slide=(\d+)/);
  if (match) showPresentationSlide(Number(match[1]) - 1);
});

if ("IntersectionObserver" in window) {
  const visibilityBySlide = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visibilityBySlide.set(entry.target, entry.intersectionRatio));
    let bestIndex = currentPresentationIndex;
    let bestRatio = 0;
    presentationSlides.forEach((slide, slideIndex) => {
      const ratio = visibilityBySlide.get(slide) || 0;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestIndex = slideIndex;
      }
    });
    if (bestRatio > 0.25 && bestIndex !== currentPresentationIndex) {
      currentPresentationIndex = bestIndex;
      updatePresentationControls(bestIndex);
    }
  }, { threshold: [0.25, 0.5, 0.75] });
  presentationSlides.forEach((slide) => observer.observe(slide));
}

const initialHash = window.location.hash.match(/slide=(\d+)/);
showPresentationSlide(initialHash ? Number(initialHash[1]) - 1 : 0);
