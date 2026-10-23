  // Makiety kolorystyczne: wejście z ?motyw=nazwa (np. index.html?motyw=granat) włącza
  // paletę z css/motywy.css oraz pływający panel 🎨 do przełączania palet jednym kliknięciem.
  // Wybór jest pamiętany do końca sesji (działa po przejściu na inne podstrony).
  // Na stronach z <body data-makiety> (na razie strona główna) panel jest dostępny zawsze, zwinięty.
  // Na pozostałych stronach bez parametru i bez wybranej palety odwiedzający nie widzą ani panelu, ani zmian.
  // W podglądach (iframe) nie zapisujemy i nie pokazujemy panelu, żeby makiety sobie nie przeszkadzały.
  const MOTYWY = [
    { id: 'domyslny', nazwa: 'Obecna',   kolory: ['#f97316', '#d6dadf', '#2f3640'] },
    { id: 'terakota', nazwa: 'Terakota', kolory: ['#d9622b', '#ece3d9', '#4a3428'] },
    { id: 'granat',   nazwa: 'Granat',   kolory: ['#f28c28', '#dde4ee', '#1e3a5f'] },
    { id: 'szalwia',  nazwa: 'Szałwia',  kolory: ['#ee7d30', '#dde7da', '#2f4a3a'] },
    { id: 'zielen',   nazwa: 'Zieleń',   kolory: ['#f97316', '#cfe5d3', '#1f5135'] },
    { id: 'miod',     nazwa: 'Miód',     kolory: ['#e8912c', '#efe7d3', '#3d3426'] },
    { id: 'sliwka',   nazwa: 'Śliwka',   kolory: ['#f07c2a', '#e6dfe9', '#4b2e4f'] },
  ];

  (function () {
    const wPodgladzie = window !== window.top;
    const zAdresu = new URLSearchParams(location.search).get('motyw');
    let motyw = zAdresu;
    try {
      if (motyw) { if (!wPodgladzie) sessionStorage.setItem('motyw', motyw); }
      else motyw = sessionStorage.getItem('motyw');
    } catch (e) {}
    const panelZawsze = document.body.hasAttribute('data-makiety');
    if (!motyw && !panelZawsze) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../css/motywy.css'; // skrypt używa już tylko stara wersja strony (stara/)
    document.head.appendChild(link);
    if (motyw) ustawMotyw(motyw);
    if (!wPodgladzie) zbudujPanelMotywow(!!zAdresu);
  })();

  function ustawMotyw(id) {
    if (id === 'domyslny') delete document.documentElement.dataset.motyw;
    else document.documentElement.dataset.motyw = id;
  }

  function wybierzMotyw(id) {
    ustawMotyw(id);
    try { sessionStorage.setItem('motyw', id); } catch (e) {}
    const url = new URL(location.href);
    url.searchParams.set('motyw', id);
    history.replaceState(null, '', url);
    document.querySelectorAll('.motyw-opcja').forEach(b => b.classList.toggle('on', b.dataset.motyw === id));
  }

  function zakonczMakiety() {
    try { sessionStorage.removeItem('motyw'); } catch (e) {}
    const url = new URL(location.href);
    url.searchParams.delete('motyw');
    location.replace(url);
  }

  function zbudujPanelMotywow(otwarty) {
    const aktywny = document.documentElement.dataset.motyw || 'domyslny';
    const panel = document.createElement('div');
    panel.className = 'motyw-panel' + (otwarty ? ' open' : '');
    panel.innerHTML = `
      <button class="motyw-toggle" type="button" aria-label="Makiety kolorystyczne" title="Makiety kolorystyczne">🎨</button>
      <div class="motyw-body">
        <div class="motyw-title">Makiety kolorystyczne</div>
        ${MOTYWY.map(m => `
          <button type="button" class="motyw-opcja${m.id === aktywny ? ' on' : ''}" data-motyw="${m.id}">
            <span class="motyw-kropki">${m.kolory.map(k => `<span style="background:${k}"></span>`).join('')}</span>
            ${m.nazwa}
          </button>`).join('')}
        <button type="button" class="motyw-koniec">✕ Zakończ podgląd</button>
      </div>`;
    panel.querySelector('.motyw-toggle').addEventListener('click', () => panel.classList.toggle('open'));
    panel.querySelectorAll('.motyw-opcja').forEach(b => b.addEventListener('click', () => wybierzMotyw(b.dataset.motyw)));
    panel.querySelector('.motyw-koniec').addEventListener('click', zakonczMakiety);
    document.body.appendChild(panel);
  }

  function toggleMenu() {
    const links = document.getElementById('nav-links');
    const btn = document.getElementById('menu-toggler');
    const isOpen = links.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function closeMenu() {
    const links = document.getElementById('nav-links');
    const btn = document.getElementById('menu-toggler');
    links.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('click', e => {
    const links = document.getElementById('nav-links');
    const btn = document.getElementById('menu-toggler');
    if (links && links.classList.contains('open') && !links.contains(e.target) && !btn.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });

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
