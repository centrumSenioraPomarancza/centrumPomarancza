(function () {
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('menu');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const tel = document.querySelector(".tel[data-tel]");
  if (tel && window.matchMedia("(hover: none) and (pointer: coarse)").matches) tel.href = tel.dataset.tel;

  document.querySelectorAll('main p, main li, main figcaption, main h1, main h2, main h3').forEach(el => {
    const wezly = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) wezly.push(walker.currentNode);
    wezly.forEach(n => {
      n.nodeValue = n.nodeValue
        .replace(/(?<=^|[\s(„])([aiouwzAIOUWZ]) /g, '$1 ')
        .replace(/ ([–—]|-(?=\s))/g, ' $1');
    });
    const ostatni = wezly.reverse().find(n => n.nodeValue.trim());
    if (ostatni && !/^H[1-3]$/.test(el.tagName)) ostatni.nodeValue = ostatni.nodeValue.replace(/ (\S{1,10}\s*)$/, ' $1');
  });

  const galeria = document.querySelector('.galeria');
  if (galeria && window.HTMLDialogElement) {
    const linki = [...galeria.querySelectorAll('a')];
    const okno = document.createElement('dialog');
    okno.className = 'lightbox';
    okno.setAttribute('aria-label', 'Powiększone zdjęcie');
    okno.innerHTML = '<figure><img alt=""/></figure>' +
      '<button type="button" class="lb-zamknij" aria-label="Zamknij">✕</button>' +
      '<button type="button" class="lb-strzalka lb-poprz" aria-label="Poprzednie zdjęcie">‹</button>' +
      '<button type="button" class="lb-strzalka lb-nast" aria-label="Następne zdjęcie">›</button>';
    document.body.append(okno);
    const obraz = okno.querySelector('img');
    let nr = 0;
    const pokaz = i => {
      nr = (i + linki.length) % linki.length;
      obraz.alt = linki[nr].querySelector('img').alt;
      obraz.src = linki[nr].href;
      [nr - 1, nr + 1].forEach(j => { new Image().src = linki[(j + linki.length) % linki.length].href; });
    };
    linki.forEach((a, i) => a.addEventListener('click', e => {
      e.preventDefault();
      pokaz(i);
      okno.showModal();
    }));
    okno.querySelector('.lb-poprz').addEventListener('click', () => pokaz(nr - 1));
    okno.querySelector('.lb-nast').addEventListener('click', () => pokaz(nr + 1));
    okno.querySelector('.lb-zamknij').addEventListener('click', () => okno.close());
    okno.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') pokaz(nr - 1);
      if (e.key === 'ArrowRight') pokaz(nr + 1);
    });
    okno.addEventListener('click', e => {
      if (e.target === okno || e.target.tagName === 'FIGURE') okno.close();
    });
    let startX = null;
    okno.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    okno.addEventListener('touchend', e => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) pokaz(nr + (dx < 0 ? 1 : -1));
      startX = null;
    });
    okno.addEventListener('close', () => setTimeout(() => linki[nr].focus()));
  }

  const OPCJE = [
    { id: 'large-text', ikona: '🔤', nazwa: 'Większy tekst' },
    { id: 'contrast',   ikona: '◑',  nazwa: 'Wysoki kontrast' },
    { id: 'links',      ikona: '🔗', nazwa: 'Podkreśl linki' },
    { id: 'spacing',    ikona: '↕',  nazwa: 'Większe odstępy' },
  ];
  const html = document.documentElement;
  const czytaj = id => { try { return localStorage.getItem('a11y-' + id) === '1'; } catch (e) { return false; } };
  const zapisz = (id, on) => { try { on ? localStorage.setItem('a11y-' + id, '1') : localStorage.removeItem('a11y-' + id); } catch (e) {} };

  const przycisk = document.querySelector('.a11y-btn');
  if (!przycisk) return;

  const panel = document.createElement('div');
  panel.className = 'a11y-panel';
  panel.id = 'a11y-panel';
  panel.setAttribute('role', 'group');
  panel.setAttribute('aria-labelledby', 'a11y-tytul');
  panel.innerHTML = '<p class="a11y-tytul" id="a11y-tytul">Dostępność</p>' +
    OPCJE.map(o => `<button type="button" data-a11y="${o.id}" aria-pressed="${czytaj(o.id)}"><span><span aria-hidden="true">${o.ikona}</span>${o.nazwa}</span></button>`).join('') +
    '<button type="button" class="a11y-reset"><span><span aria-hidden="true">↺</span>Przywróć domyślne</span></button>';
  przycisk.setAttribute('aria-controls', panel.id);

  const reset = panel.querySelector('.a11y-reset');
  const odswiezReset = () => { reset.disabled = !OPCJE.some(o => html.classList.contains('a11y-' + o.id)); };
  odswiezReset();

  panel.querySelectorAll('[data-a11y]').forEach(b => b.addEventListener('click', () => {
    const on = html.classList.toggle('a11y-' + b.dataset.a11y);
    b.setAttribute('aria-pressed', on);
    zapisz(b.dataset.a11y, on);
    odswiezReset();
  }));
  reset.addEventListener('click', () => {
    OPCJE.forEach(o => { html.classList.remove('a11y-' + o.id); zapisz(o.id, false); });
    panel.querySelectorAll('[data-a11y]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    odswiezReset();
    panel.querySelector('[data-a11y]').focus();
  });

  const otwarty = () => panel.classList.contains('open');
  const zamknij = (wrocNaPrzycisk) => {
    if (!otwarty()) return;
    panel.classList.remove('open');
    przycisk.setAttribute('aria-expanded', 'false');
    if (wrocNaPrzycisk) przycisk.focus();
  };
  przycisk.addEventListener('click', () => {
    if (otwarty()) { zamknij(false); return; }
    panel.classList.add('open');
    przycisk.setAttribute('aria-expanded', 'true');
    panel.querySelector('button').focus();
  });
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && !przycisk.contains(e.target)) zamknij(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && otwarty()) zamknij(true);
  });
  panel.addEventListener('focusout', e => {
    if (e.relatedTarget && !panel.contains(e.relatedTarget) && e.relatedTarget !== przycisk) zamknij(false);
  });

  przycisk.after(panel);
})();
