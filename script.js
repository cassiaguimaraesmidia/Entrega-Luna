document.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('weddingMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicStatus = document.getElementById('musicStatus');
  const musicIcon = document.getElementById('musicIcon');

  const updateMusicState = (playing) => {
    musicToggle.classList.toggle('is-playing', playing);
    musicToggle.setAttribute('aria-pressed', String(playing));
    musicToggle.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproduzir música');
    musicStatus.textContent = playing ? 'Nossa trilha está tocando' : 'Ouvir nossa trilha';
    musicIcon.textContent = playing ? 'Ⅱ' : '▶';
  };

  async function startMusic() {
    try {
      await music.play();
      updateMusicState(true);
      return true;
    } catch (error) {
      // Navegadores como Safari no iPhone podem bloquear autoplay com som.
      updateMusicState(false);
      musicStatus.textContent = 'Toque para ouvir a música';
      return false;
    }
  }

  // Tenta iniciar assim que a página é aberta. Se o navegador bloquear,
  // o controle fixo permanece disponível para iniciar com um toque.
  startMusic();

  musicToggle.addEventListener('click', async () => {
    if (music.paused) {
      await startMusic();
    } else {
      music.pause();
      updateMusicState(false);
    }
  });
  music.addEventListener('pause', () => updateMusicState(false));
  music.addEventListener('play', () => updateMusicState(true));
  music.addEventListener('error', () => {
    updateMusicState(false);
    musicStatus.textContent = 'Música indisponível';
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  let lastFocused = null;

  function openLightbox(src, trigger) {
    lastFocused = trigger;
    lightboxImage.src = src;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  document.querySelectorAll('.photo-card[data-image]').forEach((button) => {
    button.addEventListener('click', () => openLightbox(button.dataset.image, button));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
});
