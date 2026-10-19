/* Pandino icon-first sidebar mockup — vanilla JS, no build step. */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const ms = (n, cls = '') => `<span class="ms ${cls}">${n}</span>`;

/* ---------- Data ---------- */
const GROUPS = [
  { id: 'pages',    icon: 'account_tree',           label: 'Pages',    title: 'Pages & Layers' },
  { id: 'style',    icon: 'palette',                label: 'Style',    title: 'Brand & Styling' },
  { id: 'hero',     icon: 'auto_stories',           label: 'Hero',     title: 'Hook & Story', count: 3 },
  { id: 'pains',    icon: 'sentiment_dissatisfied', label: 'Pains',    title: 'Pains & Problems', count: 1 },
  { id: 'services', icon: 'construction',           label: 'Services', title: 'Solutions & Services', count: 2 },
  { id: 'trust',    icon: 'verified',               label: 'Trust',    title: 'Trust & Proof', count: 2 },
  { id: 'convert',  icon: 'ads_click',              label: 'Convert',  title: 'Conversion', count: 4 },
  { id: 'footer',   icon: 'call_to_action',         label: 'Footer',   title: 'Footer & Library', count: 1 },
];
const FONTS = [
  { id: 'modern',   name: 'Modern',   h: 'Syne',              b: 'Manrope' },
  { id: 'premium',  name: 'Premium',  h: 'DM Serif Display',  b: 'Manrope' },
  { id: 'bold',     name: 'Bold',     h: 'Montserrat',        b: 'Inter' },
  { id: 'elegant',  name: 'Elegant',  h: 'Playfair Display',  b: 'Inter' },
  { id: 'friendly', name: 'Friendly', h: 'Poppins',           b: 'Poppins' },
];
const PALETTES = {
  Azure:   ['#e0f2fe','#7dd3fc','#0ea5e9','#0369a1','#0c2a4a'],
  Blue:    ['#dbeafe','#93c5fd','#3b5bdb','#1e3a8a','#111a3d'],
  Rose:    ['#ffe4e6','#fda4af','#e11d48','#9f1239','#4c0519'],
  Emerald: ['#d1fae5','#6ee7b7','#10b981','#047857','#022c22'],
  Amber:   ['#fef3c7','#fcd34d','#f59e0b','#b45309','#451a03'],
  Violet:  ['#ede9fe','#c4b5fd','#7c3aed','#5b21b6','#2e1065'],
  Teal:    ['#ccfbf1','#5eead4','#14b8a6','#0f766e','#042f2e'],
  Orange:  ['#ffedd5','#fdba74','#f97316','#c2410c','#431407'],
  Graphite:['#f4f4f5','#a1a1aa','#52525b','#27272a','#09090b'],
};
const SECTIONS = {
  hero:     [ { n: 'Precision Autobody Repair & Refinishing', t: 'Hero · Split', i: 'view_quilt' },
              { n: 'Master Engineering & Factory Integrity', t: 'Timeline', i: 'timeline' },
              { n: 'Quick answers.', t: 'Accordion', i: 'quiz' } ],
  pains:    [ { n: 'What gets in the way.', t: '3 Cards', i: 'view_agenda' } ],
  services: [ { n: 'Collision & dent repair', t: 'Grid · 6 items', i: 'grid_view' },
              { n: 'Paint & refinishing', t: 'Feature split', i: 'format_paint' } ],
  trust:    [ { n: 'Loved by 320+ drivers', t: 'Reviews slider', i: 'reviews' },
              { n: 'Certified by the brands', t: 'Logo wall', i: 'workspace_premium' } ],
  convert:  [ { n: 'Get a free estimate', t: 'Form', i: 'edit_note' },
              { n: 'Simple pricing', t: 'Pricing cards', i: 'sell' },
              { n: 'Book a visit', t: 'Calendar', i: 'event_available' },
              { n: 'Call us today', t: 'CTA banner', i: 'campaign' } ],
  footer:   [ { n: 'Footer', t: '4 columns', i: 'call_to_action' } ],
};

