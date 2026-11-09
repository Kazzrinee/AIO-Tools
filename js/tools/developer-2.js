// developer-2.js — 5 tool developer berikutnya
import { copyText, setResult, setError, esc } from './util.js';

/* --- Helper warna --- */
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
  return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
}
function rgbToHex(r, g, b) {
  const h = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return '#' + h(r) + h(g) + h(b);
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
function parseColor(input) {
  input = input.trim();
  if (/^#?[0-9a-f]{3,6}$/i.test(input)) {
    const hex = input.startsWith('#') ? input : '#' + input;
    const rgb = hexToRgb(hex);
    if (rgb) return rgb;
  }
  let m = input.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (m) return { r: +m[1], g: +m[2], b: +m[3] };
  m = input.match(/^hsla?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
  if (m) return hslToRgb(+m[1], +m[2], +m[3]);
  return null;
}

/* 6. colorConverter — HEX / RGB / HSL */
export function colorConverter(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="col-in">Kode warna</label>
        <input type="text" id="col-in" placeholder="#B0341A, rgb(176,52,26), hsl(10,75%,40%)" value="#B0341A">
      </div>
      <div class="field">
        <label for="col-picker">Pilih warna</label>
        <input type="color" id="col-picker" value="#B0341A" style="width:100%; height:44px; padding:4px; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); background:var(--surface);">
      </div>
    </div>
    <div class="field">
      <span class="label">Pratinjau</span>
      <div id="col-preview" style="height:80px; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); background:#B0341A;"></div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="col-go">Konversi</button>
    </div>
    <div class="field mt-4">
      <span class="label">Format</span>
      <div class="result" id="col-out">-</div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn" id="col-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin semua</button>
    </div>
  `;
  const input = el.querySelector('#col-in');
  const picker = el.querySelector('#col-picker');
  const preview = el.querySelector('#col-preview');
  const out = el.querySelector('#col-out');
  const update = (color) => {
    const rgb = parseColor(color);
    if (!rgb) { setError(out, 'Format warna tidak dikenali.'); return; }
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    preview.style.background = hex;
    picker.value = hex;
    input.value = hex;
    setResult(out,
      `HEX:  ${hex.toUpperCase()}\n` +
      `RGB:  rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\n` +
      `HSL:  hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)\n` +
      `CSS:  color: ${hex};`
    );
  };
  el.querySelector('#col-go').addEventListener('click', () => update(input.value));
  picker.addEventListener('input', () => update(picker.value));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') update(input.value); });
  update(input.value);
  el.querySelector('#col-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 7. boxShadowGenerator — CSS Box Shadow */
export function boxShadowGenerator(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="bs-x">Horizontal (px)</label>
        <input type="number" id="bs-x" value="4" min="-50" max="50">
      </div>
      <div class="field">
        <label for="bs-y">Vertikal (px)</label>
        <input type="number" id="bs-y" value="4" min="-50" max="50">
      </div>
      <div class="field">
        <label for="bs-blur">Blur (px)</label>
        <input type="number" id="bs-blur" value="0" min="0" max="50">
      </div>
      <div class="field">
        <label for="bs-spread">Spread (px)</label>
        <input type="number" id="bs-spread" value="0" min="-20" max="50">
      </div>
      <div class="field">
        <label for="bs-color">Warna</label>
        <input type="color" id="bs-color" value="#14110C" style="width:100%; height:44px; padding:4px; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); background:var(--surface);">
      </div>
      <div class="field">
        <label>Opsi</label>
        <label><input type="checkbox" id="bs-inset"> Inset</label>
      </div>
    </div>
    <div class="field">
      <span class="label">Pratinjau</span>
      <div style="padding:32px; background:var(--surface-2); border:var(--bw) solid var(--border-muted); border-radius:var(--r-md); display:flex; align-items:center; justify-content:center;">
        <div id="bs-preview" style="width:120px; height:120px; background:var(--surface); border:var(--bw) solid var(--border);"></div>
      </div>
    </div>
    <div class="field mt-4">
      <span class="label">CSS</span>
      <div class="result" id="bs-out" style="font-family:var(--font-mono);">box-shadow: 4px 4px 0 0 #14110C;</div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn" id="bs-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin CSS</button>
      <button type="button" class="btn" id="bs-reset"><svg aria-hidden="true"><use href="/assets/icons.svg#i-reset"/></svg> Reset</button>
    </div>
  `;
  const preview = el.querySelector('#bs-preview');
  const out = el.querySelector('#bs-out');
  const update = () => {
    const x = el.querySelector('#bs-x').value || 0;
    const y = el.querySelector('#bs-y').value || 0;
    const blur = el.querySelector('#bs-blur').value || 0;
    const spread = el.querySelector('#bs-spread').value || 0;
    const color = el.querySelector('#bs-color').value;
    const inset = el.querySelector('#bs-inset').checked ? 'inset ' : '';
    const val = `${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`;
    preview.style.boxShadow = val;
    out.textContent = `box-shadow: ${val};`;
  };
  ['#bs-x','#bs-y','#bs-blur','#bs-spread','#bs-color','#bs-inset'].forEach(sel => {
    el.querySelector(sel).addEventListener('input', update);
  });
  update();
  el.querySelector('#bs-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
  el.querySelector('#bs-reset').addEventListener('click', () => {
    el.querySelector('#bs-x').value = 4;
    el.querySelector('#bs-y').value = 4;
    el.querySelector('#bs-blur').value = 0;
    el.querySelector('#bs-spread').value = 0;
    el.querySelector('#bs-color').value = '#14110C';
    el.querySelector('#bs-inset').checked = false;
    update();
  });
}

/* 8. codeMinifier — Minifier HTML/CSS/JS */
export function codeMinifier(el) {
  el.innerHTML = `
    <div class="field">
      <label for="mn-type">Jenis kode</label>
      <select id="mn-type">
        <option value="css">CSS</option>
        <option value="html">HTML</option>
        <option value="js">JavaScript</option>
      </select>
    </div>
    <div class="field">
      <label for="mn-in">Kode</label>
      <textarea id="mn-in" rows="10" placeholder="Tempel kode di sini..."></textarea>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="mn-go">Minify</button>
      <button type="button" class="btn" id="mn-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil (<span id="mn-stat">0%</span> lebih kecil)</span>
      <div class="result is-empty" id="mn-out" aria-live="polite">Belum diproses.</div>
    </div>
  `;
  const input = el.querySelector('#mn-in');
  const out = el.querySelector('#mn-out');
  const stat = el.querySelector('#mn-stat');
  const minCSS = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>+~])\s*/g, '$1').replace(/;}/g, '}').trim();
  const minHTML = (s) => s.replace(/<!--(?!\[if)[\s\S]*?-->/g, '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
  const minJS = (s) => s.replace(/\/\*(?!\!)[\s\S]*?\*\//g, '').replace(/[ \t]+$/gm, '').replace(/\n{2,}/g, '\n').trim();
  el.querySelector('#mn-go').addEventListener('click', () => {
    const t = input.value;
    if (!t) { setError(out, 'Masukkan kode dulu.'); stat.textContent = '0%'; return; }
    try {
      const type = el.querySelector('#mn-type').value;
      const r = type === 'css' ? minCSS(t) : type === 'html' ? minHTML(t) : minJS(t);
      setResult(out, r);
      stat.textContent = Math.max(0, Math.round((1 - r.length / t.length) * 100)) + '%';
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
  el.querySelector('#mn-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 9. regexTester — Regex Tester */
export function regexTester(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="rx-pattern">Pola regex</label>
        <input type="text" id="rx-pattern" placeholder="\\d+" value="\\d+">
      </div>
      <div class="field">
        <label for="rx-flags">Flags</label>
        <input type="text" id="rx-flags" placeholder="gim" value="g">
      </div>
    </div>
    <div class="field">
      <label for="rx-test">Teks uji</label>
      <textarea id="rx-test" rows="6">Harga 1000 dan 2500. Tahun 2025.</textarea>
    </div>
    <div class="field">
      <span class="label">Highlight (<span id="rx-count">0</span> match)</span>
      <div class="result" id="rx-highlight" style="white-space:pre-wrap; word-break:break-word; font-family:var(--font-mono);"></div>
    </div>
    <div class="field mt-4">
      <span class="label">Detail match</span>
      <div class="result is-empty" id="rx-detail" aria-live="polite">Belum diuji.</div>
    </div>
  `;
  const pattern = el.querySelector('#rx-pattern');
  const flags = el.querySelector('#rx-flags');
  const test = el.querySelector('#rx-test');
  const highlight = el.querySelector('#rx-highlight');
  const detail = el.querySelector('#rx-detail');
  const countEl = el.querySelector('#rx-count');
  const run = () => {
    const p = pattern.value;
    const f = flags.value;
    const t = test.value;
    if (!p) { countEl.textContent = '0'; highlight.textContent = t; setError(detail, 'Masukkan pola regex.'); return; }
    let re;
    try { re = new RegExp(p, f.includes('g') ? f : f + 'g'); }
    catch (e) {
      countEl.textContent = '0';
      highlight.textContent = t;
      setError(detail, 'Pola tidak valid: ' + e.message);
      return;
    }
    const matches = [];
    let m, guard = 0;
    while ((m = re.exec(t)) !== null && guard++ < 10000) {
      matches.push({ text: m[0], index: m.index, groups: m.slice(1) });
      if (m[0].length === 0) re.lastIndex++;
    }
    countEl.textContent = matches.length;
    if (matches.length === 0) {
      highlight.textContent = t;
    } else {
      let html = '', last = 0;
      for (const mm of matches) {
        if (mm.index > last) html += esc(t.slice(last, mm.index));
        html += '<mark style="background:var(--accent); color:var(--accent-ink); padding:0 2px; border-radius:2px;">' + esc(mm.text) + '</mark>';
        last = mm.index + mm.text.length;
      }
      if (last < t.length) html += esc(t.slice(last));
      highlight.innerHTML = html;
    }
    if (matches.length === 0) setError(detail, 'Tidak ada match.');
    else setResult(detail, matches.map((mm, i) =>
      `#${i + 1} @ ${mm.index}: "${mm.text}"` +
      (mm.groups.length ? `\n   groups: [${mm.groups.map(g => JSON.stringify(g)).join(', ')}]` : '')
    ).join('\n'));
  };
  [pattern, flags, test].forEach(i => i.addEventListener('input', run));
  run();
}

/* 10. jwtDecoder — JWT Decoder */
export function jwtDecoder(el) {
  el.innerHTML = `
    <div class="field">
      <label for="jwt-in">Token JWT</label>
      <textarea id="jwt-in" rows="5" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0In0.tanda-tangan"></textarea>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="jwt-go">Decode</button>
    </div>
    <div class="tool-grid-2 mt-4">
      <div class="field">
        <span class="label">Header</span>
        <div class="result is-empty" id="jwt-header">-</div>
      </div>
      <div class="field">
        <span class="label">Payload</span>
        <div class="result is-empty" id="jwt-payload">-</div>
      </div>
    </div>
    <div class="field mt-4">
      <span class="label">Signature (tidak diverifikasi)</span>
      <div class="result" id="jwt-sig" style="word-break:break-all;">-</div>
    </div>
    <div class="field mt-4">
      <div class="callout" style="font-size:var(--fs-sm);">
        <p><strong>Peringatan.</strong> Tool ini hanya melakukan decode base64url. Tidak memverifikasi tanda tangan.</p>
      </div>
    </div>
  `;
  const b64url = (s) => {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  };
  el.querySelector('#jwt-go').addEventListener('click', () => {
    const t = el.querySelector('#jwt-in').value.trim();
    const parts = t.split('.');
    const hEl = el.querySelector('#jwt-header');
    const pEl = el.querySelector('#jwt-payload');
    const sEl = el.querySelector('#jwt-sig');
    if (parts.length !== 3) { setError(hEl, 'Format JWT tidak valid (harus 3 bagian).'); return; }
    try {
      setResult(hEl, JSON.stringify(JSON.parse(b64url(parts[0])), null, 2));
    } catch (e) { setError(hEl, 'Gagal decode header: ' + e.message); }
    try {
      setResult(pEl, JSON.stringify(JSON.parse(b64url(parts[1])), null, 2));
    } catch (e) { setError(pEl, 'Gagal decode payload: ' + e.message); }
    sEl.textContent = parts[2] || '(kosong)';
  });
}