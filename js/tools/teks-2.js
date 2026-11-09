// teks-2.js — 5 tool teks berikutnya
import { copyText, downloadFile, setResult, setError } from './util.js';

/* 6. loremIpsum — Generator Lorem Ipsum */
export function loremIpsum(el) {
  const words = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur'.split(' ');
  const pick = () => words[Math.floor(Math.random() * words.length)];
  const sentence = () => {
    const len = 6 + Math.floor(Math.random() * 8);
    const s = Array.from({ length: len }, pick).join(' ');
    return s[0].toUpperCase() + s.slice(1) + '.';
  };
  const para = () => Array.from({ length: 3 + Math.floor(Math.random() * 3) }, sentence).join(' ');
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="li-para">Jumlah paragraf</label>
        <input type="number" id="li-para" min="1" max="50" value="3">
      </div>
      <div class="field">
        <label><input type="checkbox" id="li-classic"> Mulai dengan "Lorem ipsum dolor sit amet"</label>
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="li-go">Hasilkan</button>
      <button type="button" class="btn" id="li-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
      <button type="button" class="btn btn-ghost" id="li-dl"><svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh .txt</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="li-out" aria-live="polite">Belum digenerate.</div>
    </div>
  `;
  const out = el.querySelector('#li-out');
  el.querySelector('#li-go').addEventListener('click', () => {
    const n = Math.min(50, Math.max(1, parseInt(el.querySelector('#li-para').value) || 1));
    const paras = Array.from({ length: n }, para);
    if (el.querySelector('#li-classic').checked) {
      paras[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paras[0];
    }
    setResult(out, paras.join('\n\n'));
  });
  el.querySelector('#li-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
  el.querySelector('#li-dl').addEventListener('click', () => {
    if (!out.textContent.trim()) return;
    downloadFile('lorem-ipsum.txt', out.textContent, 'text/plain');
  });
}

/* 7. slugGenerator — Pembuat Slug URL */
export function slugGenerator(el) {
  el.innerHTML = `
    <div class="field">
      <label for="sg-in">Judul / teks</label>
      <input type="text" id="sg-in" placeholder="Contoh: Panduan Lengkap SEO 2025">
    </div>
    <div class="field">
      <label for="sg-sep">Pemisah</label>
      <select id="sg-sep">
        <option value="-">Tanda hubung (-)</option>
        <option value="_">Garis bawah (_)</option>
        <option value=".">Titik (.)</option>
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="sg-go">Buat Slug</button>
      <button type="button" class="btn" id="sg-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Slug</span>
      <div class="result is-empty" id="sg-out" aria-live="polite">Belum dibuat.</div>
    </div>
  `;
  const out = el.querySelector('#sg-out');
  el.querySelector('#sg-go').addEventListener('click', () => {
    const t = el.querySelector('#sg-in').value;
    if (!t.trim()) { setError(out, 'Masukkan judul dulu.'); return; }
    const sep = el.querySelector('#sg-sep').value;
    const slug = t
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/[\s-]+/g, sep);
    setResult(out, slug);
  });
  el.querySelector('#sg-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 8. reverseText — Pembalik Teks */
export function reverseText(el) {
  el.innerHTML = `
    <div class="field">
      <label for="rt-in">Teks</label>
      <textarea id="rt-in" rows="6" placeholder="Tempel teks di sini..."></textarea>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn" data-mode="chars">Balik Karakter</button>
      <button type="button" class="btn" data-mode="words">Balik Kata</button>
      <button type="button" class="btn" data-mode="lines">Balik Baris</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="rt-out" aria-live="polite">Belum diproses.</div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn" id="rt-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
  `;
  const input = el.querySelector('#rt-in');
  const out = el.querySelector('#rt-out');
  el.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = input.value;
      const mode = btn.dataset.mode;
      let r;
      if (mode === 'chars') r = [...t].reverse().join('');
      if (mode === 'words') r = t.split(/(\s+)/).reverse().join('');
      if (mode === 'lines') r = t.split('\n').reverse().join('\n');
      setResult(out, r);
    });
  });
  el.querySelector('#rt-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 9. diffText — Diff Teks */
export function diffText(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="df-a">Teks Lama</label>
        <textarea id="df-a" rows="10" placeholder="Teks versi lama..."></textarea>
      </div>
      <div class="field">
        <label for="df-b">Teks Baru</label>
        <textarea id="df-b" rows="10" placeholder="Teks versi baru..."></textarea>
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="df-go">Bandingkan</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil (<span id="df-stat">0 ditambah, 0 dihapus</span>)</span>
      <div class="result is-empty" id="df-out" aria-live="polite">Belum dibandingkan.</div>
    </div>
  `;
  const out = el.querySelector('#df-out');
  el.querySelector('#df-go').addEventListener('click', () => {
    const a = el.querySelector('#df-a').value.split('\n');
    const b = el.querySelector('#df-b').value.split('\n');
    const bSet = new Set(b);
    const aSet = new Set(a);
    const removed = a.filter(l => !bSet.has(l));
    const added = b.filter(l => !aSet.has(l));
    const parts = [...removed.map(l => '- ' + l), ...added.map(l => '+ ' + l)];
    setResult(out, parts.length ? parts.join('\n') : 'Tidak ada perbedaan.');
    el.querySelector('#df-stat').textContent = `${added.length} ditambah, ${removed.length} dihapus`;
  });
}

/* 10. extractEmails — Ekstrak Email & URL */
export function extractEmails(el) {
  el.innerHTML = `
    <div class="field">
      <label for="ex-in">Teks bebas</label>
      <textarea id="ex-in" rows="8" placeholder="Tempel teks berisi email/URL..."></textarea>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="ex-go">Ekstrak</button>
    </div>
    <div class="tool-grid-2 mt-4">
      <div class="field">
        <span class="label">Email (<span id="ex-email-count">0</span>)</span>
        <div class="result is-empty" id="ex-emails" aria-live="polite">Belum ada.</div>
        <div class="tool-actions">
          <button type="button" class="btn btn-sm" id="ex-email-copy">Salin</button>
        </div>
      </div>
      <div class="field">
        <span class="label">URL (<span id="ex-url-count">0</span>)</span>
        <div class="result is-empty" id="ex-urls" aria-live="polite">Belum ada.</div>
        <div class="tool-actions">
          <button type="button" class="btn btn-sm" id="ex-url-copy">Salin</button>
        </div>
      </div>
    </div>
  `;
  el.querySelector('#ex-go').addEventListener('click', () => {
    const t = el.querySelector('#ex-in').value;
    const emails = [...new Set((t.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []))];
    const urls = [...new Set((t.match(/https?:\/\/[^\s<>"']+/g) || []))];
    const eOut = el.querySelector('#ex-emails');
    const uOut = el.querySelector('#ex-urls');
    if (emails.length) setResult(eOut, emails.join('\n')); else setError(eOut, 'Tidak ditemukan email.');
    if (urls.length) setResult(uOut, urls.join('\n')); else setError(uOut, 'Tidak ditemukan URL.');
    el.querySelector('#ex-email-count').textContent = emails.length;
    el.querySelector('#ex-url-count').textContent = urls.length;
  });
  el.querySelector('#ex-email-copy').addEventListener('click', (e) => copyText(el.querySelector('#ex-emails').textContent, e.currentTarget));
  el.querySelector('#ex-url-copy').addEventListener('click', (e) => copyText(el.querySelector('#ex-urls').textContent, e.currentTarget));
}