(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const currentSlide = document.getElementById('currentSlide');
  const totalSlides = document.getElementById('totalSlides');
  const progressBar = document.getElementById('progressBar');
  const fullscreenButton = document.getElementById('fullscreenButton');
  const printButton = document.getElementById('printButton');
  let touchStartX = 0;
  let index = 0;

  const hashMatch = window.location.hash.match(/slide=(\d+)/);
  if (hashMatch) index = Math.min(Math.max(Number(hashMatch[1]) - 1, 0), slides.length - 1);

  function showSlide(nextIndex, updateHash = true) {
    index = Math.min(Math.max(nextIndex, 0), slides.length - 1);
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    currentSlide.textContent = String(index + 1);
    totalSlides.textContent = String(slides.length);
    progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
    prevButton.disabled = index === 0;
    nextButton.disabled = index === slides.length - 1;
    document.title = `${index + 1}/${slides.length} · 나도 그림동화책 작가`;
    if (updateHash) history.replaceState(null, '', `#slide=${index + 1}`);
  }

  function next() { showSlide(index + 1); }
  function previous() { showSlide(index - 1); }

  prevButton.addEventListener('click', previous);
  nextButton.addEventListener('click', next);
  printButton.addEventListener('click', () => window.print());
  fullscreenButton.addEventListener('click', async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  });

  document.addEventListener('fullscreenchange', () => {
    const active = Boolean(document.fullscreenElement);
    document.body.classList.toggle('is-fullscreen', active);
    fullscreenButton.textContent = active ? '전체화면 종료' : '전체화면';
  });

  document.addEventListener('keydown', (event) => {
    if (['ArrowRight', 'PageDown', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      next();
    } else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(event.key)) {
      event.preventDefault();
      previous();
    } else if (event.key === 'Home') {
      event.preventDefault();
      showSlide(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      showSlide(slides.length - 1);
    } else if (event.key.toLowerCase() === 'f') {
      fullscreenButton.click();
    }
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
