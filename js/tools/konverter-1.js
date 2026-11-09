// konverter-1.js — 5 tool konverter pertama (satuan fisik)
import { setResult, setError } from './util.js';

/* Helper: render tabel konversi dari nilai basis */
function renderTable(units, baseValue, targetId) {
  let html = '<table style="width:100%; border-collapse:collapse; margin-top:8px;">';
  html += '<thead><tr><th style="text-align:left; padding:4px 8px; border-bottom:1px solid var(--border-muted);">Satuan</th><th style="text-align:right; padding:4px 8px; border-bottom:1px solid var(--border-muted);">Nilai</th></tr></thead><tbody>';
  for (const [name, factor] of Object.entries(units)) {
    const val = baseValue / factor;
    // Format ke maks 8 desimal, buang nol di belakang
    const display = parseFloat(val.toFixed(8)).toString();
    html += `<tr><td style="padding:6px 8px; border-bottom:1px solid var(--border-muted); font-family:var(--font-mono);">${name}</td>`;
    html += `<td style="padding:6px 8px; border-bottom:1px solid var(--border-muted); text-align:right; font-family:var(--font-mono); font-weight:700;">${display}</td></tr>`;
  }
  html += '</tbody></table>';
  document.getElementById(targetId).innerHTML = html;
}

/* 1. lengthConverter — Konverter Panjang */
export function lengthConverter(el) {
  const units = { 'Milimeter (mm)': 0.001, 'Sentimeter (cm)': 0.01, 'Meter (m)': 1, 'Kilometer (km)': 1000, 'Inci (in)': 0.0254, 'Kaki (ft)': 0.3048, 'Yard (yd)': 0.9144, 'Mil (mi)': 1609.344 };
  el.innerHTML = `
    <div class="field">
      <label for="lc-val">Nilai</label>
      <input type="number" id="lc-val" value="1" placeholder="Masukkan angka">
    </div>
    <div class="field">
      <label for="lc-unit">Dari Satuan</label>
      <select id="lc-unit">
        ${Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('')}
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="lc-go">Konversi</button>
    </div>
    <div id="lc-out" class="mt-4"></div>
  `;
  el.querySelector('#lc-go').addEventListener('click', () => {
    const val = parseFloat(el.querySelector('#lc-val').value);
    const unit = el.querySelector('#lc-unit').value;
    if (isNaN(val)) { setError(el.querySelector('#lc-out'), 'Masukkan angka yang valid.'); return; }
    const base = val * units[unit];
    renderTable(units, base, 'lc-out');
  });
  el.querySelector('#lc-go').click();
}

/* 2. weightConverter — Konverter Berat */
export function weightConverter(el) {
  const units = { 'Miligram (mg)': 0.000001, 'Gram (g)': 0.001, 'Kilogram (kg)': 1, 'Ton (t)': 1000, 'Ons': 0.1, 'Pon (lb)': 0.45359237, 'Ounce (oz)': 0.028349523125 };
  el.innerHTML = `
    <div class="field">
      <label for="wc-val">Nilai</label>
      <input type="number" id="wc-val" value="1" placeholder="Masukkan angka">
    </div>
    <div class="field">
      <label for="wc-unit">Dari Satuan</label>
      <select id="wc-unit">
        ${Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('')}
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="wc-go">Konversi</button>
    </div>
    <div id="wc-out" class="mt-4"></div>
  `;
  el.querySelector('#wc-go').addEventListener('click', () => {
    const val = parseFloat(el.querySelector('#wc-val').value);
    const unit = el.querySelector('#wc-unit').value;
    if (isNaN(val)) { setError(el.querySelector('#wc-out'), 'Masukkan angka yang valid.'); return; }
    const base = val * units[unit];
    renderTable(units, base, 'wc-out');
  });
  el.querySelector('#wc-go').click();
}

