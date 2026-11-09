// kalkulator-1.js — 5 tool kalkulator pertama
import { setResult, setError } from './util.js';

/* 1. basicCalculator — Kalkulator Umum */
export function basicCalculator(el) {
  el.innerHTML = `
    <div class="field">
      <label for="bc-in" class="sr-only">Ekspresi Matematika</label>
      <input type="text" id="bc-in" placeholder="Contoh: 12 + 5 * 3 / 2" style="font-size:24px; height:60px; text-align:right; font-family:var(--font-mono);">
    </div>
    <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin-top:12px;">
      <button type="button" class="btn" data-val="7">7</button>
      <button type="button" class="btn" data-val="8">8</button>
      <button type="button" class="btn" data-val="9">9</button>
      <button type="button" class="btn" data-val="/">÷</button>
      
      <button type="button" class="btn" data-val="4">4</button>
      <button type="button" class="btn" data-val="5">5</button>
      <button type="button" class="btn" data-val="6">6</button>
      <button type="button" class="btn" data-val="*">×</button>
      
      <button type="button" class="btn" data-val="1">1</button>
      <button type="button" class="btn" data-val="2">2</button>
      <button type="button" class="btn" data-val="3">3</button>
      <button type="button" class="btn" data-val="-">-</button>
      
      <button type="button" class="btn" data-val="0">0</button>
      <button type="button" class="btn" data-val=".">.</button>
      <button type="button" class="btn btn-primary" id="bc-eq">=</button>
      <button type="button" class="btn" data-val="+">+</button>
    </div>
    <div class="tool-actions mt-4">
      <button type="button" class="btn" data-val="C">Clear (C)</button>
      <button type="button" class="btn" data-val="back">Hapus 1</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="bc-out" style="font-size: 24px; text-align: right;">0</div>
    </div>
  `;
  const input = el.querySelector('#bc-in');
  const out = el.querySelector('#bc-out');

  const evaluate = (str) => {
    // Sanitasi ketat: hanya izinkan angka, titik, spasi, dan operator + - * / % ( )
    const sanitized = str.replace(/[^0-9\.\+\-\*\/\%\(\)\s]/g, '');
    if (!sanitized) return null;
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + sanitized)();
      if (!isFinite(result)) return 'Error';
      // Bulatkan maksimal 10 desimal
      return Math.round(result * 10000000000) / 10000000000;
    } catch { return null; }
  };

  el.querySelectorAll('[data-val]').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.val;
      if (v === 'C') {
        input.value = '';
        out.textContent = '0';
        out.classList.add('is-empty');
      } else if (v === 'back') {
        input.value = input.value.slice(0, -1);
      } else {
        input.value += v;
      }
      input.focus();
    });
  });

  el.querySelector('#bc-eq').addEventListener('click', () => {
    const res = evaluate(input.value);
    if (res === null) { setError(out, 'Ekspresi tidak valid.'); }
    else if (res === 'Error') { setError(out, 'Pembagian dengan nol.'); }
    else { setResult(out, String(res)); }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') el.querySelector('#bc-eq').click();
  });
}

/* 2. percentageCalculator — Kalkulator Persentase */
export function percentageCalculator(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="pc-a">Berapa <input type="number" id="pc-a" value="20" style="width:60px; padding:2px; text-align:center;"> % dari <input type="number" id="pc-b" value="500" style="width:80px; padding:2px; text-align:center;"> ?</label>
      </div>
      <div class="field">
        <label for="pc-c">Angka <input type="number" id="pc-c" value="30" style="width:70px; padding:2px; text-align:center;"> adalah berapa % dari <input type="number" id="pc-d" value="150" style="width:70px; padding:2px; text-align:center;"> ?</label>
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="pc-go">Hitung</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="pc-out">Belum dihitung.</div>
    </div>
  `;
  const out = el.querySelector('#pc-out');
  el.querySelector('#pc-go').addEventListener('click', () => {
    const a = parseFloat(el.querySelector('#pc-a').value);
    const b = parseFloat(el.querySelector('#pc-b').value);
    const c = parseFloat(el.querySelector('#pc-c').value);
    const d = parseFloat(el.querySelector('#pc-d').value);
    
    let res = '';
    if (!isNaN(a) && !isNaN(b)) res += `${a}% dari ${b} = ${(a / 100) * b}\n`;
    if (!isNaN(c) && !isNaN(d) && d !== 0) res += `${c} adalah ${(c / d) * 100}% dari ${d}\n`;
    
    if (res) setResult(out, res.trim());
    else setError(out, 'Isi angka yang valid.');
  });
}

/* 3. bmiCalculator — Kalkulator BMI */
export function bmiCalculator(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="bmi-w">Berat Badan (kg)</label>
        <input type="number" id="bmi-w" placeholder="Contoh: 65" step="0.1">
      </div>
      <div class="field">
        <label for="bmi-h">Tinggi Badan (cm)</label>
        <input type="number" id="bmi-h" placeholder="Contoh: 170" step="0.1">
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="bmi-go">Hitung BMI</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="bmi-out">Belum dihitung.</div>
      <div id="bmi-cat" style="margin-top:12px; font-weight:700;"></div>
    </div>
  `;
  const out = el.querySelector('#bmi-out');
  const cat = el.querySelector('#bmi-cat');
  
  el.querySelector('#bmi-go').addEventListener('click', () => {
    const w = parseFloat(el.querySelector('#bmi-w').value);
    const h = parseFloat(el.querySelector('#bmi-h').value) / 100;
    if (!w || !h || w <= 0 || h <= 0) { setError(out, 'Masukkan berat dan tinggi yang valid.'); cat.textContent = ''; return; }
    
    const bmi = w / (h * h);
    let label = '', color = '';
    
    if (bmi < 18.5) { label = 'Kekurangan Berat Badan (Underweight)'; color = 'var(--cat-konverter)'; }
    else if (bmi < 25) { label = 'Normal (Ideal)'; color = 'var(--cat-kalkulator)'; }
    else if (bmi < 30) { label = 'Kelebihan Berat Badan (Overweight)'; color = 'var(--cat-gambar)'; }
    else { label = 'Obesitas'; color = 'var(--danger)'; }
    
    setResult(out, `BMI Anda: ${bmi.toFixed(1)}`);
    cat.textContent = label;
    cat.style.color = color;
    cat.style.borderLeft = `4px solid ${color}`;
    cat.style.paddingLeft = '8px';
  });
}

