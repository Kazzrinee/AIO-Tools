// konverter-2.js — 5 tool konverter berikutnya (kecepatan, waktu, data, romawi, basis angka)
import { setResult, setError } from './util.js';

function renderTable(units, baseValue, targetId) {
  let html = '<table style="width:100%; border-collapse:collapse; margin-top:8px;">';
  html += '<thead><tr><th style="text-align:left; padding:4px 8px; border-bottom:1px solid var(--border-muted);">Satuan</th><th style="text-align:right; padding:4px 8px; border-bottom:1px solid var(--border-muted);">Nilai</th></tr></thead><tbody>';
  for (const [name, factor] of Object.entries(units)) {
    const val = baseValue / factor;
    const display = parseFloat(val.toFixed(8)).toString();
    html += `<tr><td style="padding:6px 8px; border-bottom:1px solid var(--border-muted); font-family:var(--font-mono);">${name}</td>`;
    html += `<td style="padding:6px 8px; border-bottom:1px solid var(--border-muted); text-align:right; font-family:var(--font-mono); font-weight:700;">${display}</td></tr>`;
  }
  html += '</tbody></table>';
  document.getElementById(targetId).innerHTML = html;
}

/* 6. speedConverter — Konverter Kecepatan */
export function speedConverter(el) {
  const units = { 'Meter/detik (m/s)': 1, 'Kilometer/jam (km/h)': 0.277778, 'Mil/jam (mph)': 0.44704, 'Knot': 0.514444, 'Kaki/detik (ft/s)': 0.3048 };
  el.innerHTML = `
    <div class="field">
      <label for="sc-val">Nilai</label>
      <input type="number" id="sc-val" value="1">
    </div>
    <div class="field">
      <label for="sc-unit">Dari Satuan</label>
      <select id="sc-unit">
        ${Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('')}
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="sc-go">Konversi</button>
    </div>
    <div id="sc-out" class="mt-4"></div>
  `;
  el.querySelector('#sc-go').addEventListener('click', () => {
    const val = parseFloat(el.querySelector('#sc-val').value);
    const unit = el.querySelector('#sc-unit').value;
    if (isNaN(val)) { setError(el.querySelector('#sc-out'), 'Masukkan angka.'); return; }
    renderTable(units, val * units[unit], 'sc-out');
  });
  el.querySelector('#sc-go').click();
}

/* 7. timeConverter — Konverter Waktu */
export function timeConverter(el) {
  const units = { 'Detik (s)': 1, 'Menit (min)': 60, 'Jam (h)': 3600, 'Hari (d)': 86400, 'Minggu': 604800, 'Bulan (30 hari)': 2592000, 'Tahun (365 hari)': 31536000 };
  el.innerHTML = `
    <div class="field">
      <label for="tc-val">Nilai</label>
      <input type="number" id="tc-val" value="1">
    </div>
    <div class="field">
      <label for="tc-unit">Dari Satuan</label>
      <select id="tc-unit">
        ${Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('')}
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="tc-go">Konversi</button>
    </div>
    <div id="tc-out" class="mt-4"></div>
  `;
  el.querySelector('#tc-go').addEventListener('click', () => {
    const val = parseFloat(el.querySelector('#tc-val').value);
    const unit = el.querySelector('#tc-unit').value;
    if (isNaN(val)) { setError(el.querySelector('#tc-out'), 'Masukkan angka.'); return; }
    renderTable(units, val * units[unit], 'tc-out');
  });
  el.querySelector('#tc-go').click();
}

/* 8. dataConverter — Konverter Data Digital */
export function dataConverter(el) {
  const units = { 'Bit (b)': 1, 'Byte (B)': 8, 'Kilobyte (KB)': 8000, 'Megabyte (MB)': 8000000, 'Gigabyte (GB)': 8000000000, 'Terabyte (TB)': 8000000000000 };
  el.innerHTML = `
    <div class="field">
      <label for="dc-val">Nilai</label>
      <input type="number" id="dc-val" value="1">
    </div>
    <div class="field">
      <label for="dc-unit">Dari Satuan</label>
      <select id="dc-unit">
        ${Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('')}
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="dc-go">Konversi</button>
    </div>
    <div id="dc-out" class="mt-4"></div>
    <div class="help mt-2">Catatan: Konversi menggunakan basis desimal (1 KB = 1000 B). Untuk basis biner (1 KiB = 1024 B), hasil akan sedikit berbeda.</div>
  `;
  el.querySelector('#dc-go').addEventListener('click', () => {
    const val = parseFloat(el.querySelector('#dc-val').value);
    const unit = el.querySelector('#dc-unit').value;
    if (isNaN(val)) { setError(el.querySelector('#dc-out'), 'Masukkan angka.'); return; }
    renderTable(units, val * units[unit], 'dc-out');
  });
  el.querySelector('#dc-go').click();
}

