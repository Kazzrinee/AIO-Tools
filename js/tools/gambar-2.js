// gambar-2.js — 5 tool gambar berikutnya
import { setResult, setError, toast } from './util.js';

/* Helper (duplikat kecil, sama seperti di gambar-1.js) */
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('File bukan gambar.'));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Gagal memuat gambar.')); };
    img.src = url;
  });
}
function canvasToBlob(canvas, type = 'image/png', quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(b => b ? resolve(b) : reject(new Error('Gagal membuat blob.')), type, quality);
  });
}
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Unduhan dimulai');
}
function fileInputHtml(id) {
  return `
    <div class="field">
      <label for="${id}" class="btn" style="cursor:pointer;">
        <svg aria-hidden="true"><use href="/assets/icons.svg#i-image"/></svg> Pilih Gambar
      </label>
      <input type="file" id="${id}" accept="image/*" style="position:absolute; left:-9999px;">
      <div class="help" id="${id}-name">Belum ada file dipilih.</div>
    </div>
  `;
}
function readFileInfo(input, nameEl) {
  const f = input.files && input.files[0];
  if (!f) { nameEl.textContent = 'Belum ada file dipilih.'; return null; }
  nameEl.textContent = `${f.name} (${(f.size / 1024).toFixed(1)} KB)`;
  return f;
}

/* 6. cropImage — Potong Gambar */
export function cropImage(el) {
  el.innerHTML = `
    ${fileInputHtml('cr-file')}
    <div class="tool-grid-2">
      <div class="field"><label for="cr-x">X (px)</label><input type="number" id="cr-x" min="0" value="0"></div>
      <div class="field"><label for="cr-y">Y (px)</label><input type="number" id="cr-y" min="0" value="0"></div>
      <div class="field"><label for="cr-w">Lebar (px)</label><input type="number" id="cr-w" min="1"></div>
      <div class="field"><label for="cr-h">Tinggi (px)</label><input type="number" id="cr-h" min="1"></div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="cr-go">Potong</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="cr-out">Belum diproses.</div>
      <div id="cr-preview" style="margin-top:12px;"></div>
    </div>
  `;
  const fileEl = el.querySelector('#cr-file');
  const nameEl = el.querySelector('#cr-file-name');
  const out = el.querySelector('#cr-out');
  const preview = el.querySelector('#cr-preview');
  let dim = { w: 0, h: 0 };
  fileEl.addEventListener('change', async () => {
    const f = readFileInfo(fileEl, nameEl);
    if (!f) return;
    try {
      const img = await loadImageFromFile(f);
      dim = { w: img.naturalWidth, h: img.naturalHeight };
      el.querySelector('#cr-w').value = dim.w;
      el.querySelector('#cr-h').value = dim.h;
    } catch {}
  });
  el.querySelector('#cr-go').addEventListener('click', async () => {
    const file = fileEl.files[0];
    if (!file) { setError(out, 'Pilih file dulu.'); return; }
    const x = parseInt(el.querySelector('#cr-x').value) || 0;
    const y = parseInt(el.querySelector('#cr-y').value) || 0;
    const w = parseInt(el.querySelector('#cr-w').value);
    const h = parseInt(el.querySelector('#cr-h').value);
    if (!w || !h) { setError(out, 'Lebar/tinggi harus diisi.'); return; }
    if (x + w > dim.w || y + h > dim.h) {
      setError(out, `Area melebihi batas gambar (${dim.w}x${dim.h}).`); return;
    }
    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, x, y, w, h, 0, 0, w, h);
      const blob = await canvasToBlob(canvas, 'image/png');
      setResult(out, `Diproses: ${w} x ${h} (dari posisi ${x},${y})`);
      preview.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PNG';
      btn.onclick = () => triggerDownload(blob, `crop-${w}x${h}.png`);
      preview.appendChild(btn);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 7. rotateFlipImage — Putar & Balik */
export function rotateFlipImage(el) {
  el.innerHTML = `
    ${fileInputHtml('rf-file')}
    <div class="tool-actions">
      <button type="button" class="btn" data-act="cw">Putar 90 Kanan</button>
      <button type="button" class="btn" data-act="ccw">Putar 90 Kiri</button>
      <button type="button" class="btn" data-act="fh">Balik Horizontal</button>
      <button type="button" class="btn" data-act="fv">Balik Vertikal</button>
    </div>
    <div class="field mt-4">
      <span class="label">Pratinjau</span>
      <div id="rf-preview"></div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="rf-dl">
        <svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PNG
      </button>
    </div>
  `;
  const fileEl = el.querySelector('#rf-file');
  const nameEl = el.querySelector('#rf-file-name');
  const preview = el.querySelector('#rf-preview');
  let img = null;
  let state = { rot: 0, fh: false, fv: false };

  const render = () => {
    if (!img) return;
    const canvas = document.createElement('canvas');
    const cw = img.naturalWidth, ch = img.naturalHeight;
    const swap = state.rot % 180 !== 0;
    canvas.width = swap ? ch : cw;
    canvas.height = swap ? cw : ch;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(state.rot * Math.PI / 180);
    ctx.scale(state.fh ? -1 : 1, state.fv ? -1 : 1);
    ctx.drawImage(img, -cw / 2, -ch / 2);
    ctx.restore();
    preview.innerHTML = '';
    const im = document.createElement('img');
    im.src = canvas.toDataURL('image/png');
    im.style.cssText = 'max-width:100%; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md);';
    preview.appendChild(im);
  };

  fileEl.addEventListener('change', async () => {
    const f = readFileInfo(fileEl, nameEl);
    if (!f) return;
    try {
      img = await loadImageFromFile(f);
      state = { rot: 0, fh: false, fv: false };
      render();
    } catch (e) { toast(e.message); }
  });

  el.querySelectorAll('[data-act]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!img) { toast('Pilih gambar dulu.'); return; }
      const a = btn.dataset.act;
      if (a === 'cw') state.rot = (state.rot + 90) % 360;
      if (a === 'ccw') state.rot = (state.rot + 270) % 360;
      if (a === 'fh') state.fh = !state.fh;
      if (a === 'fv') state.fv = !state.fv;
      render();
    });
  });

  el.querySelector('#rf-dl').addEventListener('click', () => {
    const im = preview.querySelector('img');
    if (!im) { toast('Belum ada gambar.'); return; }
    fetch(im.src).then(r => r.blob()).then(b => triggerDownload(b, 'transformasi.png'));
  });
}

