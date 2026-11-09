// app.js — router, tema, pencarian, favorit, riwayat, render tool, consent
import { CATEGORIES, TOOLS } from './registry.js';

// Mengimpor consent.js secara aman (jika file belum ada, web tidak akan crash total)
let initConsent = () => {};
try {
  const consentModule = await import('./consent.js');
  initConsent = consentModule.initConsent;
} catch (e) {
  console.warn('Modul consent.js tidak ditemukan atau error, banner cookie dilewati.', e);
}

const $  = (s, ctx = document) => ctx.querySelector(s);

/* ---------------- TEMA ---------------- */
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = $('#theme-icon');
  if (icon) {
    const use = icon.querySelector('use');
    if (use) use.setAttribute('href', theme === 'dark' ? '/assets/icons.svg#i-sun' : '/assets/icons.svg#i-moon');
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#16140F' : '#F4EFE3');
}
function initTheme() {
  const saved = localStorage.getItem('aio-theme');
  const theme = saved || getSystemTheme();
  applyTheme(theme);
  const btn = $('#theme-toggle');
  if (btn) btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('aio-theme', next);
    applyTheme(next);
  });
}

/* ---------------- FAVORIT & RIWAYAT ---------------- */
function getFavorites() {
  try { return JSON.parse(localStorage.getItem('aio-favs') || '[]'); } catch { return []; }
}
function toggleFavorite(slug) {
  const favs = getFavorites();
  const i = favs.indexOf(slug);
  if (i >= 0) favs.splice(i, 1); else favs.push(slug);
  localStorage.setItem('aio-favs', JSON.stringify(favs));
}
function addHistory(slug) {
  try {
    const h = JSON.parse(localStorage.getItem('aio-hist') || '[]').filter(s => s !== slug);
    h.unshift(slug);
    localStorage.setItem('aio-hist', JSON.stringify(h.slice(0, 20)));
  } catch {}
}

