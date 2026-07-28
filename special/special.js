const toast = document.getElementById("specialToast");

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

async function copyPrompt(targetId) {
  const target = document.getElementById(targetId);
  if (!target) {
    showToast("복사할 내용을 찾지 못했습니다.");
    return;
  }

  const promptText = target.textContent.trim();

  try {
    await navigator.clipboard.writeText(promptText);
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = promptText;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }

  showToast("프롬프트를 복사했습니다.");
}

document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", () => copyPrompt(button.dataset.copyTarget));
});

const specialReviewQr = document.getElementById("specialReviewQr");
const specialReviewLink = document.getElementById("specialReviewLink");

if (specialReviewQr && specialReviewLink) {
  const reviewUrl = new URL(specialReviewLink.getAttribute("href"), window.location.href);
  specialReviewLink.href = reviewUrl.toString();
  specialReviewQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(reviewUrl.toString())}`;
}

const quizCards = Array.from(document.querySelectorAll(".ox-quiz-card"));
const quizPrevButton = document.getElementById("quizPrevButton");
const quizNextButton = document.getElementById("quizNextButton");
const quizSlideStatus = document.getElementById("quizSlideStatus");
let currentQuizIndex = 0;
let quizNavigationLocked = false;

function showQuizSlide(index) {
  currentQuizIndex = Math.max(0, Math.min(index, quizCards.length - 1));

  quizCards.forEach((card, cardIndex) => {
    const isActive = cardIndex === currentQuizIndex;
    card.classList.toggle("is-active", isActive);
    card.hidden = !isActive;
  });

  if (quizSlideStatus) {
    quizSlideStatus.textContent = `${currentQuizIndex + 1} / ${quizCards.length}`;
  }
  if (quizPrevButton) {
    quizPrevButton.disabled = currentQuizIndex === 0;
  }
  if (quizNextButton) {
    quizNextButton.disabled = currentQuizIndex === quizCards.length - 1;
  }
}

function moveQuizSlide(offset) {
  if (quizNavigationLocked) {
    return;
  }

  quizNavigationLocked = true;
  showQuizSlide(currentQuizIndex + offset);
  window.setTimeout(() => {
    quizNavigationLocked = false;
  }, 350);
}

function answerQuiz(card, choice) {
  const isCorrect = choice === card.dataset.quizAnswer;
  card.dataset.quizSelected = choice;
  card.classList.add("is-revealed");
  card.classList.toggle("is-correct", isCorrect);
  card.classList.toggle("is-incorrect", !isCorrect);

  card.querySelectorAll("[data-quiz-choice]").forEach((button) => {
    const isSelected = button.dataset.quizChoice === choice;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  const result = card.querySelector(".quiz-answer strong");
  if (result) {
    result.dataset.feedback = isCorrect ? "맞았습니다!" : "다시 생각해 보세요.";
  }
}

quizCards.forEach((card) => {
  card.querySelectorAll("[data-quiz-choice]").forEach((button) => {
    button.addEventListener("click", () => answerQuiz(card, button.dataset.quizChoice));
  });
});

quizPrevButton?.addEventListener("click", () => moveQuizSlide(-1));
quizNextButton?.addEventListener("click", () => moveQuizSlide(1));

showQuizSlide(0);
