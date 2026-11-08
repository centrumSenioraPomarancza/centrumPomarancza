// Wersja „Magazyn”: menu na telefonie i panel dostępności (budowany tutaj, żeby nie powtarzać go w każdym pliku).
// Ustawienia dostępności są pamiętane w localStorage i działają na wszystkich podstronach.
(function () {
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('menu');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // „Zadzwoń do nas”: na komputerze prowadzi do strony Kontakt, na telefonie od razu wybiera numer.
  const tel = document.querySelector(".tel[data-tel]");
  if (tel && window.matchMedia("(hover: none) and (pointer: coarse)").matches) tel.href = tel.dataset.tel;

  // Typografia: jednoliterowe spójniki („w”, „z”, „i”…) i myślnik nie zostają na końcu wiersza,
  // a ostatnie słowo akapitu nie ląduje samotnie w nowej linii (twarde spacje zamiast zwykłych).
  document.querySelectorAll('main p, main li, main figcaption, main h1, main h2, main h3').forEach(el => {
    const wezly = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) wezly.push(walker.currentNode);
    wezly.forEach(n => {
      n.nodeValue = n.nodeValue
        .replace(/(?<=^|[\s(„])([aiouwzAIOUWZ]) /g, '$1 ')
        .replace(/ ([–—]|-(?=\s))/g, ' $1');
    });
    // sklejamy tylko w tekście (nie w nagłówkach - tam działa text-wrap: balance) i tylko krótkie ostatnie słowo,
    // inaczej na telefonie powstaje za szeroki, nierozerwalny kawałek i strona wychodzi poza ekran
    const ostatni = wezly.reverse().find(n => n.nodeValue.trim());
    if (ostatni && !/^H[1-3]$/.test(el.tagName)) ostatni.nodeValue = ostatni.nodeValue.replace(/ (\S{1,10}\s*)$/, ' $1');
  });

  // Opcje dostępności. Klasy a11y-* trafiają na <html>; przy wczytaniu ustawia je już skrypt w <head>
  // każdej strony (bez mignięcia wersji domyślnej), tutaj tylko je przełączamy.
  const OPCJE = [
    { id: 'large-text', ikona: '🔤', nazwa: 'Większy tekst' },
    { id: 'contrast',   ikona: '◑',  nazwa: 'Wysoki kontrast' },
    { id: 'links',      ikona: '🔗', nazwa: 'Podkreśl linki' },
    { id: 'spacing',    ikona: '↕',  nazwa: 'Większe odstępy' },
  ];
  const html = document.documentElement;
  const czytaj = id => { try { return localStorage.getItem('a11y-' + id) === '1'; } catch (e) { return false; } };
  const zapisz = (id, on) => { try { on ? localStorage.setItem('a11y-' + id, '1') : localStorage.removeItem('a11y-' + id); } catch (e) {} };

  OPCJE.forEach(o => html.classList.toggle('a11y-' + o.id, czytaj(o.id)));

  // ikona „dostępność” (postać z rozłożonymi rękami) – ta sama co w HTML nagłówka
  const IKONA = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="4.2" r="2.2"/><path d="M3.6 8.3c.1-.6.7-1 1.3-.9 2.4.5 4.7.8 7.1.8s4.7-.3 7.1-.8c.6-.1 1.2.3 1.3.9.1.6-.3 1.1-.9 1.3-1.8.4-3.7.7-5.6.8v3.4l1.9 7.4c.2.7-.2 1.3-.9 1.5-.6.1-1.2-.2-1.4-.8L12 15.6l-1.5 6.3c-.2.6-.8.9-1.4.8-.7-.2-1.1-.8-.9-1.5l1.9-7.4v-3.4c-1.9-.1-3.8-.4-5.6-.8-.6-.2-1-.7-.9-1.3z"/></svg>';

  // przycisk jest już w HTML nagłówka, żeby nagłówek nie przesuwał się po wczytaniu skryptu
  let przycisk = document.querySelector('.a11y-btn');
  if (!przycisk) {
    przycisk = document.createElement('button');
    przycisk.className = 'a11y-btn';
    przycisk.type = 'button';
    przycisk.innerHTML = IKONA;
    przycisk.setAttribute('aria-label', 'Opcje dostępności');
    przycisk.setAttribute('aria-expanded', 'false');
    (document.querySelector('.site-header .wrap') || document.body).append(przycisk);
  }

  // Panel = zwykłe rozwijane menu (nie okno dialogowe): wstawione zaraz za przyciskiem, więc Tab
  // przechodzi z przycisku prosto do opcji; Esc zamyka i wraca na przycisk.
  const panel = document.createElement('div');
  panel.className = 'a11y-panel';
  panel.id = 'a11y-panel';
  panel.setAttribute('role', 'group');
  panel.setAttribute('aria-labelledby', 'a11y-tytul');
  panel.innerHTML = '<h3 id="a11y-tytul">Dostępność</h3>' +
    OPCJE.map(o => `<button type="button" data-a11y="${o.id}" aria-pressed="${czytaj(o.id)}"><span><span aria-hidden="true">${o.ikona}</span>${o.nazwa}</span></button>`).join('') +
    '<button type="button" class="a11y-reset"><span><span aria-hidden="true">↺</span>Przywróć domyślne</span></button>';
  przycisk.setAttribute('aria-controls', panel.id);

  // „Przywróć domyślne” jest aktywny tylko wtedy, gdy któraś opcja jest włączona
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
    // wyłączony przycisk traci fokus – przenosimy go na pierwszą opcję, żeby klawiatura nie „zgubiła się”
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
  // klik poza panelem (contains – bo klik może trafić w ikonę SVG wewnątrz przycisku)
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && !przycisk.contains(e.target)) zamknij(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && otwarty()) zamknij(true);
  });
  // fokus wyszedł z panelu klawiaturą (Tab za ostatnią opcję / Shift+Tab przed pierwszą) – zamykamy
  panel.addEventListener('focusout', e => {
    if (e.relatedTarget && !panel.contains(e.relatedTarget) && e.relatedTarget !== przycisk) zamknij(false);
  });

  przycisk.after(panel);
})();
