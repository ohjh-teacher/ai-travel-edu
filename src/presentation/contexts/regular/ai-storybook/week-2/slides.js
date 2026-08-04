(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const currentSlide = document.getElementById('currentSlide');
  const totalSlides = document.getElementById('totalSlides');
  const progressBar = document.getElementById('progressBar');
  const fullscreenButton = document.getElementById('fullscreenButton');
  const printButton = document.getElementById('printButton');
  const typingDelay = 24;
  let touchStartX = 0;
  let index = 0;
  let typingTimer = 0;

  const hashMatch = window.location.hash.match(/slide=(\d+)/);
  if (hashMatch) index = Math.min(Math.max(Number(hashMatch[1]) - 1, 0), slides.length - 1);

  slides.forEach((slide) => {
    const steps = [...slide.querySelectorAll('.reveal-step')];
    steps.forEach((step) => {
      step.dataset.fullText = step.textContent.trim();
      step.textContent = '';
      step.classList.add('is-pending');
    });
    slide.dataset.revealIndex = '0';
  });

  function stopTyping(finish = false) {
    window.clearTimeout(typingTimer);
    const activeTyping = document.querySelector('.reveal-step.is-typing');
    if (!activeTyping) return;
    if (finish) activeTyping.textContent = activeTyping.dataset.fullText;
    activeTyping.classList.remove('is-typing');
    activeTyping.classList.add('is-visible');
  }

  function typeStep(step) {
    stopTyping(true);
    const text = step.dataset.fullText;
    let character = 0;
    step.classList.remove('is-pending');
    step.classList.add('is-visible', 'is-typing');
    step.textContent = '';

    function typeCharacter() {
      character += 1;
      step.textContent = text.slice(0, character);
      if (character < text.length) typingTimer = window.setTimeout(typeCharacter, typingDelay);
      else step.classList.remove('is-typing');
    }
    typeCharacter();
  }

  function revealNext() {
    const slide = slides[index];
    const steps = [...slide.querySelectorAll('.reveal-step')];
    const revealIndex = Number(slide.dataset.revealIndex || 0);
    const activeTyping = slide.querySelector('.reveal-step.is-typing');
    if (activeTyping) {
      stopTyping(true);
      return true;
    }
    if (revealIndex >= steps.length) return false;
    typeStep(steps[revealIndex]);
    slide.dataset.revealIndex = String(revealIndex + 1);
    return true;
  }

  function resetSlide(slide) {
    stopTyping(false);
    slide.dataset.revealIndex = '0';
    slide.querySelectorAll('.reveal-step').forEach((step) => {
      step.textContent = '';
      step.classList.remove('is-visible', 'is-typing');
      step.classList.add('is-pending');
    });
  }

  function showAllSteps(slide) {
    const steps = [...slide.querySelectorAll('.reveal-step')];
    steps.forEach((step) => {
      step.textContent = step.dataset.fullText;
      step.classList.remove('is-pending', 'is-typing');
      step.classList.add('is-visible');
    });
    slide.dataset.revealIndex = String(steps.length);
  }

  function showSlide(nextIndex, updateHash = true, showCompleted = false) {
    stopTyping(true);
    index = Math.min(Math.max(nextIndex, 0), slides.length - 1);
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      if (!active) resetSlide(slide);
    });
    if (showCompleted) showAllSteps(slides[index]);
    currentSlide.textContent = String(index + 1);
    totalSlides.textContent = String(slides.length);
    progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
    prevButton.disabled = index === 0;
    nextButton.disabled = index === slides.length - 1 && !slides[index].querySelector('.reveal-step.is-pending');
    document.title = `${index + 1}/${slides.length} · 나도 그림동화책 작가 2주차`;
    if (updateHash) history.replaceState(null, '', `#slide=${index + 1}`);
  }

  function next() {
    if (revealNext()) return;
    showSlide(index + 1);
  }
  function previous() {
    if (index === 0) return;
    showSlide(index - 1, true, true);
  }

  prevButton.addEventListener('click', previous);
  nextButton.addEventListener('click', next);
  printButton.addEventListener('click', () => window.print());
  fullscreenButton.addEventListener('click', async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  });
  document.addEventListener('fullscreenchange', () => {
    const active = Boolean(document.fullscreenElement);
    document.body.classList.toggle('is-fullscreen', active);
    fullscreenButton.textContent = active ? '전체화면 종료' : '전체화면';
  });
  document.addEventListener('keydown', (event) => {
    if (['ArrowRight', 'PageDown', 'Enter', ' '].includes(event.key)) { event.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(event.key)) { event.preventDefault(); previous(); }
    else if (event.key === 'Home') { event.preventDefault(); showSlide(0); }
    else if (event.key === 'End') { event.preventDefault(); showSlide(slides.length - 1); }
    else if (event.key.toLowerCase() === 'f') fullscreenButton.click();
  });
  document.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  document.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) < 50) return;
    if (distance < 0) next(); else previous();
  }, { passive: true });
  window.addEventListener('hashchange', () => {
    const match = window.location.hash.match(/slide=(\d+)/);
    if (match) showSlide(Number(match[1]) - 1, false);
  });
  showSlide(index);
})();
