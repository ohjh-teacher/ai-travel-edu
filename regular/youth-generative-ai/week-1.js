(() => {
  "use strict";
  const status = document.getElementById("copy-status");
  let hideTimer;

  function announce(message) {
    status.textContent = message;
    status.classList.add("is-visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => status.classList.remove("is-visible"), 3000);
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

  document.querySelectorAll(".copy-button[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => copyPrompt(button.dataset.copyTarget));
  });
})();
