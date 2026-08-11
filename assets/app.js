document.getElementById('slides').innerHTML = window.__slideChunks.join('');
(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const deckEl = document.getElementById('deck');
  const counter = document.getElementById('slideCounter');
  const progressBar = document.getElementById('progressBar');
  const toc = document.getElementById('toc');
  const tocGrid = document.getElementById('tocGrid');
  let index = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  slides.forEach((slide, i) => {
    const item = document.createElement('div');
    item.className = 'toc-item';
    item.innerHTML = `<div class="toc-kicker">Slide ${String(i+1).padStart(2,'0')}</div><div class="toc-title">${slide.dataset.title || `슬라이드 ${i+1}`}</div>`;
    item.addEventListener('click', () => {
      goTo(i);
      closeToc();
    });
    tocGrid.appendChild(item);
  });

  function fitDeck() {
    const scale = Math.min(window.innerWidth / 1600, window.innerHeight / 900, 1);
    deckEl.style.setProperty('--deck-scale', String(scale));
  }

  function updateUI() {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    counter.textContent = `${index + 1} / ${slides.length}`;
    progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
  }

  function goTo(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    updateUI();
  }
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }
  function openToc() { toc.classList.add('open'); }
  function closeToc() { toc.classList.remove('open'); }
  function toggleToc() { toc.classList.toggle('open'); }
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (deckEl.requestFullscreen) deckEl.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  window.addEventListener('resize', fitDeck);
  fitDeck();

  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === 'ArrowRight' || key === 'PageDown' || key === ' ') {
      e.preventDefault(); next();
    } else if (key === 'ArrowLeft' || key === 'PageUp') {
      e.preventDefault(); prev();
    } else if (key === 'Home') {
      e.preventDefault(); goTo(0);
    } else if (key === 'End') {
      e.preventDefault(); goTo(slides.length - 1);
    } else if (key === 'm' || key === 'M') {
      e.preventDefault(); toggleToc();
    } else if (key === 'f' || key === 'F') {
      e.preventDefault(); toggleFullscreen();
    } else if (key === 'Escape') {
      closeToc();
    }
  });

  toc.addEventListener('click', (e) => {
    if (e.target === toc) closeToc();
  });

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive:true});

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) next();
    else prev();
  }, {passive:true});

  updateUI();
})();
