// pdf-2.js — 5 tool PDF berikutnya
import { setResult, setError, toast } from './util.js';

const LIB_PDF = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
const LIB_PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';

async function loadScript(src, globalCheck) {
  if (window[globalCheck]) return window[globalCheck];
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => {
      if (globalCheck === 'pdfjsLib') {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      }
      resolve(window[globalCheck]);
    };
    s.onerror = () => reject(new Error('Gagal memuat library ' + src));
    document.head.appendChild(s);
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

function parsePageRanges(str, max) {
  const pages = new Set();
  str.split(',').forEach(part => {
    part = part.trim();
    if (!part) return;
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(Number);
      for (let i = Math.max(1, a); i <= Math.min(max, b); i++) pages.add(i - 1);
    } else {
      const n = Number(part);
      if (n >= 1 && n <= max) pages.add(n - 1);
    }
  });
  return Array.from(pages).sort((a, b) => a - b);
}

/* 6. rotatePdf — Putar PDF */
export function rotatePdf(el) {
  el.innerHTML = `
    <div class="field">
      <label for="rt-pdf" class="btn" style="cursor:pointer;"><svg aria-hidden="true"><use href="/assets/icons.svg#i-rotate"/></svg> Pilih PDF</label>
      <input type="file" id="rt-pdf" accept=".pdf" style="position:absolute;left:-9999px;">
      <div class="help" id="rt-name">Belum ada file dipilih.</div>
    </div>
    <div class="field">
      <label for="rt-deg">Sudut Putaran</label>
      <select id="rt-deg">
        <option value="90">90 Derajat (Kanan)</option>
        <option value="180">180 Derajat (Terbalik)</option>
        <option value="270">270 Derajat (Kiri)</option>
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="rt-go">Putar</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="rt-out">Belum diproses.</div>
      <div id="rt-dl"></div>
    </div>
  `;
  const fileEl = el.querySelector('#rt-pdf');
  const nameEl = el.querySelector('#rt-name');
  const out = el.querySelector('#rt-out');
  const dl = el.querySelector('#rt-dl');

  fileEl.addEventListener('change', () => {
    nameEl.textContent = fileEl.files.length ? fileEl.files[0].name : 'Belum ada file dipilih.';
  });

  el.querySelector('#rt-go').addEventListener('click', async () => {
    const file = fileEl.files[0];
    if (!file) { setError(out, 'Pilih file PDF dulu.'); return; }
    const deg = parseInt(el.querySelector('#rt-deg').value);
    try {
      setResult(out, 'Memproses...');
      const PDFLib = await loadScript(LIB_PDF, 'PDFLib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(bytes);
      
      pdf.getPages().forEach(page => {
        page.setRotation(PDFLib.degrees(deg));
      });
      
      const newBytes = await pdf.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      setResult(out, `Berhasil memutar semua halaman sebesar ${deg} derajat.`);
      dl.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary mt-4';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PDF';
      btn.onclick = () => triggerDownload(blob, 'diputar.pdf');
      dl.appendChild(btn);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 7. pageNumbers — Nomor Halaman */
export function pageNumbers(el) {
  el.innerHTML = `
    <div class="field">
      <label for="pn-pdf" class="btn" style="cursor:pointer;"><svg aria-hidden="true"><use href="/assets/icons.svg#i-list"/></svg> Pilih PDF</label>
      <input type="file" id="pn-pdf" accept=".pdf" style="position:absolute;left:-9999px;">
      <div class="help" id="pn-name">Belum ada file dipilih.</div>
    </div>
    <div class="tool-grid-2">
      <div class="field">
        <label for="pn-pos">Posisi</label>
        <select id="pn-pos">
          <option value="bottom-center">Bawah Tengah</option>
          <option value="bottom-right">Bawah Kanan</option>
          <option value="top-right">Atas Kanan</option>
        </select>
      </div>
      <div class="field">
        <label for="pn-start">Mulai dari angka</label>
        <input type="number" id="pn-start" min="1" value="1">
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="pn-go">Terapkan</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="pn-out">Belum diproses.</div>
      <div id="pn-dl"></div>
    </div>
  `;
  const fileEl = el.querySelector('#pn-pdf');
  const nameEl = el.querySelector('#pn-name');
  const out = el.querySelector('#pn-out');
  const dl = el.querySelector('#pn-dl');

  fileEl.addEventListener('change', () => {
    nameEl.textContent = fileEl.files.length ? fileEl.files[0].name : 'Belum ada file dipilih.';
  });

  el.querySelector('#pn-go').addEventListener('click', async () => {
    const file = fileEl.files[0];
    if (!file) { setError(out, 'Pilih file PDF dulu.'); return; }
    const pos = el.querySelector('#pn-pos').value;
    const startNum = parseInt(el.querySelector('#pn-start').value) || 1;
    try {
      setResult(out, 'Memproses...');
      const PDFLib = await loadScript(LIB_PDF, 'PDFLib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(bytes);
      const font = await pdf.embedFont(PDFLib.StandardFonts.Helvetica);
      
      const pages = pdf.getPages();
      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const text = String(startNum + i);
        const textWidth = font.widthOfTextAtSize(text, 12);
        let x = width / 2 - textWidth / 2;
        let y = 20;
        if (pos === 'bottom-right') { x = width - textWidth - 30; y = 20; }
        if (pos === 'top-right') { x = width - textWidth - 30; y = height - 30; }
        
        page.drawText(text, { x, y, size: 12, font, color: PDFLib.rgb(0.3, 0.3, 0.3) });
      });
      
      const newBytes = await pdf.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      setResult(out, `Berhasil menambahkan nomor halaman ke ${pages.length} halaman.`);
      dl.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary mt-4';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PDF';
      btn.onclick = () => triggerDownload(blob, 'bernomor.pdf');
      dl.appendChild(btn);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 8. watermarkPdf — Watermark PDF */
export function watermarkPdf(el) {
  el.innerHTML = `
    <div class="field">
      <label for="wm-pdf" class="btn" style="cursor:pointer;"><svg aria-hidden="true"><use href="/assets/icons.svg#i-layer"/></svg> Pilih PDF</label>
      <input type="file" id="wm-pdf" accept=".pdf" style="position:absolute;left:-9999px;">
      <div class="help" id="wm-name">Belum ada file dipilih.</div>
    </div>
    <div class="field">
      <label for="wm-text">Teks Watermark</label>
      <input type="text" id="wm-text" value="RAHASIA" placeholder="RAHASIA">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="wm-go">Terapkan</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="wm-out">Belum diproses.</div>
      <div id="wm-dl"></div>
    </div>
  `;
  const fileEl = el.querySelector('#wm-pdf');
  const nameEl = el.querySelector('#wm-name');
  const out = el.querySelector('#wm-out');
  const dl = el.querySelector('#wm-dl');

  fileEl.addEventListener('change', () => {
    nameEl.textContent = fileEl.files.length ? fileEl.files[0].name : 'Belum ada file dipilih.';
  });

  el.querySelector('#wm-go').addEventListener('click', async () => {
    const file = fileEl.files[0];
    if (!file) { setError(out, 'Pilih file PDF dulu.'); return; }
    const text = el.querySelector('#wm-text').value.trim() || 'RAHASIA';
    try {
      setResult(out, 'Memproses...');
      const PDFLib = await loadScript(LIB_PDF, 'PDFLib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(bytes);
      const font = await pdf.embedFont(PDFLib.StandardFonts.HelveticaBold);
      
      pdf.getPages().forEach(page => {
        const { width, height } = page.getSize();
        const fontSize = 60;
        page.drawText(text, {
          x: width / 2 - (font.widthOfTextAtSize(text, fontSize) / 2),
          y: height / 2,
          size: fontSize,
          font,
          color: PDFLib.rgb(0.8, 0.8, 0.8),
          opacity: 0.4,
          rotate: PDFLib.degrees(45)
        });
      });
      
      const newBytes = await pdf.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      setResult(out, 'Watermark berhasil ditambahkan ke semua halaman.');
      dl.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary mt-4';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PDF';
      btn.onclick = () => triggerDownload(blob, 'watermark.pdf');
      dl.appendChild(btn);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 9. deletePages — Hapus Halaman */
export function deletePages(el) {
  el.innerHTML = `
    <div class="field">
      <label for="dp-pdf" class="btn" style="cursor:pointer;"><svg aria-hidden="true"><use href="/assets/icons.svg#i-trash"/></svg> Pilih PDF</label>
      <input type="file" id="dp-pdf" accept=".pdf" style="position:absolute;left:-9999px;">
      <div class="help" id="dp-name">Belum ada file dipilih.</div>
    </div>
    <div class="field">
      <label for="dp-range">Halaman yang dihapus (contoh: 2, 5-7)</label>
      <input type="text" id="dp-range" placeholder="2, 5-7">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="dp-go">Hapus</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="dp-out">Belum diproses.</div>
      <div id="dp-dl"></div>
    </div>
  `;
  const fileEl = el.querySelector('#dp-pdf');
  const nameEl = el.querySelector('#dp-name');
  const out = el.querySelector('#dp-out');
  const dl = el.querySelector('#dp-dl');

  fileEl.addEventListener('change', () => {
    nameEl.textContent = fileEl.files.length ? fileEl.files[0].name : 'Belum ada file dipilih.';
  });

  el.querySelector('#dp-go').addEventListener('click', async () => {
    const file = fileEl.files[0];
    if (!file) { setError(out, 'Pilih file PDF dulu.'); return; }
    const rangeStr = el.querySelector('#dp-range').value;
    if (!rangeStr) { setError(out, 'Isi rentang halaman yang akan dihapus.'); return; }
    try {
      setResult(out, 'Memproses...');
      const PDFLib = await loadScript(LIB_PDF, 'PDFLib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(bytes);
      const max = pdf.getPageCount();
      const toDelete = parsePageRanges(rangeStr, max);
      
      if (toDelete.length === max) throw new Error('Tidak bisa menghapus semua halaman.');
      if (toDelete.length === 0) throw new Error('Rentang halaman tidak valid.');
      
      // Hapus dari indeks terbesar ke terkecil agar indeks tidak bergeser
      toDelete.sort((a, b) => b - a).forEach(idx => pdf.removePage(idx));
      
      const newBytes = await pdf.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      setResult(out, `Berhasil menghapus ${toDelete.length} halaman. Sisa: ${pdf.getPageCount()} halaman.`);
      dl.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary mt-4';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PDF';
      btn.onclick = () => triggerDownload(blob, 'sisa.pdf');
      dl.appendChild(btn);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 10. extractTextPdf — Ekstrak Teks dari PDF */
export function extractTextPdf(el) {
  el.innerHTML = `
    <div class="field">
      <label for="et-pdf" class="btn" style="cursor:pointer;"><svg aria-hidden="true"><use href="/assets/icons.svg#i-file-text"/></svg> Pilih PDF</label>
      <input type="file" id="et-pdf" accept=".pdf" style="position:absolute;left:-9999px;">
      <div class="help" id="et-name">Belum ada file dipilih.</div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="et-go">Ekstrak Teks</button>
      <button type="button" class="btn" id="et-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="et-out" style="max-height:300px; overflow:auto;">Belum diproses.</div>
    </div>
  `;
  const fileEl = el.querySelector('#et-pdf');
  const nameEl = el.querySelector('#et-name');
  const out = el.querySelector('#et-out');

  fileEl.addEventListener('change', () => {
    nameEl.textContent = fileEl.files.length ? fileEl.files[0].name : 'Belum ada file dipilih.';
  });

  el.querySelector('#et-go').addEventListener('click', async () => {
    const file = fileEl.files[0];
    if (!file) { setError(out, 'Pilih file PDF dulu.'); return; }
    try {
      setResult(out, 'Memuat library dan mengekstrak...');
      const pdfjsLib = await loadScript(LIB_PDFJS, 'pdfjsLib');
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        fullText += `--- Halaman ${i} ---\n` + strings.join(' ') + '\n\n';
      }
      
      if (!fullText.trim()) throw new Error('Tidak ada teks yang bisa diekstrak (mungkin PDF hasil scan gambar).');
      setResult(out, fullText.trim());
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });

  el.querySelector('#et-copy').addEventListener('click', () => {
    navigator.clipboard.writeText(out.textContent).then(() => toast('Teks disalin')).catch(() => toast('Gagal menyalin'));
  });
}