/* 3. tempConverter — Konverter Suhu */
export function tempConverter(el) {
  el.innerHTML = `
    <div class="field">
      <label for="tc-val">Nilai</label>
      <input type="number" id="tc-val" value="0">
    </div>
    <div class="field">
      <label for="tc-unit">Dari Satuan</label>
      <select id="tc-unit">
        <option value="C">Celsius (°C)</option>
        <option value="F">Fahrenheit (°F)</option>
        <option value="K">Kelvin (K)</option>
        <option value="R">Réaumur (°R)</option>
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="tc-go">Konversi</button>
    </div>
    <div id="tc-out" class="mt-4"></div>
  `;
  el.querySelector('#tc-go').addEventListener('click', () => {
    const val = parseFloat(el.querySelector('#tc-val').value);
    const from = el.querySelector('#tc-unit').value;
    if (isNaN(val)) { setError(el.querySelector('#tc-out'), 'Masukkan angka.'); return; }
    let c;
    if (from === 'C') c = val;
    if (from === 'F') c = (val - 32) * 5 / 9;
    if (from === 'K') c = val - 273.15;
    if (from === 'R') c = val * 5 / 4;
    
    const res = {
      'Celsius (°C)': c,
      'Fahrenheit (°F)': (c * 9 / 5) + 32,
      'Kelvin (K)': c + 273.15,
      'Réaumur (°R)': c * 4 / 5
    };
    renderTable(res, 1, 'tc-out'); // Note: renderTable expects base multiplier, but for temp we just pass a dummy 1 and pass values directly. Oh wait, renderTable divides by factor. I need a different table renderer.
    
    // Custom table for temp
    let html = '<table style="width:100%; border-collapse:collapse; margin-top:8px;">';
    html += '<thead><tr><th style="text-align:left; padding:4px 8px; border-bottom:1px solid var(--border-muted);">Satuan</th><th style="text-align:right; padding:4px 8px; border-bottom:1px solid var(--border-muted);">Nilai</th></tr></thead><tbody>';
    for (const [name, v] of Object.entries(res)) {
      html += `<tr><td style="padding:6px 8px; border-bottom:1px solid var(--border-muted); font-family:var(--font-mono);">${name}</td><td style="padding:6px 8px; border-bottom:1px solid var(--border-muted); text-align:right; font-family:var(--font-mono); font-weight:700;">${parseFloat(v.toFixed(4))}</td></tr>`;
    }
    html += '</tbody></table>';
    document.getElementById('tc-out').innerHTML = html;
  });
  el.querySelector('#tc-go').click();
}

/* 4. areaConverter — Konverter Luas */
export function areaConverter(el) {
  const units = { 'Milimeter persegi (mm²)': 0.000001, 'Sentimeter persegi (cm²)': 0.0001, 'Meter persegi (m²)': 1, 'Kilometer persegi (km²)': 1000000, 'Hektar (ha)': 10000, 'Are': 100, 'Kaki persegi (ft²)': 0.092903, 'Acre': 4046.86 };
  el.innerHTML = `
    <div class="field">
      <label for="ac-val">Nilai</label>
      <input type="number" id="ac-val" value="1">
    </div>
    <div class="field">
      <label for="ac-unit">Dari Satuan</label>
      <select id="ac-unit">
        ${Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('')}
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="ac-go">Konversi</button>
    </div>
    <div id="ac-out" class="mt-4"></div>
  `;
  el.querySelector('#ac-go').addEventListener('click', () => {
    const val = parseFloat(el.querySelector('#ac-val').value);
    const unit = el.querySelector('#ac-unit').value;
    if (isNaN(val)) { setError(el.querySelector('#ac-out'), 'Masukkan angka.'); return; }
    renderTable(units, val * units[unit], 'ac-out');
  });
  el.querySelector('#ac-go').click();
}

/* 5. volumeConverter — Konverter Volume */
export function volumeConverter(el) {
  const units = { 'Mililiter (mL)': 0.001, 'Liter (L)': 1, 'Meter kubik (m³)': 1000, 'Sentimeter kubik (cm³)': 0.001, 'Galon (US)': 3.78541, 'Cangkir (US)': 0.236588 };
  el.innerHTML = `
    <div class="field">
      <label for="vc-val">Nilai</label>
      <input type="number" id="vc-val" value="1">
    </div>
    <div class="field">
      <label for="vc-unit">Dari Satuan</label>
      <select id="vc-unit">
        ${Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('')}
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="vc-go">Konversi</button>
    </div>
    <div id="vc-out" class="mt-4"></div>
  `;
  el.querySelector('#vc-go').addEventListener('click', () => {
    const val = parseFloat(el.querySelector('#vc-val').value);
    const unit = el.querySelector('#vc-unit').value;
    if (isNaN(val)) { setError(el.querySelector('#vc-out'), 'Masukkan angka.'); return; }
    renderTable(units, val * units[unit], 'vc-out');
  });
  el.querySelector('#vc-go').click();
}