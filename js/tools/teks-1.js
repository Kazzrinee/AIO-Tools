// teks-1.js — 5 tool teks pertama
import { copyText, setResult, setError } from './util.js';

/* 1. wordCounter — Penghitung Kata & Karakter */
export function wordCounter(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="wc-in">Teks</label>
        <textarea id="wc-in" rows="10" placeholder="Tempel atau tulis teks di sini..."></textarea>
      </div>
      <div>
        <div class="result-stats">
          <div class="stat"><span class="stat-num" id="wc-words">0</span><span class="stat-lbl">Kata</span></div>
          <div class="stat"><span class="stat-num" id="wc-chars">0</span><span class="stat-lbl">Karakter</span></div>
          <div class="stat"><span class="stat-num" id="wc-nospace">0</span><span class="stat-lbl">Tanpa spasi</span></div>
          <div class="stat"><span class="stat-num" id="wc-sent">0</span><span class="stat-lbl">Kalimat</span></div>
          <div class="stat"><span class="stat-num" id="wc-para">0</span><span class="stat-lbl">Paragraf</span></div>
          <div class="stat"><span class="stat-num" id="wc-lines">0</span><span class="stat-lbl">Baris</span></div>
        </div>
        <div class="tool-actions">
          <button type="button" class="btn btn-sm" id="wc-reset">
            <svg aria-hidden="true"><use href="/assets/icons.svg#i-reset"/></svg> Reset
          </button>
        </div>
      </div>
    </div>
  `;
  const input = el.querySelector('#wc-in');
  const update = () => {
    const t = input.value;
    el.querySelector('#wc-words').textContent = t.trim() ? t.trim().split(/\s+/).length : 0;
    el.querySelector('#wc-chars').textContent = t.length;
    el.querySelector('#wc-nospace').textContent = t.replace(/\s/g, '').length;
    el.querySelector('#wc-sent').textContent = (t.match(/[.!?]+(\s|$)/g) || []).length;
    el.querySelector('#wc-para').textContent = t.trim() ? t.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    el.querySelector('#wc-lines').textContent = t ? t.split('\n').length : 0;
  };
  input.addEventListener('input', update);
  el.querySelector('#wc-reset').addEventListener('click', () => { input.value = ''; update(); input.focus(); });
  update();
}

/* 2. caseConverter — Ubah Huruf Besar/Kecil */
export function caseConverter(el) {
  el.innerHTML = `
    <div class="field">
      <label for="cc-in">Teks</label>
      <textarea id="cc-in" rows="8" placeholder="Tempel teks di sini..."></textarea>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-sm" data-mode="upper">HURUF BESAR</button>
      <button type="button" class="btn btn-sm" data-mode="lower">huruf kecil</button>
      <button type="button" class="btn btn-sm" data-mode="title">Title Case</button>
      <button type="button" class="btn btn-sm" data-mode="sentence">Sentence case</button>
      <button type="button" class="btn btn-sm" data-mode="toggle">tOGGLE cASE</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="cc-out" aria-live="polite">Belum ada hasil.</div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn" id="cc-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
      <button type="button" class="btn btn-ghost" id="cc-reset"><svg aria-hidden="true"><use href="/assets/icons.svg#i-reset"/></svg> Reset</button>
    </div>
  `;
  const input = el.querySelector('#cc-in');
  const out = el.querySelector('#cc-out');
  const transform = (mode) => {
    const t = input.value;
    switch (mode) {
      case 'upper': return t.toUpperCase();
      case 'lower': return t.toLowerCase();
      case 'title': return t.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
      case 'sentence': return t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
      case 'toggle': return t.replace(/[a-zA-Z]/g, c => c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase());
      default: return t;
    }
  };
  el.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => setResult(out, transform(btn.dataset.mode)));
  });
  el.querySelector('#cc-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
  el.querySelector('#cc-reset').addEventListener('click', () => {
    input.value = ''; setError(out, 'Belum ada hasil.'); input.focus();
  });
}

/* 3. removeDuplicates — Hapus Duplikat Baris */
export function removeDuplicates(el) {
  el.innerHTML = `
    <div class="field">
      <label for="rd-in">Baris (satu item per baris)</label>
      <textarea id="rd-in" rows="10" placeholder="apel&#10;jeruk&#10;apel&#10;mangga"></textarea>
    </div>
    <div class="field">
      <label><input type="checkbox" id="rd-case"> Case-sensitive (bedakan huruf besar/kecil)</label>
      <label><input type="checkbox" id="rd-keep-empty"> Pertahankan baris kosong</label>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="rd-go">Proses</button>
      <button type="button" class="btn" id="rd-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil (<span id="rd-info">0</span> baris)</span>
      <div class="result is-empty" id="rd-out" aria-live="polite">Belum diproses.</div>
    </div>
  `;
  const input = el.querySelector('#rd-in');
  const out = el.querySelector('#rd-out');
  el.querySelector('#rd-go').addEventListener('click', () => {
    const caseSensitive = el.querySelector('#rd-case').checked;
    const keepEmpty = el.querySelector('#rd-keep-empty').checked;
    const seen = new Set();
    const kept = [];
    for (const line of input.value.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed && !keepEmpty) continue;
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) { seen.add(key); kept.push(line); }
    }
    setResult(out, kept.join('\n'));
    el.querySelector('#rd-info').textContent = kept.length;
  });
  el.querySelector('#rd-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 4. sortLines — Urutkan Baris */
export function sortLines(el) {
  el.innerHTML = `
    <div class="field">
      <label for="sl-in">Baris</label>
      <textarea id="sl-in" rows="10" placeholder="Tempel baris di sini..."></textarea>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn" data-sort="asc">A ke Z</button>
      <button type="button" class="btn" data-sort="desc">Z ke A</button>
      <button type="button" class="btn" data-sort="num">Numerik</button>
      <button type="button" class="btn" data-sort="random">Acak</button>
    </div>
    <div class="field mt-4">
      <label><input type="checkbox" id="sl-dedup"> Hapus duplikat</label>
      <label><input type="checkbox" id="sl-trim"> Trim spasi di tepi</label>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="sl-out" aria-live="polite">Belum diproses.</div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn" id="sl-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
  `;
  const input = el.querySelector('#sl-in');
  const out = el.querySelector('#sl-out');
  el.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      let lines = input.value.split('\n');
      if (el.querySelector('#sl-trim').checked) lines = lines.map(l => l.trim());
      if (el.querySelector('#sl-dedup').checked) lines = [...new Set(lines)];
      const mode = btn.dataset.sort;
      if (mode === 'asc') lines.sort((a, b) => a.localeCompare(b, 'id'));
      if (mode === 'desc') lines.sort((a, b) => b.localeCompare(a, 'id'));
      if (mode === 'num') lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
      if (mode === 'random') lines.sort(() => Math.random() - 0.5);
      setResult(out, lines.join('\n'));
    });
  });
  el.querySelector('#sl-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 5. findReplace — Cari & Ganti */
export function findReplace(el) {
  el.innerHTML = `
    <div class="field">
      <label for="fr-in">Teks</label>
      <textarea id="fr-in" rows="8" placeholder="Tempel teks di sini..."></textarea>
    </div>
    <div class="tool-grid-2">
      <div class="field">
        <label for="fr-find">Cari</label>
        <input type="text" id="fr-find" placeholder="kata yang dicari">
      </div>
      <div class="field">
        <label for="fr-replace">Ganti dengan</label>
        <input type="text" id="fr-replace" placeholder="pengganti">
      </div>
    </div>
    <div class="field">
      <label><input type="checkbox" id="fr-regex"> Gunakan regex (contoh: /pola/flags)</label>
      <label><input type="checkbox" id="fr-ci"> Abaikan huruf besar/kecil</label>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="fr-go">Ganti Semua</button>
      <button type="button" class="btn" id="fr-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="fr-out" aria-live="polite">Belum diproses.</div>
    </div>
  `;
  const out = el.querySelector('#fr-out');
  el.querySelector('#fr-go').addEventListener('click', () => {
    const text = el.querySelector('#fr-in').value;
    const find = el.querySelector('#fr-find').value;
    const rep = el.querySelector('#fr-replace').value;
    if (!find) { setError(out, 'Kolom "Cari" tidak boleh kosong.'); return; }
    try {
      let result;
      if (el.querySelector('#fr-regex').checked) {
        const m = find.match(/^\/(.+)\/([gimsuy]*)$/);
        if (!m) { setError(out, 'Format regex harus /pola/flags.'); return; }
        const flags = m[2].includes('g') ? m[2] : m[2] + 'g';
        result = text.replace(new RegExp(m[1], flags), rep);
      } else {
        const flags = el.querySelector('#fr-ci').checked ? 'gi' : 'g';
        const rx = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
        result = text.replace(rx, rep);
      }
      setResult(out, result);
    } catch (err) {
      setError(out, 'Pola tidak valid: ' + err.message);
    }
  });
  el.querySelector('#fr-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}