const state = {
  group: 'style', font: 'bold', palette: 'Rose', scheme: 'brand', contrast: 'adaptive', shade: 2,
  header: 'pill', surface: 'light', links: 4, layout: 'split', align: 'left', badge: 'solid', buttons: 2,
  panel: 'bottom', width: 'boxed', panelStyle: 'solid', fx: { reveal: true }, sec: {}, bg: 'default', styleTab: 'fonts',
};

/* ---------- Mini SVG wireframes ---------- */
const W = (inner) => `<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" rx="4" fill="var(--fill)"/>${inner}</svg>`;
const img = 'fill="currentColor" opacity=".22"', ln = 'fill="currentColor" opacity=".75"', ln2 = 'fill="currentColor" opacity=".4"';
const LAYOUTS = [
  { id: 'soft',  n: 'Soft center', svg: W(`<rect x="0" y="0" width="60" height="40" rx="4" ${img}/><rect x="16" y="14" width="28" height="4" rx="2" ${ln}/><rect x="20" y="21" width="20" height="2.5" rx="1.2" ${ln2}/><rect x="24" y="27" width="12" height="4" rx="2" style="fill:var(--accent)"/>`) },
  { id: 'full',  n: 'Full-screen', svg: W(`<rect x="0" y="0" width="60" height="40" rx="4" ${img}/><rect x="6" y="22" width="30" height="4.5" rx="2" ${ln}/><rect x="6" y="29" width="20" height="2.5" rx="1.2" ${ln2}/><rect x="6" y="9" width="48" height="2" rx="1" ${ln2}/>`) },
  { id: 'frame', n: 'Frame',       svg: W(`<rect x="7" y="6" width="46" height="28" rx="3" ${img}/><rect x="7" y="6" width="46" height="28" rx="3" fill="none" stroke="currentColor" stroke-opacity=".5"/><rect x="18" y="16" width="24" height="3.5" rx="1.7" ${ln}/><rect x="22" y="22" width="16" height="2.5" rx="1.2" ${ln2}/>`) },
  { id: 'side',  n: 'Side menu',   svg: W(`<rect x="0" y="0" width="14" height="40" rx="4" fill="currentColor" opacity=".14"/><rect x="3" y="7" width="8" height="2" rx="1" ${ln2}/><rect x="3" y="12" width="8" height="2" rx="1" ${ln2}/><rect x="3" y="17" width="8" height="2" rx="1" ${ln2}/><rect x="20" y="14" width="30" height="4" rx="2" ${ln}/><rect x="20" y="21" width="22" height="2.5" rx="1.2" ${ln2}/><rect x="20" y="27" width="11" height="4" rx="2" style="fill:var(--accent)"/>`) },
  { id: 'bold',  n: 'Bold line',   svg: W(`<rect x="6" y="12" width="48" height="7" rx="2" ${ln}/><rect x="6" y="22" width="34" height="7" rx="2" ${ln}/><rect x="6" y="32" width="14" height="2.5" rx="1.2" ${ln2}/>`) },
  { id: 'split', n: 'Split',       svg: W(`<rect x="32" y="4" width="24" height="32" rx="3" ${img}/><rect x="5" y="13" width="22" height="4" rx="2" ${ln}/><rect x="5" y="20" width="18" height="2.5" rx="1.2" ${ln2}/><rect x="5" y="26" width="10" height="4" rx="2" style="fill:var(--accent)"/>`) },
];
const HEADERS = [
  { id: 'classic', n: 'Classic', svg: W(`<rect x="0" y="0" width="60" height="9" rx="0" fill="currentColor" opacity=".3"/><rect x="4" y="3.5" width="9" height="2" rx="1" ${ln}/><rect x="36" y="3.5" width="16" height="2" rx="1" ${ln2}/><rect x="8" y="18" width="28" height="3.5" rx="1.7" ${ln2}/><rect x="8" y="24" width="20" height="2.5" rx="1.2" ${ln2}/>`) },
  { id: 'pill',    n: 'Floating pill', svg: W(`<rect x="6" y="4" width="48" height="8" rx="4" fill="currentColor" opacity=".3"/><rect x="10" y="7" width="8" height="2" rx="1" ${ln}/><rect x="40" y="6" width="10" height="4" rx="2" style="fill:var(--accent)"/><rect x="8" y="20" width="28" height="3.5" rx="1.7" ${ln2}/><rect x="8" y="26" width="20" height="2.5" rx="1.2" ${ln2}/>`) },
];