/* 8. colorPickerImage — Ambil Warna dari Gambar */
export function colorPickerImage(el) {
  el.innerHTML = `
    ${fileInputHtml('pk-file')}
    <div class="field">
      <span class="label">Klik pada gambar untuk mengambil warna</span>
      <div id="pk-wrap" style="position:relative; display:inline-block; max-width:100%;">
        <canvas id="pk-canvas" style="max-width:100%; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); cursor:crosshair; display:none; touch-action:manipulation;"></canvas>
      </div>
    </div>
    <div class="field mt-4">
      <span class="label">Warna terpilih</span>
      <div class="result" id="pk-out">Belum memilih warna.</div>
      <div id="pk-swatch" style="height:60px; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); margin-top:8px; background:var(--surface-2);"></div>
    </div>
  `;
  const fileEl = el.querySelector('#pk-file');
  const nameEl = el.querySelector('#pk-file-name');
  const canvas = el.querySelector('#pk-canvas');
  const out = el.querySelector('#pk-out');
  const swatch = el.querySelector('#pk-swatch');

  fileEl.addEventListener('change', async () => {
    const f = readFileInfo(fileEl, nameEl);
    if (!f) return;
    try {
      const img = await loadImageFromFile(f);
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.style.display = 'block';
      canvas.getContext('2d').drawImage(img, 0, 0);
      setResult(out, 'Gambar dimuat. Ketuk/klik untuk mengambil warna.');
      swatch.style.background = 'var(--surface-2)';
    } catch (e) { toast(e.message); }
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    try {
      const d = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
      const hex = '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join('');
      swatch.style.background = hex;
      setResult(out,
        `HEX: ${hex.toUpperCase()}\n` +
        `RGB: rgb(${d[0]}, ${d[1]}, ${d[2]})\n` +
        `Posisi: (${x}, ${y})`
      );
    } catch (err) { setError(out, 'Gagal membaca piksel: ' + err.message); }
  });
}