/* 4. calorieCalculator — Kalkulator Kalori (BMR) */
export function calorieCalculator(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="cal-g">Jenis Kelamin</label>
        <select id="cal-g"><option value="m">Pria</option><option value="f">Wanita</option></select>
      </div>
      <div class="field">
        <label for="cal-age">Usia (tahun)</label>
        <input type="number" id="cal-age" placeholder="25">
      </div>
      <div class="field">
        <label for="cal-w">Berat (kg)</label>
        <input type="number" id="cal-w" placeholder="65">
      </div>
      <div class="field">
        <label for="cal-h">Tinggi (cm)</label>
        <input type="number" id="cal-h" placeholder="170">
      </div>
      <div class="field">
        <label for="cal-act">Aktivitas</label>
        <select id="cal-act">
          <option value="1.2">Jarang olahraga (sedentary)</option>
          <option value="1.375">Olahraga ringan (1-3 hari/minggu)</option>
          <option value="1.55">Olahraga sedang (3-5 hari/minggu)</option>
          <option value="1.725">Olahraga berat (6-7 hari/minggu)</option>
          <option value="1.9">Sangat berat (atlet/pekerja fisik)</option>
        </select>
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="cal-go">Hitung Kalori</button>
    </div>
    <div class="field mt-4">
      <span class="label">Kebutuhan Kalori Harian</span>
      <div class="result is-empty" id="cal-out">Belum dihitung.</div>
    </div>
  `;
  const out = el.querySelector('#cal-out');
  el.querySelector('#cal-go').addEventListener('click', () => {
    const g = el.querySelector('#cal-g').value;
    const age = parseInt(el.querySelector('#cal-age').value);
    const w = parseFloat(el.querySelector('#cal-w').value);
    const h = parseFloat(el.querySelector('#cal-h').value);
    const act = parseFloat(el.querySelector('#cal-act').value);
    
    if (!age || !w || !h) { setError(out, 'Isi usia, berat, dan tinggi.'); return; }
    
    // Rumus Mifflin-St Jeor
    let bmr = (10 * w) + (6.25 * h) - (5 * age);
    bmr += (g === 'm' ? 5 : -161);
    const tdee = bmr * act;
    
    setResult(out, 
      `BMR (Kalori basal): ${Math.round(bmr)} kkal/hari\n` +
      `TDEE (Total kebutuhan): ${Math.round(tdee)} kkal/hari\n\n` +
      `Untuk turun berat: ${Math.round(tdee - 500)} kkal\n` +
      `Untuk naik berat: ${Math.round(tdee + 500)} kkal`
    );
  });
}

/* 5. loanCalculator — Kalkulator Cicilan */
export function loanCalculator(el) {
  el.innerHTML = `
    <div class="field">
      <label for="ln-p">Jumlah Pinjaman (Rp)</label>
      <input type="number" id="ln-p" placeholder="Contoh: 100000000">
    </div>
    <div class="tool-grid-2">
      <div class="field">
        <label for="ln-r">Bunga per Tahun (%)</label>
        <input type="number" id="ln-r" placeholder="Contoh: 6.5" step="0.1">
      </div>
      <div class="field">
        <label for="ln-t">Tenor (Bulan)</label>
        <input type="number" id="ln-t" placeholder="Contoh: 60">
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="ln-go">Hitung Cicilan</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="ln-out">Belum dihitung.</div>
    </div>
  `;
  const out = el.querySelector('#ln-out');
  const formatRp = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
  
  el.querySelector('#ln-go').addEventListener('click', () => {
    const P = parseFloat(el.querySelector('#ln-p').value);
    const r = parseFloat(el.querySelector('#ln-r').value) / 100 / 12;
    const n = parseInt(el.querySelector('#ln-t').value);
    
    if (!P || !n || P <= 0 || n <= 0) { setError(out, 'Isi jumlah pinjaman dan tenor dengan benar.'); return; }
    
    let monthly;
    if (r === 0) {
      monthly = P / n;
    } else {
      monthly = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    
    const total = monthly * n;
    const interest = total - P;
    
    setResult(out, 
      `Cicilan per bulan: ${formatRp(monthly)}\n\n` +
      `Total pinjaman: ${formatRp(P)}\n` +
      `Total bunga: ${formatRp(interest)}\n` +
      `Total pembayaran: ${formatRp(total)}`
    );
  });
}