/* ---------- Building blocks ---------- */
const seg = (key, opts, cls = '') => `<div class="seg ${cls}" data-key="${key}">${opts.map(o =>
  `<button class="opt ${state[key] == o.v ? 'on' : ''}" data-v="${o.v}" ${o.tip ? `data-tip="${o.tip}"` : ''}>${o.i ? ms(o.i) : ''}${o.t ?? ''}</button>`).join('')}</div>`;
const row = (icon, label, ctrl) => `<div class="row"><span class="lbl">${ms(icon)}${label}</span>${ctrl}</div>`;
const sw = (key, on) => `<button class="sw ${on ? 'on' : ''}" data-sw="${key}" role="switch" aria-checked="${!!on}"></button>`;
const grp = (title, meta, body, id = '') => `<section class="grp" ${id ? `id="${id}"` : ''}><div class="grp-h"><h3>${title}</h3>${meta ? `<span class="meta">${meta}</span>` : ''}</div>${body}</section>`;
const thumbs = (key, list, cls = '') => `<div class="lays ${cls}" data-key="${key}">${list.map(l =>
  `<button class="lay ${state[key] === l.id ? 'on' : ''}" data-v="${l.id}">${l.svg}<div class="cap">${l.n}</div></button>`).join('')}</div>`;
const pal = () => PALETTES[state.palette];

/* ---------- Panels ---------- */
function stylePanel() {
  const p = pal();
  return `
  <div class="subnav" data-key="styleTab">
    ${[['fonts','text_fields','Fonts'],['colors','palette','Colors'],['header','web_asset','Header']].map(([v,i,t]) =>
      `<button class="${state.styleTab===v?'on':''}" data-jump="${v}">${ms(i)}${t}</button>`).join('')}
  </div>
  ${grp('Font pairing', '5 presets', `<div class="fonts" data-key="font">${FONTS.map(f => `
      <button class="font ${state.font===f.id?'on':''}" data-v="${f.id}" data-tip="${f.h} + ${f.b}">
        <div class="aa" style="font-family:'${f.h}'">Aa</div><div class="nm">${f.name}</div><div class="pr">${f.h.replace(' Display','')}</div>
      </button>`).join('')}
      <button class="font" data-tip="Custom pairing"><div class="aa">${ms('add','')}</div><div class="nm">Custom</div><div class="pr">Any Google font</div></button>
    </div>`, 'sec-fonts')}
  ${grp('Color scheme', '', `<div class="tiles" data-key="scheme">
      <button class="tile ${state.scheme==='brand'?'on':''}" data-v="brand"><div class="pv" style="background:${p[2]};color:#fff">${ms('format_color_fill')}</div><div class="cap">Brand</div></button>
      <button class="tile ${state.scheme==='white'?'on':''}" data-v="white"><div class="pv" style="background:#fff;color:#222">${ms('light_mode')}</div><div class="cap">White</div></button>
      <button class="tile ${state.scheme==='dark'?'on':''}" data-v="dark"><div class="pv" style="background:#18181b;color:#eee">${ms('dark_mode')}</div><div class="cap">Dark</div></button>
    </div>
    <div style="height:10px"></div>
    ${row('contrast', 'Text contrast', seg('contrast', [{v:'adaptive',i:'contrast',tip:'Adaptive'},{v:'mono',i:'filter_b_and_w',tip:'Monochrome'}], 'compact'))}
    ${row('smart_button', 'Button shade', '')}
    <div class="row" style="margin-top:-2px"><div class="shades" data-key="shade">${p.map((c,i)=>`<button class="${state.shade===i?'on':''}" data-v="${i}" style="background:${c}" data-tip="Shade ${[100,300,500,700,900][i]}"></button>`).join('')}</div></div>`, 'sec-colors')}
  ${grp('Palette', '9 palettes', `<div class="pals" data-key="palette">${Object.entries(PALETTES).map(([n,c]) => `
      <button class="pal ${state.palette===n?'on':''}" data-v="${n}"><div class="bar">${c.map(x=>`<i style="background:${x}"></i>`).join('')}</div><div class="pn">${n}</div></button>`).join('')}
    </div>`)}
  ${grp('Header bar', '', `${thumbs('header', HEADERS, 'two')}
    <div style="height:8px"></div>
    ${row('visibility', 'Show header', sw('showHeader', true))}
    ${row('push_pin', 'Sticky on scroll', sw('sticky', false))}
    <div class="row"><span class="lbl">${ms('layers')}Surface</span></div>
    <div class="surf" data-key="surface">${[['transparent','Clear','background:repeating-conic-gradient(var(--fill2) 0 25%,transparent 0 50%) 0 0/10px 10px'],['light','Light','background:#fff'],['dark','Dark','background:#1c1c1f'],['glass','Glass','background:linear-gradient(135deg,rgba(255,255,255,.5),rgba(255,255,255,.12));backdrop-filter:blur(4px)']]
      .map(([v,t,st])=>`<button class="${state.surface===v?'on':''}" data-v="${v}"><span class="sq" style="${st}"></span>${t}</button>`).join('')}</div>
    <div style="height:12px"></div>
    <div class="input-ic">${ms('call')}<input class="field" id="ctaInput" value="Contact Us" aria-label="Contact button text"/></div>
    ${row('menu', 'Menu links', `<div class="stepper"><button data-step="-1">${ms('remove','sm')}</button><b id="linksVal">${state.links}</b><button data-step="1">${ms('add','sm')}</button></div>`)}`, 'sec-header')}`;
}