/* ---------------- HOME ---------------- */
function initHome() {
  const countEl = document.getElementById('tool-count');
  if (countEl) countEl.textContent = TOOLS.length;

  const grid = $('#tool-grid');
  if (grid) grid.innerHTML = Array.from({ length: 8 }, () => '<div class="skel skel--card"></div>').join('');

  const catList = $('#cat-list');
  if (catList) {
    catList.innerHTML = CATEGORIES.map(c => {
      const count = TOOLS.filter(t => t.category === c.id).length;
      return `
        <li>
          <a class="cat-row" href="/?kat=${c.id}" data-cat="${c.id}" style="--cat-color: var(--cat-${c.id});">
            <span class="cat-block" aria-hidden="true"><svg><use href="/assets/icons.svg#${c.icon}"/></svg></span>
            <span>
              <span class="cat-name">${c.name}</span>
              <span class="cat-desc">${c.desc}</span>
            </span>
            <span class="cat-count" aria-label="${count} tool">${count}</span>
          </a>
        </li>`;
    }).join('');
    catList.addEventListener('click', (e) => {
      const row = e.target.closest('[data-cat]');
      if (!row) return;
      e.preventDefault();
      const search = $('#search-input');
      if (search) search.value = '';
      filterTools({ category: row.dataset.cat });
      document.getElementById('tools-heading')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';
  const kat = params.get('kat') || '';
  const search = $('#search-input');
  if (search && q) search.value = q;

  setTimeout(() => filterTools({ category: kat, q }), 120);
  search?.addEventListener('input', () => filterTools({ q: search.value }));
}

function renderToolGrid(filter = {}) {
  const grid = $('#tool-grid');
  if (!grid) return;
  let list = TOOLS;
  if (filter.category) list = list.filter(t => t.category === filter.category);
  if (filter.q) {
    const q = filter.q.toLowerCase().trim();
    list = list.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.slug.includes(q) ||
      t.category.includes(q)
    );
  }

  const label = $('#tools-filter-label');
  if (label) {
    if (filter.category) {
      const c = CATEGORIES.find(x => x.id === filter.category);
      label.textContent = `/ kategori: ${c?.name} — ${list.length} tool`;
    } else if (filter.q) {
      label.textContent = `/ pencarian: "${filter.q}" — ${list.length} hasil`;
    } else {
      label.textContent = '';
    }
  }

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;">
      <h2>Tidak ada tool yang cocok</h2>
      <p>Coba kata kunci lain atau pilih kategori berbeda.</p>
      <a href="/" class="btn">Lihat semua tool</a>
    </div>`;
    return;
  }

  grid.innerHTML = list.map(t => {
    const c = CATEGORIES.find(x => x.id === t.category);
    return `
      <a class="tool-card" href="/tools/${t.slug}" style="--cat-color: var(--cat-${t.category});">
        <span class="tool-cat-tag">${c?.name || t.category}</span>
        <span class="tool-icon" aria-hidden="true"><svg><use href="/assets/icons.svg#${t.icon}"/></svg></span>
        <h3>${t.name}</h3>
        <p>${t.desc}</p>
      </a>`;
  }).join('');
}

function filterTools(opts) {
  renderToolGrid(opts);
  const url = new URL(window.location.href);
  if (opts.category) url.searchParams.set('kat', opts.category); else url.searchParams.delete('kat');
  if (opts.q) url.searchParams.set('q', opts.q); else url.searchParams.delete('q');
  history.replaceState(null, '', url.pathname + (url.search || ''));
}

/* ---------------- TOOL PAGE ---------------- */
async function initToolPage() {
  const path = window.location.pathname;
  let slug = path.replace(/^\/tools\//, '').replace(/^\/|\.html$/g, '');
  if (!slug || slug === 'tool') {
    slug = new URLSearchParams(window.location.search).get('slug');
  }
  if (!slug) return renderToolError('Parameter tool tidak ditemukan.');

  const tool = TOOLS.find(t => t.slug === slug);
  if (!tool) return renderToolError('Tool tidak ditemukan: ' + slug);

  const cat = CATEGORIES.find(c => c.id === tool.category);
  addHistory(slug);
  updateSEO(tool);

  const root = $('#tool-root');
  root.innerHTML = `
    <div class="tool-page-header anim-fade-up">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Beranda</a><span class="sep">/</span>
        <a href="/?kat=${tool.category}">${cat?.name || tool.category}</a><span class="sep">/</span>
        <span>${tool.name}</span>
      </nav>
      <div style="display:flex; align-items:flex-start; gap: 12px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 240px;">
          <h1 class="tool-title">${tool.name}</h1>
          <p class="tool-sub">${tool.desc}</p>
        </div>
        <button type="button" class="icon-btn" id="fav-btn" aria-label="Tambah ke favorit" aria-pressed="false">
          <svg aria-hidden="true"><use href="/assets/icons.svg#i-heart"/></svg>
        </button>
      </div>
    </div>

    <div class="tool-panel anim-fade-up" id="tool-panel">
      <div class="skel skel--input" style="height: 160px;"></div>
      <div class="skel skel--btn"></div>
    </div>

    <section class="howto">
      <h2>Cara pakai</h2>
      <ol>${tool.howTo.map(s => `<li>${s}</li>`).join('')}</ol>
    </section>

    <section class="faq">
      <h2>Pertanyaan umum</h2>
      ${tool.faq.map(f => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}
    </section>

    <section class="related">
      <h2>Tool terkait</h2>
      <div class="tool-grid" id="related-grid"></div>
    </section>
  `;

  const favBtn = $('#fav-btn');
  const updateFav = () => {
    const isFav = getFavorites().includes(slug);
    favBtn.setAttribute('aria-pressed', String(isFav));
    favBtn.setAttribute('aria-label', isFav ? 'Hapus dari favorit' : 'Tambah ke favorit');
    favBtn.querySelector('use')?.setAttribute('href', isFav ? '/assets/icons.svg#i-heart-filled' : '/assets/icons.svg#i-heart');
  };
  updateFav();
  favBtn.addEventListener('click', () => { toggleFavorite(slug); updateFav(); });

  try {
    const mod = await import(`./tools/${tool.module}`);
    const renderFn = mod[tool.fn];
    if (typeof renderFn !== 'function') throw new Error('Fungsi "' + tool.fn + '" tidak ada di ' + tool.module);
    const panel = $('#tool-panel');
    panel.innerHTML = '';
    renderFn(panel);
    panel.classList.add('anim-fade-up');
  } catch (err) {
    $('#tool-panel').innerHTML = `<div class="error-state">Gagal memuat tool: ${err.message}</div>`;
  }

  const related = TOOLS.filter(t => t.category === tool.category && t.slug !== slug).slice(0, 4);
  const relGrid = $('#related-grid');
  if (relGrid) {
    if (related.length === 0) {
      relGrid.closest('section').style.display = 'none';
    } else {
      relGrid.innerHTML = related.map(t => `
        <a class="tool-card" href="/tools/${t.slug}" style="--cat-color: var(--cat-${t.category});">
          <span class="tool-icon" aria-hidden="true"><svg><use href="/assets/icons.svg#${t.icon}"/></svg></span>
          <h3>${t.name}</h3>
          <p>${t.desc}</p>
        </a>`).join('');
    }
  }
}

function renderToolError(msg) {
  const root = $('#tool-root');
  if (!root) return;
  root.innerHTML = `
    <div class="error-state" style="margin: 40px 0;">
      <h2>${msg}</h2>
      <p><a href="/" class="btn">Kembali ke beranda</a></p>
    </div>`;
}

function updateSEO(tool) {
  document.title = `${tool.seoTitle} — All In One Tools`;
  const setMeta = (name, content) => {
    let m = document.querySelector(`meta[name="${name}"]`);
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', name); document.head.appendChild(m); }
    m.setAttribute('content', content);
  };
  setMeta('description', tool.seoDesc);

  let can = document.querySelector('link[rel="canonical"]');
  if (!can) { can = document.createElement('link'); can.rel = 'canonical'; document.head.appendChild(can); }
  can.href = `${window.location.origin}/tools/${tool.slug}`;

  const setOg = (prop, val) => {
    let m = document.querySelector(`meta[property="${prop}"]`);
    if (!m) { m = document.createElement('meta'); m.setAttribute('property', prop); document.head.appendChild(m); }
    m.setAttribute('content', val);
  };
  setOg('og:title', tool.seoTitle);
  setOg('og:description', tool.seoDesc);
  setOg('og:type', 'website');
  setOg('og:url', can.href);
}

/* ---------------- BOOT ---------------- */
let booted = false;
function boot() {
  if (booted) return;
  booted = true;
  initTheme();

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initConsent(); // Jalankan banner cookie

  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  else if (page === 'tool') initToolPage();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();