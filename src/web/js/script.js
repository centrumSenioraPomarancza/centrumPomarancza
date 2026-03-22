  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  const MODES = ['large-text', 'contrast', 'links', 'spacing'];

  function toggleA11yPanel() {
    document.getElementById('a11y-panel').classList.toggle('open');
  }

  function toggleA11y(mode, optId) {
    const body = document.body;
    const cls = 'a11y-' + mode;
    const isOn = body.classList.toggle(cls);
    const opt = document.getElementById(optId);
    const iconId = 'icon-' + optId.replace('opt-','');
    opt.classList.toggle('on', isOn);
    document.getElementById('icon-' + mode.replace('-',''))
      && (document.getElementById('icon-' + mode.replace('-','')).textContent = isOn ? '●' : '○');
    // save
    try { localStorage.setItem('a11y-' + mode, isOn ? '1' : '0'); } catch(e) {}
    updateIcons();
  }

  function updateIcons() {
    MODES.forEach(m => {
      const isOn = document.body.classList.contains('a11y-' + m);
      const optEl = document.getElementById('opt-' + m);
      if (optEl) optEl.classList.toggle('on', isOn);
    });
    document.getElementById('icon-largetext') && (document.getElementById('icon-largetext').textContent = document.body.classList.contains('a11y-large-text') ? '●' : '○');
    document.getElementById('icon-contrast')  && (document.getElementById('icon-contrast').textContent  = document.body.classList.contains('a11y-contrast')    ? '●' : '○');
    document.getElementById('icon-links')     && (document.getElementById('icon-links').textContent     = document.body.classList.contains('a11y-links')        ? '●' : '○');
    document.getElementById('icon-spacing')   && (document.getElementById('icon-spacing').textContent   = document.body.classList.contains('a11y-spacing')      ? '●' : '○');
  }

  function resetA11y() {
    MODES.forEach(m => {
      document.body.classList.remove('a11y-' + m);
      try { localStorage.removeItem('a11y-' + m); } catch(e) {}
    });
    updateIcons();
  }

  // Wczytaj zapisane ustawienia
  window.addEventListener('DOMContentLoaded', () => {
    MODES.forEach(m => {
      try {
        if (localStorage.getItem('a11y-' + m) === '1') {
          document.body.classList.add('a11y-' + m);
        }
      } catch(e) {}
    });
    updateIcons();
  });

  // Zamknij panel klikając poza nim
  document.addEventListener('click', e => {
    const panel = document.getElementById('a11y-panel');
    const btn   = document.querySelector('.a11y-btn');
    if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