function sectionList(gid) {
  return `<div class="secs">${SECTIONS[gid].map((s, i) => {
    const k = gid + i, sel = (state.sec[gid] ?? 0) === i, hidden = state.sec['h' + k];
    return `<div class="sec ${sel ? 'on' : ''}" data-sec="${gid}" data-i="${i}" role="button" tabindex="0">
      ${ms('drag_indicator','drag')}<span class="thumb">${ms(s.i)}</span>
      <span class="t"><b>${s.n}</b><span>${gid==='hero'&&i===0 ? 'Hero · ' + LAYOUTS.find(l=>l.id===state.layout).n : s.t}</span></span>
      <button class="icon-btn eye ${hidden ? 'off' : ''}" data-eye="${k}" data-tip="${hidden ? 'Show' : 'Hide'} on page">${ms(hidden ? 'visibility_off' : 'visibility')}</button>
    </div>`; }).join('')}
    <button class="sec" data-action="add">${'<span class="thumb">' + ms('add') + '</span>'}<span class="t"><b style="color:var(--text2)">Add section</b><span>Browse the library</span></span></button>
  </div>`;
}

function commonSettings() {
  const p = pal();
  return `${grp('Background', '', `<div class="bgs" data-key="bg">${[['default','Auto','background:conic-gradient(#fff 0 50%,#222 0)'],['brand','Brand',`background:${p[2]}`],['white','White','background:#fff'],['dark','Dark','background:#18181b']]
      .map(([v,t,st])=>`<button class="${state.bg===v?'on':''}" data-v="${v}"><span class="c" style="${st}"></span>${t}</button>`).join('')}</div>
    <div style="height:12px"></div>
    ${row('tonality', 'Shade', `<span style="color:var(--text3);font-size:12px">700</span>`)}
    <input type="range" min="100" max="900" step="100" value="700" aria-label="Shade"/>`)}
  ${grp('Layout', '', `${row('width', 'Width', seg('width', [{v:'boxed',i:'crop_portrait',tip:'Boxed'},{v:'full',i:'width_full',tip:'Full width'}], 'compact'))}
    ${row('photo_size_select_large', 'Image scale', `<span style="color:var(--text3);font-size:12px">1×</span>`)}
    <input type="range" min="1" max="3" step=".25" value="1" aria-label="Image scale"/>`)}`;
}

