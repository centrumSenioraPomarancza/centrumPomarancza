// Palety dla makiet układu (makieta-uklad-*.html). Wejście z ?motyw=nazwa podmienia zmienne kolorów strony,
// bez parametru zostają kolory zapisane w samej makiecie. Pomarańcz zawsze zostaje głównym akcentem.
const PALETY_MAKIET = {
  domyslny: { nazwa: 'Obecna',   orange: '#f97316', orangeDk: '#ea580c', orangeMd: '#fdba74', orangeLt: '#fff7ed', heading: '#2f3640', text: '#1f2937', muted: '#6b7280', border: '#e5e7eb', bg: '#f4f2ef', szary: '#eef0f2' },
  terakota:  { nazwa: 'Terakota', orange: '#d9622b', orangeDk: '#b84d1c', orangeMd: '#e8a17e', orangeLt: '#fdf1ea', heading: '#4a3428', text: '#2e231c', muted: '#7a6a5e', border: '#eadfd4', bg: '#f8f2ec', szary: '#f4eee7' },
  granat:    { nazwa: 'Granat',   orange: '#f28c28', orangeDk: '#d9731a', orangeMd: '#f8bf85', orangeLt: '#fff4e8', heading: '#1e3a5f', text: '#1c2533', muted: '#5b6b80', border: '#dfe5ee', bg: '#f1f4f8', szary: '#e9eef5' },
  szalwia:   { nazwa: 'Szałwia',  orange: '#ee7d30', orangeDk: '#cf6519', orangeMd: '#f5b386', orangeLt: '#fef4ea', heading: '#2f4a3a', text: '#1f2b24', muted: '#63746a', border: '#dfe7dc', bg: '#f2f6f0', szary: '#e9f0e6' },
  miod:      { nazwa: 'Miód',     orange: '#e8912c', orangeDk: '#b86f12', orangeMd: '#f3c27e', orangeLt: '#fff8e8', heading: '#3d3426', text: '#2a241b', muted: '#7a6f5c', border: '#ece4d2', bg: '#fbf6ea', szary: '#f6f0e2' },
  sliwka:    { nazwa: 'Śliwka',   orange: '#f07c2a', orangeDk: '#d4641a', orangeMd: '#f6b183', orangeLt: '#fff3ea', heading: '#4b2e4f', text: '#2a1f2c', muted: '#75667a', border: '#e8e1ea', bg: '#f6f2f7', szary: '#f0ebf2' },
  morski:    { nazwa: 'Morski',   orange: '#f47b20', orangeDk: '#d4620e', orangeMd: '#f8b47c', orangeLt: '#fff2e6', heading: '#1d4e56', text: '#17282b', muted: '#5a7175', border: '#d9e5e6', bg: '#eff5f5', szary: '#e5efef' },
  grafit:    { nazwa: 'Grafit',   orange: '#ff7a1a', orangeDk: '#e2620a', orangeMd: '#ffb47a', orangeLt: '#fff3e8', heading: '#26272b', text: '#1b1c1f', muted: '#6a6b70', border: '#e4e3e0', bg: '#f5f4f1', szary: '#eceae6' },
};

(function () {
  const p = PALETY_MAKIET[new URLSearchParams(location.search).get('motyw')];
  if (!p || p === PALETY_MAKIET.domyslny) return; // „Obecna” = kolory zapisane w makiecie
  const s = document.documentElement.style;
  s.setProperty('--orange', p.orange);
  s.setProperty('--orange-dk', p.orangeDk);
  s.setProperty('--orange-md', p.orangeMd);
  s.setProperty('--orange-lt', p.orangeLt);
  s.setProperty('--heading', p.heading);
  s.setProperty('--text', p.text);
  s.setProperty('--muted', p.muted);
  s.setProperty('--border', p.border);
  s.setProperty('--bg', p.bg);
  s.setProperty('--cream', p.bg);
  s.setProperty('--gray-lt', p.szary);
})();
