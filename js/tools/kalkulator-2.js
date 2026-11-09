// kalkulator-2.js — 5 tool kalkulator berikutnya
import { setResult, setError } from './util.js';

/* 6. compoundInterest — Bunga Majemuk */
export function compoundInterest(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="ci-p">Modal Awal (Rp)</label>
        <input type="number" id="ci-p" placeholder="Contoh: 10000000">
      </div>
      <div class="field">
        <label for="ci-r">Bunga per Tahun (%)</label>
        <input type="number" id="ci-r" placeholder="Contoh: 8" step="0.1">
      </div>
      <div class="field">
        <label for="ci-t">Lama Investasi (Tahun)</label>
        <input type="number" id="ci-t" placeholder="Contoh: 5">
      </div>
      <div class="field">
        <label for="ci-n">Frekuensi Penggandaan</label>
        <select id="ci-n">
          <option value="1">Tahunan</option>
          <option value="2">Semesteran</option>
          <option value="4">Triwulanan</option>
          <option value="12">Bulanan</option>
        </select>
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="ci-go">Hitung</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="ci-out">Belum dihitung.</div>
    </div>
  `;
  const out = el.querySelector('#ci-out');
  const formatRp = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
  
  el.querySelector('#ci-go').addEventListener('click', () => {
    const P = parseFloat(el.querySelector('#ci-p').value);
    const r = parseFloat(el.querySelector('#ci-r').value) / 100;
    const t = parseFloat(el.querySelector('#ci-t').value);
    const n = parseInt(el.querySelector('#ci-n').value);
    
    if (!P || !r || !t || P <= 0 || t <= 0) { setError(out, 'Isi semua kolom dengan benar.'); return; }
    
    // Rumus: A = P(1 + r/n)^(nt)
    const A = P * Math.pow(1 + (r / n), n * t);
    const interest = A - P;
    
    setResult(out, 
      `Total Akhir: ${formatRp(A)}\n` +
      `Bunga Diperoleh: ${formatRp(interest)}\n\n` +
      `Modal Awal: ${formatRp(P)}`
    );
  });
}

/* 7. discountCalculator — Kalkulator Diskon */
export function discountCalculator(el) {
  el.innerHTML = `
    <div class="field">
      <label for="dc-p">Harga Asli (Rp)</label>
      <input type="number" id="dc-p" placeholder="Contoh: 250000">
    </div>
    <div class="tool-grid-2">
      <div class="field">
        <label for="dc-d">Diskon (%)</label>
        <input type="number" id="dc-d" placeholder="Contoh: 20">
      </div>
      <div class="field">
        <label for="dc-t">Pajak/PPN (%)</label>
        <input type="number" id="dc-t" placeholder="Contoh: 11" value="0">
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="dc-go">Hitung Harga</button>
    </div>
    <div class="field mt-4">
      <span class="label">Rincian</span>
      <div class="result is-empty" id="dc-out">Belum dihitung.</div>
    </div>
  `;
  const out = el.querySelector('#dc-out');
  const formatRp = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
  
  el.querySelector('#dc-go').addEventListener('click', () => {
    const p = parseFloat(el.querySelector('#dc-p').value);
    const d = parseFloat(el.querySelector('#dc-d').value) || 0;
    const t = parseFloat(el.querySelector('#dc-t').value) || 0;
    
    if (!p || p <= 0) { setError(out, 'Masukkan harga asli yang valid.'); return; }
    
    const discAmount = p * (d / 100);
    const priceAfterDisc = p - discAmount;
    const taxAmount = priceAfterDisc * (t / 100);
    const finalPrice = priceAfterDisc + taxAmount;
    
    let res = `Harga Asli: ${formatRp(p)}\n`;
    res += `Diskon (${d}%): -${formatRp(discAmount)}\n`;
    res += `Harga Setelah Diskon: ${formatRp(priceAfterDisc)}\n`;
    if (t > 0) {
      res += `Pajak (${t}%): +${formatRp(taxAmount)}\n`;
    }
    res += `\nTotal Akhir: ${formatRp(finalPrice)}`;
    
    setResult(out, res);
  });
}

/* 8. taxCalculator — Kalkulator PPN */
export function taxCalculator(el) {
  el.innerHTML = `
    <div class="field">
      <label for="tx-type">Mode Perhitungan</label>
      <select id="tx-type">
        <option value="add">Tambah PPN (Harga sebelum pajak)</option>
        <option value="extract">Ekstrak PPN (Harga sudah termasuk pajak)</option>
      </select>
    </div>
    <div class="tool-grid-2">
      <div class="field">
        <label for="tx-amt">Nominal (Rp)</label>
        <input type="number" id="tx-amt" placeholder="Contoh: 1000000">
      </div>
      <div class="field">
        <label for="tx-rate">Tarif PPN (%)</label>
        <input type="number" id="tx-rate" value="11" step="0.1">
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="tx-go">Hitung</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="tx-out">Belum dihitung.</div>
    </div>
  `;
  const out = el.querySelector('#tx-out');
  const formatRp = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
  
  el.querySelector('#tx-go').addEventListener('click', () => {
    const type = el.querySelector('#tx-type').value;
    const amt = parseFloat(el.querySelector('#tx-amt').value);
    const rate = parseFloat(el.querySelector('#tx-rate').value);
    
    if (!amt || !rate || amt <= 0) { setError(out, 'Isi nominal dan tarif dengan benar.'); return; }
    
    if (type === 'add') {
      const tax = amt * (rate / 100);
      setResult(out, 
        `Sebelum PPN: ${formatRp(amt)}\n` +
        `Nilai PPN (${rate}%): ${formatRp(tax)}\n` +
        `Total Akhir: ${formatRp(amt + tax)}`
      );
    } else {
      const base = amt / (1 + rate / 100);
      const tax = amt - base;
      setResult(out, 
        `Total (termasuk PPN): ${formatRp(amt)}\n` +
        `Nilai PPN (${rate}%): ${formatRp(tax)}\n` +
        `Harga Dasar: ${formatRp(base)}`
      );
    }
  });
}

/* 9. ageCalculator — Kalkulator Umur */
export function ageCalculator(el) {
  el.innerHTML = `
    <div class="field">
      <label for="ag-date">Tanggal Lahir</label>
      <input type="date" id="ag-date">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="ag-go">Hitung Umur</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="ag-out">Belum dihitung.</div>
    </div>
  `;
  const out = el.querySelector('#ag-out');
  
  el.querySelector('#ag-go').addEventListener('click', () => {
    const dStr = el.querySelector('#ag-date').value;
    if (!dStr) { setError(out, 'Pilih tanggal lahir.'); return; }
    
    const birth = new Date(dStr);
    const now = new Date();
    if (birth > now) { setError(out, 'Tanggal lahir tidak boleh di masa depan.'); return; }
    
    let y = now.getFullYear() - birth.getFullYear();
    let m = now.getMonth() - birth.getMonth();
    let d = now.getDate() - birth.getDate();
    
    if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    
    const diffTime = Math.abs(now - birth);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = (y * 12) + m;
    
    setResult(out, 
      `Umur Anda: ${y} tahun, ${m} bulan, ${d} hari\n\n` +
      `Total bulan: ${diffMonths} bulan\n` +
      `Total minggu: ${diffWeeks} minggu\n` +
      `Total hari: ${diffDays} hari`
    );
  });
}

/* 10. dateDifference — Selisih Tanggal */
export function dateDifference(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="dd-a">Tanggal Awal</label>
        <input type="date" id="dd-a">
      </div>
      <div class="field">
        <label for="dd-b">Tanggal Akhir</label>
        <input type="date" id="dd-b">
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="dd-go">Hitung Selisih</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="dd-out">Belum dihitung.</div>
    </div>
  `;
  const out = el.querySelector('#dd-out');
  
  el.querySelector('#dd-go').addEventListener('click', () => {
    const a = el.querySelector('#dd-a').value;
    const b = el.querySelector('#dd-b').value;
    
    if (!a || !b) { setError(out, 'Pilih kedua tanggal.'); return; }
    
    const d1 = new Date(a);
    const d2 = new Date(b);
    
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    const diffYears = Math.floor(diffMonths / 12);
    
    setResult(out, 
      `Total hari: ${diffDays} hari\n` +
      `Total minggu: ${diffWeeks} minggu\n` +
      `Total bulan: ${Math.abs(diffMonths)} bulan\n` +
      `Total tahun: ${Math.abs(diffYears)} tahun`
    );
  });
}