function heroPanel() {
  const i = state.sec.hero ?? 0;
  if (i !== 0) return sectionList('hero') + '<div class="hr"></div>' + commonSettings();
  return `${sectionList('hero')}<div class="hr"></div>
  ${grp('Layout', '6 formats', thumbs('layout', LAYOUTS))}
  ${grp('Content', '', `<div class="input-ic">${ms('title')}<input class="field" id="headInput" value="Precision Autobody Repair &amp; Refinishing" aria-label="Headline"/></div>
    <div style="height:6px"></div>
    ${row('format_align_left', 'Align', seg('align', [{v:'left',i:'format_align_left',tip:'Left'},{v:'center',i:'format_align_center',tip:'Center'},{v:'right',i:'format_align_right',tip:'Right'}], 'compact'))}
    ${row('star', 'Rating badge', seg('badge', [{v:'none',i:'block',tip:'None'},{v:'outlined',i:'star',tip:'Outlined'},{v:'solid',i:'stars',tip:'Solid'}], 'compact'))}
    ${row('smart_button', 'Buttons', seg('buttons', [{v:0,t:'0',tip:'No buttons'},{v:1,t:'1',tip:'1 button'},{v:2,t:'2',tip:'2 buttons'}], 'compact'))}`)}
  ${grp('Business panel', '', `
    ${row('storefront', 'Position', seg('panel', [{v:'off',i:'hide_source',tip:'Off'},{v:'bottom',i:'vertical_align_bottom',tip:'Bottom'},{v:'left',i:'align_horizontal_left',tip:'Left'},{v:'right',i:'align_horizontal_right',tip:'Right'}], 'compact'))}
    ${row('style', 'Style', seg('panelStyle', [{v:'solid',i:'square',tip:'Solid'},{v:'outline',i:'crop_square',tip:'Outline'}], 'compact'))}`)}
  ${grp('Effects', '', `<div class="fx">${[['marquee','view_carousel','Logo marquee'],['reveal','text_select_start','Text reveal'],['blur','blur_on','Blur behind'],['logos','workspace_premium','Logos below']]
      .map(([k,i,t])=>`<button class="fxt ${state.fx[k]?'on':''}" data-fx="${k}">${ms(i)}${t}</button>`).join('')}</div>`)}`;
}

function genericPanel(gid) { return sectionList(gid) + '<div class="hr"></div>' + commonSettings(); }

function pagesPanel() {
  const n = (cls, icon, txt, cnt = '', chev = '') => `<button class="node ${cls}"><span class="ms chev">${chev}</span>${ms(icon)}<span class="grow">${txt}</span><span class="cnt">${cnt}</span></button>`;
  return `${grp('Pages', '4', `<div class="tree">
      ${n('on', 'home', 'Home', '14', 'expand_more')}
      ${GROUPS.slice(2).map(g => n('l1', g.icon, g.title, g.count, 'chevron_right')).join('')}
      ${n('', 'description', 'Services', '9', 'chevron_right')}
      ${n('', 'description', 'About', '6', 'chevron_right')}
      ${n('', 'mail', 'Contact', '4', 'chevron_right')}
    </div>`)}
    <button class="sec" data-action="add"><span class="thumb">${ms('note_add')}</span><span class="t"><b style="color:var(--text2)">New page</b><span>Blank or from template</span></span></button>`;
}

function settingsPanel() {
  return `${grp('Editor', '', `${row('animation', 'Canvas easing', sw('easing', true))}${row('grid_4x4', 'Show guides', sw('guides', false))}${row('keyboard', 'Shortcuts', `<span style="color:var(--text3)">⌘ /</span>`)}`)}
  ${grp('Appearance', '', row('routine', 'Editor theme', `<div class="seg compact" data-key="themeSeg">
      <button class="opt" data-theme-set="light" data-tip="Light">${ms('light_mode')}</button>
      <button class="opt" data-theme-set="dark" data-tip="Dark">${ms('dark_mode')}</button>
      <button class="opt" data-theme-set="system" data-tip="System">${ms('computer')}</button></div>`))}
  ${grp('Site', '', `${row('language', 'Domain', `<span style="color:var(--text3)">pandino.site</span>`)}${row('search', 'SEO & sharing', ms('chevron_right'))}${row('code', 'Custom code', ms('chevron_right'))}`)}`;
}

