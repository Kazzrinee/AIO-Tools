// developer-1.js — 5 tool developer pertama
import { copyText, downloadFile, setResult, setError } from './util.js';

/* 1. jsonFormatter — JSON Formatter & Validator */
export function jsonFormatter(el) {
  el.innerHTML = `
    <div class="field">
      <label for="jf-in">JSON</label>
      <textarea id="jf-in" rows="10" placeholder='{"name":"Budi","umur":30,"hobi":["baca","kode"]}'></textarea>
    </div>
    <div class="field">
      <label for="jf-indent">Indentasi</label>
      <select id="jf-indent">
        <option value="2">2 spasi</option>
        <option value="4">4 spasi</option>
        <option value="tab">Tab</option>
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="jf-fmt">Format</button>
      <button type="button" class="btn" id="jf-min">Minify</button>
      <button type="button" class="btn" id="jf-valid">Validasi</button>
      <button type="button" class="btn" id="jf-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
      <button type="button" class="btn" id="jf-dl"><svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="jf-out" aria-live="polite">Belum diproses.</div>
    </div>
  `;
  const input = el.querySelector('#jf-in');
  const out = el.querySelector('#jf-out');
  const run = (fn) => {
    const t = input.value.trim();
    if (!t) { setError(out, 'Masukkan JSON dulu.'); return; }
    try { fn(JSON.parse(t)); }
    catch (e) { setError(out, 'JSON tidak valid:\n' + e.message); }
  };
  el.querySelector('#jf-fmt').addEventListener('click', () => {
    run(obj => {
      let ind = el.querySelector('#jf-indent').value;
      ind = ind === 'tab' ? '\t' : parseInt(ind);
      setResult(out, JSON.stringify(obj, null, ind));
    });
  });
  el.querySelector('#jf-min').addEventListener('click', () => run(obj => setResult(out, JSON.stringify(obj))));
  el.querySelector('#jf-valid').addEventListener('click', () => run(() => setResult(out, 'JSON valid.')));
  el.querySelector('#jf-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
  el.querySelector('#jf-dl').addEventListener('click', () => {
    if (!out.textContent.trim() || out.classList.contains('is-empty')) return;
    downloadFile('data.json', out.textContent, 'application/json');
  });
}

/* 2. base64Tool — Base64 Encoder/Decoder */
export function base64Tool(el) {
  el.innerHTML = `
    <div class="field">
      <label for="b64-in">Teks</label>
      <textarea id="b64-in" rows="8" placeholder="Tempel teks atau base64 di sini..."></textarea>
    </div>
    <div class="field">
      <label><input type="checkbox" id="b64-url"> URL-safe (ganti + / = menjadi - _ tanpa padding)</label>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" data-mode="enc">Encode</button>
      <button type="button" class="btn" data-mode="dec">Decode</button>
      <button type="button" class="btn" id="b64-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="b64-out" aria-live="polite">Belum diproses.</div>
    </div>
  `;
  const input = el.querySelector('#b64-in');
  const out = el.querySelector('#b64-out');
  const encode = (str) => {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin);
  };
  const decode = (b64) => {
    const bin = atob(b64.replace(/\s/g, ''));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  };
  const toUrl = (b) => b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const fromUrl = (b) => {
    let s = b.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return s;
  };
  el.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = input.value;
      if (!t) { setError(out, 'Masukkan teks dulu.'); return; }
      try {
        if (btn.dataset.mode === 'enc') {
          let r = encode(t);
          if (el.querySelector('#b64-url').checked) r = toUrl(r);
          setResult(out, r);
        } else {
          const prepared = el.querySelector('#b64-url').checked ? fromUrl(t) : t;
          setResult(out, decode(prepared));
        }
      } catch (e) { setError(out, 'Gagal: ' + e.message); }
    });
  });
  el.querySelector('#b64-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 3. urlCodec — URL Encode/Decode */
export function urlCodec(el) {
  el.innerHTML = `
    <div class="field">
      <label for="url-in">Teks atau URL</label>
      <textarea id="url-in" rows="6" placeholder="contoh: halo dunia / https://situs.com/page?q=halo"></textarea>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" data-mode="enc-comp">Encode komponen</button>
      <button type="button" class="btn" data-mode="dec-comp">Decode komponen</button>
      <button type="button" class="btn" data-mode="enc-url">Encode URL utuh</button>
      <button type="button" class="btn" data-mode="dec-url">Decode URL utuh</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="url-out" aria-live="polite">Belum diproses.</div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn" id="url-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
  `;
  const input = el.querySelector('#url-in');
  const out = el.querySelector('#url-out');
  el.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = input.value;
      if (!t) { setError(out, 'Masukkan teks dulu.'); return; }
      try {
        let r;
        switch (btn.dataset.mode) {
          case 'enc-comp': r = encodeURIComponent(t); break;
          case 'dec-comp': r = decodeURIComponent(t); break;
          case 'enc-url': r = encodeURI(t); break;
          case 'dec-url': r = decodeURI(t); break;
        }
        setResult(out, r);
      } catch (e) { setError(out, 'Gagal: ' + e.message); }
    });
  });
  el.querySelector('#url-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 4. uuidGenerator — UUID v4 Generator */
export function uuidGenerator(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="uuid-count">Jumlah</label>
        <input type="number" id="uuid-count" min="1" max="100" value="5">
      </div>
      <div class="field">
        <label>Opsi</label>
        <label><input type="checkbox" id="uuid-upper"> HURUF BESAR</label>
        <label><input type="checkbox" id="uuid-nodash"> Tanpa tanda hubung</label>
        <label><input type="checkbox" id="uuid-braces"> Bungkus { }</label>
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="uuid-go">Generate</button>
      <button type="button" class="btn" id="uuid-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="uuid-out" aria-live="polite">Belum digenerate.</div>
    </div>
  `;
  const out = el.querySelector('#uuid-out');
  const genOne = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  };
  el.querySelector('#uuid-go').addEventListener('click', () => {
    const n = Math.min(100, Math.max(1, parseInt(el.querySelector('#uuid-count').value) || 1));
    const upper = el.querySelector('#uuid-upper').checked;
    const nodash = el.querySelector('#uuid-nodash').checked;
    const braces = el.querySelector('#uuid-braces').checked;
    const list = Array.from({ length: n }, () => {
      let u = genOne();
      if (nodash) u = u.replace(/-/g, '');
      if (upper) u = u.toUpperCase();
      if (braces) u = '{' + u + '}';
      return u;
    });
    setResult(out, list.join('\n'));
  });
  el.querySelector('#uuid-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 5. timestampConverter — Unix Timestamp ke Tanggal */
export function timestampConverter(el) {
  el.innerHTML = `
    <div class="field">
      <label>Waktu sekarang</label>
      <div class="result" id="ts-now" style="font-family:var(--font-mono);"></div>
    </div>
    <div class="field">
      <label for="ts-in">Masukkan Unix timestamp (detik/ms) atau tanggal</label>
      <input type="text" id="ts-in" placeholder="Contoh: 1705315800 atau 2025-01-15">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="ts-go">Konversi</button>
      <button type="button" class="btn" id="ts-nowbtn">Isi dengan sekarang</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="ts-out" aria-live="polite">Belum dikonversi.</div>
    </div>
  `;
  const nowEl = el.querySelector('#ts-now');
  const updateNow = () => {
    const n = new Date();
    nowEl.textContent =
      `Unix (detik): ${Math.floor(n.getTime() / 1000)}\n` +
      `Unix (ms):     ${n.getTime()}\n` +
      `ISO:           ${n.toISOString()}\n` +
      `Lokal:         ${n.toLocaleString('id-ID')}`;
  };
  updateNow();
  setInterval(updateNow, 1000);

  el.querySelector('#ts-nowbtn').addEventListener('click', () => {
    el.querySelector('#ts-in').value = String(Math.floor(Date.now() / 1000));
  });
  el.querySelector('#ts-go').addEventListener('click', () => {
    const t = el.querySelector('#ts-in').value.trim();
    const out = el.querySelector('#ts-out');
    if (!t) { setError(out, 'Masukkan timestamp atau tanggal.'); return; }
    let date;
    if (/^\d+$/.test(t)) {
      const n = parseInt(t, 10);
      date = new Date(n < 1e11 ? n * 1000 : n);
    } else {
      date = new Date(t);
    }
    if (isNaN(date.getTime())) { setError(out, 'Format tidak dikenali.'); return; }
    const now = Date.now();
    const diff = Math.abs(now - date.getTime());
    const ago = now > date.getTime() ? 'lalu' : 'dari sekarang';
    let rel;
    if (diff < 60000) rel = Math.floor(diff / 1000) + ' detik ' + ago;
    else if (diff < 3600000) rel = Math.floor(diff / 60000) + ' menit ' + ago;
    else if (diff < 86400000) rel = Math.floor(diff / 3600000) + ' jam ' + ago;
    else rel = Math.floor(diff / 86400000) + ' hari ' + ago;
    setResult(out,
      `Unix (detik): ${Math.floor(date.getTime() / 1000)}\n` +
      `Unix (ms):     ${date.getTime()}\n` +
      `ISO:           ${date.toISOString()}\n` +
      `UTC:           ${date.toUTCString()}\n` +
      `Lokal:         ${date.toLocaleString('id-ID')}\n` +
      `Relatif:       ${rel}`
    );
  });
}