/* 9. romanConverter — Konverter Angka Romawi */
export function romanConverter(el) {
  el.innerHTML = `
    <div class="field">
      <label for="rc-in">Angka Desimal atau Romawi</label>
      <input type="text" id="rc-in" placeholder="Contoh: 2024 atau MMXXIV">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="rc-go">Konversi</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="rc-out">Belum diproses.</div>
    </div>
  `;
  const out = el.querySelector('#rc-out');
  const romanMap = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  
  el.querySelector('#rc-go').addEventListener('click', () => {
    const input = el.querySelector('#rc-in').value.trim().toUpperCase();
    if (!input) { setError(out, 'Masukkan angka.'); return; }
    
    // Cek jika input adalah angka
    if (/^\d+$/.test(input)) {
      let num = parseInt(input);
      if (num < 1 || num > 3999) { setError(out, 'Angka harus antara 1 dan 3999.'); return; }
      let res = '';
      for (const [r, v] of Object.entries(romanMap)) {
        while (num >= v) { res += r; num -= v; }
      }
      setResult(out, res);
    } 
    // Cek jika input adalah Romawi
    else if (/^[MDCLXVI]+$/.test(input)) {
      if (!/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(input)) {
        setError(out, 'Angka Romawi tidak valid. Gunakan penulisan baku (1-3999), contoh: MMXXIV.');
        return;
      }
      let res = 0;
      for (let i = 0; i < input.length; i++) {
        const curr = romanMap[input[i]];
        const next = romanMap[input[i + 1]];
        if (next && curr < next) { res += next - curr; i++; }
        else { res += curr; }
      }
      setResult(out, res.toString());
    } else {
      setError(out, 'Format tidak dikenali. Gunakan angka (1-3999) atau huruf Romawi (I, V, X, L, C, D, M).');
    }
  });
}

/* 10. baseConverter — Konverter Basis Angka */
export function baseConverter(el) {
  el.innerHTML = `
    <div class="field">
      <label for="bc-val">Nilai</label>
      <input type="text" id="bc-val" value="255" placeholder="Contoh: 255 atau FF atau 11111111">
    </div>
    <div class="field">
      <label for="bc-base">Dari Basis</label>
      <select id="bc-base">
        <option value="10">Desimal (10)</option>
        <option value="2">Biner (2)</option>
        <option value="8">Oktal (8)</option>
        <option value="16">Hexadesimal (16)</option>
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="bc-go">Konversi</button>
    </div>
    <div id="bc-out" class="mt-4"></div>
  `;
  el.querySelector('#bc-go').addEventListener('click', () => {
    const val = el.querySelector('#bc-val').value.trim();
    const from = parseInt(el.querySelector('#bc-base').value);
    if (!val) { setError(el.querySelector('#bc-out'), 'Masukkan angka.'); return; }
    try {
      const dec = parseInt(val, from);
      if (isNaN(dec)) throw new Error('Nilai tidak valid untuk basis ini.');
      
      const res = {
        'Biner (2)': dec.toString(2),
        'Oktal (8)': dec.toString(8),
        'Desimal (10)': dec.toString(10),
        'Hexadesimal (16)': dec.toString(16).toUpperCase()
      };
      
      let html = '<table style="width:100%; border-collapse:collapse; margin-top:8px;">';
      html += '<thead><tr><th style="text-align:left; padding:4px 8px; border-bottom:1px solid var(--border-muted);">Basis</th><th style="text-align:right; padding:4px 8px; border-bottom:1px solid var(--border-muted);">Nilai</th></tr></thead><tbody>';
      for (const [name, v] of Object.entries(res)) {
        html += `<tr><td style="padding:6px 8px; border-bottom:1px solid var(--border-muted); font-family:var(--font-mono);">${name}</td><td style="padding:6px 8px; border-bottom:1px solid var(--border-muted); text-align:right; font-family:var(--font-mono); font-weight:700;">${v}</td></tr>`;
      }
      html += '</tbody></table>';
      el.querySelector('#bc-out').innerHTML = html;
    } catch (e) { setError(el.querySelector('#bc-out'), 'Gagal: ' + e.message); }
  });
  el.querySelector('#bc-go').click();
}