/* ---------- Render ---------- */
const railItems = $('#railItems'), body = $('#panelBody');
function renderRail() {
  railItems.innerHTML = GROUPS.map(g => `<button class="rail-btn ${state.group===g.id?'on':''}" data-group="${g.id}" data-tip="${g.title}" data-tip-pos="right">
    ${ms(g.icon)}<small>${g.label}</small>${g.count ? `<span class="dot">${g.count}</span>` : ''}</button>`).join('');
  document.querySelectorAll('.rail-foot [data-group]').forEach(b => b.classList.toggle('on', b.dataset.group === state.group));
}
function render() {
  const g = GROUPS.find(x => x.id === state.group) || { icon: 'settings', title: 'Settings' };
  $('#phIcon').textContent = g.icon; $('#phTitle').textContent = g.title;
  body.innerHTML = state.group === 'style' ? stylePanel() : state.group === 'hero' ? heroPanel()
    : state.group === 'pages' ? pagesPanel() : state.group === 'settings' ? settingsPanel() : genericPanel(state.group);
  renderRail(); syncTheme(); applySite();
}

/* ---------- Live preview ---------- */
function applySite() {
  const site = $('#site'), f = FONTS.find(x => x.id === state.font), p = pal();
  site.style.setProperty('--hfont', `'${f.h}'`); site.style.fontFamily = `'${f.b}', sans-serif`;
  site.style.setProperty('--brand', p[Math.min(4, Math.max(0, state.shade))] );
  const hero = $('#hero');
  hero.className = 'pd-hero ' + (['soft','full','frame'].includes(state.layout) ? 'overlay ' : '') + (state.layout === 'soft' || state.layout === 'frame' ? 'center' : state.align);
  $('#siteNav').classList.toggle('classic', state.header === 'classic');
  hero.querySelector('.pd-badge').style.display = state.badge === 'none' ? 'none' : '';
  hero.querySelector('.pd-badge').style.cssText += state.badge === 'outlined' ? ';background:transparent;color:var(--brand);border:1px solid var(--brand)' : ';border:0';
  hero.querySelector('.b1').style.display = state.buttons >= 1 ? '' : 'none';
  hero.querySelector('.b2').style.display = state.buttons >= 2 ? '' : 'none';
  document.querySelector('.biz').style.display = state.panel === 'off' ? 'none' : '';
  const links = [...document.querySelectorAll('.site-nav .links i')];
  const names = ['Services','Process','Reviews','FAQ','Pricing','About'];
  $('.site-nav .links').innerHTML = names.slice(0, state.links).map(n => `<i>${n}</i>`).join('');
}

/* ---------- Theme ---------- */
const root = document.documentElement;
function setTheme(t, persist = true) {
  if (t === 'system') { localStorage.removeItem('pandino-theme'); t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; }
  else if (persist) localStorage.setItem('pandino-theme', t);
  root.setAttribute('data-theme', t); syncTheme();
}
function syncTheme() {
  const t = root.getAttribute('data-theme'), b = $('#themeBtn');
  b.querySelector('.ms').textContent = t === 'dark' ? 'light_mode' : 'dark_mode';
  b.dataset.tip = t === 'dark' ? 'Switch to light' : 'Switch to dark';
  const saved = localStorage.getItem('pandino-theme');
  document.querySelectorAll('[data-theme-set]').forEach(x => x.classList.toggle('on', x.dataset.themeSet === (saved || 'system')));
}
matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => { if (!localStorage.getItem('pandino-theme')) setTheme(e.matches ? 'light' : 'dark', false); });

