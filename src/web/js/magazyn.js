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

  const OPCJE = [
    { id: 'large-text', nazwa: '🔤 Większy tekst' },
    { id: 'contrast',   nazwa: '◑ Wysoki kontrast' },
    { id: 'links',      nazwa: '🔗 Podkreśl linki' },
    { id: 'spacing',    nazwa: '↕ Większe odstępy' },
  ];
  const czytaj = id => { try { return localStorage.getItem('a11y-' + id) === '1'; } catch (e) { return false; } };
  const zapisz = (id, on) => { try { on ? localStorage.setItem('a11y-' + id, '1') : localStorage.removeItem('a11y-' + id); } catch (e) {} };

  OPCJE.forEach(o => document.body.classList.toggle('a11y-' + o.id, czytaj(o.id)));

  const przycisk = document.createElement('button');
  przycisk.className = 'a11y-btn';
  przycisk.type = 'button';
  przycisk.textContent = '♿';
  przycisk.setAttribute('aria-label', 'Opcje dostępności');
  przycisk.setAttribute('aria-expanded', 'false');

  const panel = document.createElement('div');
  panel.className = 'a11y-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Ustawienia dostępności');
  panel.innerHTML = '<h3>Dostępność</h3>' +
    OPCJE.map(o => `<button type="button" data-a11y="${o.id}" aria-pressed="${czytaj(o.id)}"><span>${o.nazwa}</span></button>`).join('') +
    '<button type="button" class="a11y-reset">↺ Przywróć domyślne</button>';

  panel.querySelectorAll('[data-a11y]').forEach(b => b.addEventListener('click', () => {
    const on = document.body.classList.toggle('a11y-' + b.dataset.a11y);
    b.setAttribute('aria-pressed', on);
    zapisz(b.dataset.a11y, on);
  }));
  panel.querySelector('.a11y-reset').addEventListener('click', () => {
    OPCJE.forEach(o => { document.body.classList.remove('a11y-' + o.id); zapisz(o.id, false); });
    panel.querySelectorAll('[data-a11y]').forEach(b => b.setAttribute('aria-pressed', 'false'));
  });
  przycisk.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    przycisk.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== przycisk) {
      panel.classList.remove('open');
      przycisk.setAttribute('aria-expanded', 'false');
    }
  });

  document.body.append(panel, przycisk);
})();
