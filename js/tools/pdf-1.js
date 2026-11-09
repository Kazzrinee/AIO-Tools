// pdf-1.js — 5 tool PDF pertama
import { setResult, setError, toast } from './util.js';

const LIB_PDF = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
const LIB_JSPDF = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';

async function loadScript(src, globalCheck) {
  if (window[globalCheck]) return window[globalCheck];
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve(window[globalCheck]);
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

/* 1. mergePdf — Gabung PDF */
export function mergePdf(el) {
  el.innerHTML = `
    <div class="field">
      <label for="mg-files" class="btn" style="cursor:pointer;"><svg aria-hidden="true"><use href="/assets/icons.svg#i-merge"/></svg> Pilih PDF (bisa banyak)</label>
      <input type="file" id="mg-files" accept=".pdf" multiple style="position:absolute;left:-9999px;">
      <div class="help" id="mg-name">Belum ada file dipilih.</div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="mg-go">Gabungkan</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="mg-out">Belum diproses.</div>
      <div id="mg-dl"></div>
    </div>
  `;
  const inEl = el.querySelector('#mg-files');
  const nameEl = el.querySelector('#mg-name');
  const out = el.querySelector('#mg-out');
  const dl = el.querySelector('#mg-dl');
  
  inEl.addEventListener('change', () => {
    const f = inEl.files;
    nameEl.textContent = f.length ? f.length + ' file dipilih' : 'Belum ada file dipilih.';
  });

  el.querySelector('#mg-go').addEventListener('click', async () => {
    if (inEl.files.length < 2) { setError(out, 'Pilih minimal 2 file PDF.'); return; }
    try {
      setResult(out, 'Memuat library...');
      const PDFLib = await loadScript(LIB_PDF, 'PDFLib');
      const mergedPdf = await PDFLib.PDFDocument.create();
      
      for (let i = 0; i < inEl.files.length; i++) {
        const file = inEl.files[i];
        const bytes = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(p => mergedPdf.addPage(p));
      }
      
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      setResult(out, 'Berhasil digabung. Ukuran: ' + (blob.size / 1024).toFixed(1) + ' KB');
      dl.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary mt-4';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PDF';
      btn.onclick = () => triggerDownload(blob, 'gabungan.pdf');
      dl.appendChild(btn);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 2. splitPdf — Pisah PDF */
export function splitPdf(el) {
  el.innerHTML = `
    <div class="field">
      <label for="sp-file" class="btn" style="cursor:pointer;"><svg aria-hidden="true"><use href="/assets/icons.svg#i-scissors"/></svg> Pilih PDF</label>
      <input type="file" id="sp-file" accept=".pdf" style="position:absolute;left:-9999px;">
      <div class="help" id="sp-name">Belum ada file dipilih.</div>
    </div>
    <div class="field">
      <label for="sp-range">Halaman yang diambil (contoh: 1-3, 5)</label>
      <input type="text" id="sp-range" placeholder="1-3, 5">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="sp-go">Pisahkan</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="sp-out">Belum diproses.</div>
      <div id="sp-dl"></div>
    </div>
  `;
  const fileEl = el.querySelector('#sp-file');
  const nameEl = el.querySelector('#sp-name');
  const out = el.querySelector('#sp-out');
  const dl = el.querySelector('#sp-dl');

  fileEl.addEventListener('change', () => {
    nameEl.textContent = fileEl.files.length ? fileEl.files[0].name : 'Belum ada file dipilih.';
  });

  el.querySelector('#sp-go').addEventListener('click', async () => {
    const file = fileEl.files[0];
    if (!file) { setError(out, 'Pilih file PDF dulu.'); return; }
    const rangeStr = el.querySelector('#sp-range').value;
    if (!rangeStr) { setError(out, 'Isi rentang halaman.'); return; }
    try {
      setResult(out, 'Memproses...');
      const PDFLib = await loadScript(LIB_PDF, 'PDFLib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(bytes);
      const max = pdf.getPageCount();
      const indices = parsePageRanges(rangeStr, max);
      if (indices.length === 0) throw new Error('Rentang halaman tidak valid.');
      
      const newPdf = await PDFLib.PDFDocument.create();
      const pages = await newPdf.copyPages(pdf, indices);
      pages.forEach(p => newPdf.addPage(p));
      const newBytes = await newPdf.save();
      
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      setResult(out, `Berhasil. Mengambil ${indices.length} halaman dari total ${max}.`);
      dl.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary mt-4';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PDF';
      btn.onclick = () => triggerDownload(blob, 'potongan.pdf');
      dl.appendChild(btn);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 3. compressPdf — Kompres PDF (Optimasi Struktur) */
export function compressPdf(el) {
  el.innerHTML = `
    <div class="field">
      <label for="cp-pdf" class="btn" style="cursor:pointer;"><svg aria-hidden="true"><use href="/assets/icons.svg#i-filter"/></svg> Pilih PDF</label>
      <input type="file" id="cp-pdf" accept=".pdf" style="position:absolute;left:-9999px;">
      <div class="help" id="cp-name">Belum ada file dipilih.</div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="cp-go">Kompres</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="cp-out">Belum diproses.</div>
      <div id="cp-dl"></div>
    </div>
  `;
  const fileEl = el.querySelector('#cp-pdf');
  const nameEl = el.querySelector('#cp-name');
  const out = el.querySelector('#cp-out');
  const dl = el.querySelector('#cp-dl');

  fileEl.addEventListener('change', () => {
    nameEl.textContent = fileEl.files.length ? fileEl.files[0].name : 'Belum ada file dipilih.';
  });

  el.querySelector('#cp-go').addEventListener('click', async () => {
    const file = fileEl.files[0];
    if (!file) { setError(out, 'Pilih file PDF dulu.'); return; }
    try {
      setResult(out, 'Memproses...');
      const PDFLib = await loadScript(LIB_PDF, 'PDFLib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(bytes, { updateMetadata: false });
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setKeywords([]);
      
      // Simpan dengan kompresi object stream maksimal
      const newBytes = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      
      const before = (file.size / 1024).toFixed(1);
      const after = (blob.size / 1024).toFixed(1);
      const pct = Math.max(0, Math.round((1 - blob.size / file.size) * 100));
      
      setResult(out, `Ukuran asli: ${before} KB\nUkuran hasil: ${after} KB\nHemat: ${pct}%\n\nCatatan: Ini mengoptimasi struktur file. Kompresi gambar di dalam PDF butuh tools khusus.`);
      dl.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary mt-4';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PDF';
      btn.onclick = () => triggerDownload(blob, 'kompres.pdf');
      dl.appendChild(btn);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 4. imageToPdf — Gambar ke PDF */
export function imageToPdf(el) {
  el.innerHTML = `
    <div class="field">
      <label for="i2p-files" class="btn" style="cursor:pointer;"><svg aria-hidden="true"><use href="/assets/icons.svg#i-image"/></svg> Pilih Gambar (bisa banyak)</label>
      <input type="file" id="i2p-files" accept="image/jpeg,image/png" multiple style="position:absolute;left:-9999px;">
      <div class="help" id="i2p-name">Belum ada file dipilih.</div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="i2p-go">Buat PDF</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="i2p-out">Belum diproses.</div>
      <div id="i2p-dl"></div>
    </div>
  `;
  const inEl = el.querySelector('#i2p-files');
  const nameEl = el.querySelector('#i2p-name');
  const out = el.querySelector('#i2p-out');
  const dl = el.querySelector('#i2p-dl');

  inEl.addEventListener('change', () => {
    nameEl.textContent = inEl.files.length ? inEl.files.length + ' gambar dipilih' : 'Belum ada file dipilih.';
  });

  el.querySelector('#i2p-go').addEventListener('click', async () => {
    if (!inEl.files.length) { setError(out, 'Pilih gambar dulu.'); return; }
    try {
      setResult(out, 'Memproses...');
      const PDFLib = await loadScript(LIB_PDF, 'PDFLib');
      const pdf = await PDFLib.PDFDocument.create();
      
      for (const file of inEl.files) {
        const bytes = await file.arrayBuffer();
        let img;
        if (file.type === 'image/png') {
          img = await pdf.embedPng(bytes);
        } else {
          img = await pdf.embedJpg(bytes);
        }
        const { width, height } = img.scale(1);
        const page = pdf.addPage([width, height]);
        page.drawImage(img, { x: 0, y: 0, width, height });
      }
      
      const newBytes = await pdf.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      setResult(out, 'Berhasil dibuat PDF dengan ' + inEl.files.length + ' halaman gambar.');
      dl.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary mt-4';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PDF';
      btn.onclick = () => triggerDownload(blob, 'gambar-ke-pdf.pdf');
      dl.appendChild(btn);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 5. textToPdf — Teks ke PDF */
export function textToPdf(el) {
  el.innerHTML = `
    <div class="field">
      <label for="t2p-text">Teks</label>
      <textarea id="t2p-text" rows="8" placeholder="Tempel atau tulis teks di sini..."></textarea>
    </div>
    <div class="field">
      <label for="t2p-size">Ukuran Kertas</label>
      <select id="t2p-size">
        <option value="a4">A4</option>
        <option value="letter">Letter</option>
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="t2p-go">Buat PDF</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="t2p-out">Belum diproses.</div>
      <div id="t2p-dl"></div>
    </div>
  `;
  const out = el.querySelector('#t2p-out');
  const dl = el.querySelector('#t2p-dl');

  el.querySelector('#t2p-go').addEventListener('click', async () => {
    const text = el.querySelector('#t2p-text').value.trim();
    if (!text) { setError(out, 'Masukkan teks dulu.'); return; }
    try {
      setResult(out, 'Memproses...');
      await loadScript(LIB_JSPDF, 'jspdf');
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ format: el.querySelector('#t2p-size').value, unit: 'mm' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const maxLineWidth = pageWidth - margin * 2;
      
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(text, maxLineWidth);
      let y = margin;
      const lineHeight = 6;
      
      lines.forEach(line => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      
      const blob = doc.output('blob');
      setResult(out, 'Berhasil dibuat PDF.');
      dl.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary mt-4';
      btn.innerHTML = '<svg aria-hidden="true"><use href="/assets/icons.svg#i-download"/></svg> Unduh PDF';
      btn.onclick = () => triggerDownload(blob, 'teks.pdf');
      dl.appendChild(btn);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}