/* ---------- Events (delegated) ---------- */
document.addEventListener('click', e => {
  const t = e.target;
  const g = t.closest('[data-group]'); if (g) { state.group = g.dataset.group; $('#panel').classList.remove('is-hidden'); $('.canvas').classList.remove('wide'); render(); body.scrollTop = 0; return; }
  const a = t.closest('[data-action]');
  if (a) {
    const act = a.dataset.action;
    if (act === 'theme') setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    if (act === 'collapse') { $('#panel').classList.add('is-hidden'); $('.canvas').classList.add('wide'); }
    if (act === 'preview') { const m = a.querySelector('.ms'); m.textContent = m.textContent === 'visibility' ? 'visibility_off' : 'visibility'; }
    return;
  }
  const ts = t.closest('[data-theme-set]'); if (ts) { setTheme(ts.dataset.themeSet); return; }
  const eye = t.closest('[data-eye]'); if (eye) { e.stopPropagation(); state.sec['h' + eye.dataset.eye] = !state.sec['h' + eye.dataset.eye]; render(); return; }
  const sec = t.closest('[data-sec]'); if (sec) { state.sec[sec.dataset.sec] = +sec.dataset.i; render(); return; }
  const jump = t.closest('[data-jump]'); if (jump) { state.styleTab = jump.dataset.jump;
    jump.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === jump));
    const el = $('#sec-' + jump.dataset.jump); body.scrollTo({ top: el.offsetTop - 52, behavior: 'smooth' }); return; }
  const swb = t.closest('[data-sw]'); if (swb) { swb.classList.toggle('on'); swb.setAttribute('aria-checked', swb.classList.contains('on')); return; }
  const fx = t.closest('[data-fx]'); if (fx) { state.fx[fx.dataset.fx] = !state.fx[fx.dataset.fx]; fx.classList.toggle('on'); return; }
  const tg = t.closest('[data-toggle]'); if (tg) { tg.classList.toggle('on'); return; }
  const st = t.closest('[data-step]'); if (st) { state.links = Math.min(6, Math.max(3, state.links + +st.dataset.step)); $('#linksVal').textContent = state.links; applySite(); return; }
  const opt = t.closest('[data-v]'), wrap = opt && opt.closest('[data-key]');
  if (opt && wrap) {
    const k = wrap.dataset.key, raw = opt.dataset.v;
    state[k] = /^\d+$/.test(raw) ? +raw : raw;
    wrap.querySelectorAll('[data-v]').forEach(b => b.classList.toggle('on', b === opt));
    if (['palette','scheme','layout'].includes(k)) { const st = body.scrollTop; render(); body.scrollTop = st; } else applySite();
    return;
  }
  const segBtn = t.closest('.seg .opt'); if (segBtn && !segBtn.closest('[data-key]')) { segBtn.parentElement.querySelectorAll('.opt').forEach(b => b.classList.toggle('on', b === segBtn)); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'ctaInput') $('#siteCta').textContent = e.target.value || 'Contact Us';
  if (e.target.id === 'headInput') $('#heroH').textContent = e.target.value;
});
/* Notion-ish: keep subnav in sync while scrolling the style panel */
body.addEventListener('scroll', () => {
  if (state.group !== 'style') return;
  let cur = 'fonts'; for (const id of ['fonts','colors','header']) { const el = $('#sec-' + id); if (el && el.offsetTop - 70 <= body.scrollTop) cur = id; }
  document.querySelectorAll('.subnav button').forEach(b => b.classList.toggle('on', b.dataset.jump === cur));
});

/* ---------- Tooltips ---------- */
const tip = $('#tip'); let tipEl = null;
document.addEventListener('mouseover', e => {
  const el = e.target.closest('[data-tip]'); if (el === tipEl) return; tipEl = el;
  if (!el) { tip.classList.remove('show'); return; }
  tip.textContent = el.dataset.tip; const r = el.getBoundingClientRect(); tip.classList.add('show');
  const tr = tip.getBoundingClientRect();
  if (el.dataset.tipPos === 'right') { tip.style.left = r.right + 8 + 'px'; tip.style.top = r.top + r.height / 2 - tr.height / 2 + 'px'; }
  else { tip.style.left = Math.max(6, Math.min(innerWidth - tr.width - 6, r.left + r.width / 2 - tr.width / 2)) + 'px'; tip.style.top = r.top - tr.height - 6 + 'px'; }
});
document.addEventListener('keydown', e => { /* 1-8 jump to groups */
  if (e.target.matches('input')) return; const n = +e.key; if (n >= 1 && n <= GROUPS.length) { state.group = GROUPS[n - 1].id; render(); }
});

/* deep-link for screenshots/testing: ?group=hero */
const q = new URLSearchParams(location.search);
if (q.get('group')) state.group = q.get('group');
render();
})();