/* 9. watermarkImage — Tambah Watermark Teks */
export function watermarkImage(el) {
  el.innerHTML = `
    ${fileInputHtml('wm-file')}
    <div class="field">
      <label for="wm-text">Teks watermark</label>
      <input type="text" id="wm-text" value="© Nama Anda" placeholder="© Nama Anda">
    </div>
    <div class="tool-grid-2">
      <div class="field">
        <label for="wm-size">Ukuran font (%)</label>
        <input type="number" id="wm-size" min="2" max="50" value="6">
      </div>
      <div class="field">
        <label for="wm-color">Warna teks</label>
        <input type="color" id="wm-color" value="#FFFFFF" style="width:100%; height:44px; padding:4px; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); background:var(--surface);">
      </div>
      <div class="field">
        <label for="wm-pos">Posisi</label>
        <select id="wm-pos">
          <option value="br">Kanan bawah</option>
          <option value="bl">Kiri bawah</option>
          <option value="tr">Kanan atas</option>
          <option value="tl">Kiri atas</option>
          <option value="center">Tengah</option>
        </select>
      </div>
      <div class="field">
        <label for="wm-opacity">Opasitas (%)</label>
        <input type="number" id="wm-opacity" min="10" max="100" value="70">
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="wm-go">Terapkan</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div id="wm-preview" style="margin-top:8px;"></div>
    </div>
  `;
  const fileEl = el.querySelector('#wm-file');
  const nameEl = el.querySelector('#wm-file-name');
  const preview = el.querySelector('#wm-preview');
  fileEl.addEventListener('change', () => readFileInfo(fileEl, nameEl));

  el.querySelector('#wm-go').addEventListener('click', async () => {
    const file = fileEl.files[0];
    if (!file) { toast('Pilih file dulu.'); return; }
    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const sizePct = parseInt(el.querySelector('#wm-size').value) || 6;
      const fs = Math.round(canvas.width * sizePct / 100);
      ctx.font = `bold ${fs}px sans-serif`;
      ctx.fillStyle = el.querySelector('#wm-color').value;
      ctx.globalAlpha = (parseInt(el.querySelector('#wm-opacity').value) || 70) / 100;
      const text = el.querySelector('#wm-text').value || '';
      const m = ctx.measureText(text);
      const pad = Math.round(fs * 0.5);
      const pos = el.querySelector('#wm-pos').value;
      let x, y;
      if (pos === 'br') { x = canvas.width - m.width - pad; y = canvas.height - pad; }
      if (pos === 'bl') { x = pad; y = canvas.height - pad; }
      if (pos === 'tr') { x = canvas.width - m.width - pad; y = fs + pad; }
      if (pos === 'tl') { x = pad; y = fs + pad; }
      if (pos === 'center') { x = (canvas.width - m.width) / 2; y = canvas.height / 2; }
      ctx.fillText(text, x, y);
      const blob = await canvasToBlob(canvas, 'image/png');
      preview.innerHTML = '';
      const im = document.createElement('img');
      im.src = canvas.toDataURL('image/png');
      im.style.cssText = 'max-width:100%; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); margin-bottom:8px; display:block;';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PNG';
      btn.onclick = () => triggerDownload(blob, 'watermark.png');
      preview.appendChild(im);
      preview.appendChild(btn);
    } catch (e) { toast('Gagal: ' + e.message); }
  });
}

/* 10. imageFilter — Filter Sederhana */
export function imageFilter(el) {
  el.innerHTML = `
    ${fileInputHtml('ft-file')}
    <div class="field">
      <label for="ft-type">Filter</label>
      <select id="ft-type">
        <option value="grayscale(1)">Grayscale</option>
        <option value="sepia(1)">Sepia</option>
        <option value="invert(1)">Invert</option>
        <option value="blur(3px)">Blur 3px</option>
        <option value="blur(8px)">Blur 8px</option>
        <option value="brightness(1.3)">Brightness +30%</option>
        <option value="contrast(1.5)">Contrast +50%</option>
        <option value="saturate(2)">Saturate 200%</option>
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="ft-go">Terapkan</button>
    </div>
    <div class="field mt-4">
      <span class="label">Pratinjau & Unduh</span>
      <div id="ft-preview" style="margin-top:8px;"></div>
    </div>
  `;
  const fileEl = el.querySelector('#ft-file');
  const nameEl = el.querySelector('#ft-file-name');
  const preview = el.querySelector('#ft-preview');
  fileEl.addEventListener('change', () => readFileInfo(fileEl, nameEl));

  el.querySelector('#ft-go').addEventListener('click', async () => {
    const file = fileEl.files[0];
    if (!file) { toast('Pilih file dulu.'); return; }
    try {
      const img = await loadImageFromFile(file);
      const filter = el.querySelector('#ft-type').value;
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.filter = filter;
      ctx.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, 'image/png');
      preview.innerHTML = '';
      const im = document.createElement('img');
      im.src = canvas.toDataURL('image/png');
      im.style.cssText = 'max-width:100%; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); margin-bottom:8px; display:block;';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PNG';
      btn.onclick = () => triggerDownload(blob, 'filter.png');
      preview.appendChild(im);
      preview.appendChild(btn);
    } catch (e) { toast('Gagal: ' + e.message); }
  });
}