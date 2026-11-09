// gambar-1.js — 5 tool gambar pertama
import { copyText, setResult, setError, toast } from './util.js';

/* ---------- Helper gambar ---------- */
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File bukan gambar.'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Gagal memuat gambar.')); };
    img.src = url;
  });
}
function canvasToBlob(canvas, type = 'image/jpeg', quality = 0.85) {
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
function fileInputHtml(id, accept = 'image/*') {
  return `
    <div class="field">
      <label for="${id}" class="btn" style="cursor:pointer;">
        <svg aria-hidden="true"><use href="/assets/icons.svg#i-image"/></svg> Pilih Gambar
      </label>
      <input type="file" id="${id}" accept="${accept}" style="position:absolute; left:-9999px;">
      <div class="help" id="${id}-name">Belum ada file dipilih.</div>
    </div>
  `;
}
function readFileInfo(input, nameEl) {
  const f = input.files && input.files[0];
  if (!f) { nameEl.textContent = 'Belum ada file dipilih.'; return null; }
  const kb = (f.size / 1024).toFixed(1);
  nameEl.textContent = `${f.name} (${kb} KB)`;
  return f;
}

/* 1. compressImage — Kompres Gambar (JPG/WebP) */
export function compressImage(el) {
  el.innerHTML = `
    ${fileInputHtml('cp-file')}
    <div class="field">
      <label for="cp-q">Kualitas (${'0.8'} = 80%)</label>
      <input type="range" id="cp-q" min="0.1" max="1" step="0.05" value="0.8" style="width:100%;">
      <div class="help">Semakin kecil, semakin kecil ukuran file (dan lebih buram).</div>
    </div>
    <div class="field">
      <label for="cp-type">Format keluaran</label>
      <select id="cp-type">
        <option value="image/jpeg">JPEG (paling kompatibel)</option>
        <option value="image/webp">WebP (lebih kecil, modern)</option>
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="cp-go">Kompres</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="cp-out">Belum diproses.</div>
      <div id="cp-preview" style="margin-top:12px;"></div>
    </div>
  `;
  const fileEl = el.querySelector('#cp-file');
  const nameEl = el.querySelector('#cp-file-name');
  const out = el.querySelector('#cp-out');
  const preview = el.querySelector('#cp-preview');
  fileEl.addEventListener('change', () => readFileInfo(fileEl, nameEl));

  el.querySelector('#cp-go').addEventListener('click', async () => {
    const file = fileEl.files[0];
    if (!file) { setError(out, 'Pilih file dulu.'); return; }
    const q = parseFloat(el.querySelector('#cp-q').value);
    const type = el.querySelector('#cp-type').value;
    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, type, q);
      const before = (file.size / 1024).toFixed(1);
      const after = (blob.size / 1024).toFixed(1);
      const pct = Math.max(0, Math.round((1 - blob.size / file.size) * 100));
      setResult(out,
        `Ukuran asli:    ${before} KB\n` +
        `Ukuran hasil:   ${after} KB\n` +
        `Hemat:          ${pct}%\n` +
        `Dimensi:        ${img.naturalWidth} x ${img.naturalHeight}`
      );
      preview.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh Hasil';
      btn.onclick = () => {
        const ext = type === 'image/webp' ? 'webp' : 'jpg';
        triggerDownload(blob, 'kompres-' + Date.now() + '.' + ext);
      };
      preview.appendChild(btn);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 2. resizeImage — Ubah Ukuran (Resize) */
export function resizeImage(el) {
  el.innerHTML = `
    ${fileInputHtml('rs-file')}
    <div class="tool-grid-2">
      <div class="field">
        <label for="rs-w">Lebar (px)</label>
        <input type="number" id="rs-w" min="1" placeholder="otomatis">
      </div>
      <div class="field">
        <label for="rs-h">Tinggi (px)</label>
        <input type="number" id="rs-h" min="1" placeholder="otomatis">
      </div>
    </div>
    <div class="field">
      <label><input type="checkbox" id="rs-ratio" checked> Jaga rasio aspek</label>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="rs-go">Resize</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="rs-out">Belum diproses.</div>
      <div id="rs-preview" style="margin-top:12px;"></div>
    </div>
  `;
  const fileEl = el.querySelector('#rs-file');
  const nameEl = el.querySelector('#rs-file-name');
  const out = el.querySelector('#rs-out');
  const preview = el.querySelector('#rs-preview');
  const wIn = el.querySelector('#rs-w');
  const hIn = el.querySelector('#rs-h');
  let origW = 0, origH = 0;

  fileEl.addEventListener('change', async () => {
    const f = readFileInfo(fileEl, nameEl);
    if (!f) return;
    try {
      const img = await loadImageFromFile(f);
      origW = img.naturalWidth; origH = img.naturalHeight;
      wIn.value = origW; hIn.value = origH;
    } catch {}
  });

  wIn.addEventListener('input', () => {
    if (el.querySelector('#rs-ratio').checked && origW) {
      hIn.value = Math.round(wIn.value * origH / origW) || '';
    }
  });
  hIn.addEventListener('input', () => {
    if (el.querySelector('#rs-ratio').checked && origH) {
      wIn.value = Math.round(hIn.value * origW / origH) || '';
    }
  });

  el.querySelector('#rs-go').addEventListener('click', async () => {
    const file = fileEl.files[0];
    if (!file) { setError(out, 'Pilih file dulu.'); return; }
    const w = parseInt(wIn.value) || origW;
    const h = parseInt(hIn.value) || origH;
    if (w < 1 || h < 1) { setError(out, 'Lebar/tinggi tidak valid.'); return; }
    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      const blob = await canvasToBlob(canvas, 'image/png', 1);
      setResult(out, `Selesai. ${origW} x ${origH} → ${w} x ${h}`);
      preview.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PNG';
      btn.onclick = () => triggerDownload(blob, `resize-${w}x${h}.png`);
      preview.appendChild(btn);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 3. convertImage — Konversi Format */
export function convertImage(el) {
  el.innerHTML = `
    ${fileInputHtml('cv-file')}
    <div class="field">
      <label for="cv-type">Format tujuan</label>
      <select id="cv-type">
        <option value="image/jpeg">JPEG (.jpg)</option>
        <option value="image/png">PNG (.png)</option>
        <option value="image/webp">WebP (.webp)</option>
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="cv-go">Konversi</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="cv-out">Belum diproses.</div>
      <div id="cv-preview" style="margin-top:12px;"></div>
    </div>
  `;
  const fileEl = el.querySelector('#cv-file');
  const nameEl = el.querySelector('#cv-file-name');
  const out = el.querySelector('#cv-out');
  const preview = el.querySelector('#cv-preview');
  fileEl.addEventListener('change', () => readFileInfo(fileEl, nameEl));

  el.querySelector('#cv-go').addEventListener('click', async () => {
    const file = fileEl.files[0];
    if (!file) { setError(out, 'Pilih file dulu.'); return; }
    const type = el.querySelector('#cv-type').value;
    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      // JPEG tidak mendukung transparansi → beri latar putih
      if (type === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, type, 0.92);
      const ext = type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg';
      setResult(out, `Konversi selesai.\nUkuran: ${(blob.size / 1024).toFixed(1)} KB\nFormat: ${ext.toUpperCase()}`);
      preview.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh ' + ext.toUpperCase();
      btn.onclick = () => triggerDownload(blob, 'gambar-' + Date.now() + '.' + ext);
      preview.appendChild(btn);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 4. imageToBase64 — Gambar ke Base64 */
export function imageToBase64(el) {
  el.innerHTML = `
    ${fileInputHtml('i2b-file')}
    <div class="field">
      <label><input type="checkbox" id="i2b-raw"> Hanya data base64 (tanpa prefix data:image/...)</label>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="i2b-go">Ubah</button>
      <button type="button" class="btn" id="i2b-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="i2b-out" style="max-height:200px; overflow:auto;">Belum diproses.</div>
    </div>
  `;
  const fileEl = el.querySelector('#i2b-file');
  const nameEl = el.querySelector('#i2b-file-name');
  const out = el.querySelector('#i2b-out');
  fileEl.addEventListener('change', () => readFileInfo(fileEl, nameEl));

  el.querySelector('#i2b-go').addEventListener('click', () => {
    const file = fileEl.files[0];
    if (!file) { setError(out, 'Pilih file dulu.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      let data = reader.result;
      if (el.querySelector('#i2b-raw').checked) {
        data = data.split(',')[1] || data;
      }
      setResult(out, data);
    };
    reader.onerror = () => setError(out, 'Gagal membaca file.');
    reader.readAsDataURL(file);
  });
  el.querySelector('#i2b-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 5. base64ToImage — Base64 ke Gambar */
export function base64ToImage(el) {
  el.innerHTML = `
    <div class="field">
      <label for="b2i-in">String Base64 (dengan atau tanpa prefix data:image/...)</label>
      <textarea id="b2i-in" rows="6" placeholder="data:image/png;base64,iVBORw0KGgo..."></textarea>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="b2i-go">Tampilkan</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="b2i-out">Belum diproses.</div>
      <div id="b2i-preview" style="margin-top:12px;"></div>
    </div>
  `;
  const out = el.querySelector('#b2i-out');
  const preview = el.querySelector('#b2i-preview');
  el.querySelector('#b2i-go').addEventListener('click', () => {
    let raw = el.querySelector('#b2i-in').value.trim();
    if (!raw) { setError(out, 'Masukkan string Base64.'); return; }
    // Bangun prefix jika perlu
    let src = raw;
    if (!/^data:image\//.test(raw)) {
      // Deteksi mime sederhana dari karakter awal (fallback PNG)
      src = 'data:image/png;base64,' + raw.replace(/\s/g, '');
    }
    try {
      const test = new Image();
      test.onload = () => {
        setResult(out, `Gambar berhasil dimuat: ${test.naturalWidth} x ${test.naturalHeight}`);
        preview.innerHTML = '';
        const im = document.createElement('img');
        im.src = src;
        im.style.cssText = 'max-width:100%; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); margin-bottom:12px; display:block;';
        const dl = document.createElement('a');
        dl.href = src;
        dl.download = 'dari-base64.png';
        dl.className = 'btn btn-primary';
        dl.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh';
        preview.appendChild(im);
        preview.appendChild(dl);
      };
      test.onerror = () => setError(out, 'Base64 tidak valid atau bukan gambar.');
      test.src = src;
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}