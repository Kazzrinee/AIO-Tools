// hiburan-1.js — 5 tool hiburan pertama
import { setResult, setError, toast } from './util.js';

/* 1. randomPicker — Pemilih Acak */
export function randomPicker(el) {
  el.innerHTML = `
    <div class="field">
      <label for="rp-in">Daftar Pilihan (satu per baris)</label>
      <textarea id="rp-in" rows="8" placeholder="Budi&#10;Siti&#10;Agus&#10;Dewi"></textarea>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="rp-go">Pilih Acak</button>
    </div>
    <div class="field mt-4">
      <span class="label">Pemenang</span>
      <div class="result is-empty" id="rp-out" style="font-size:2rem; text-align:center; font-family:var(--font-display); font-weight:700; padding:24px;">-</div>
    </div>
  `;
  const out = el.querySelector('#rp-out');
  el.querySelector('#rp-go').addEventListener('click', () => {
    const list = el.querySelector('#rp-in').value.split('\n').map(s => s.trim()).filter(Boolean);
    if (list.length < 2) { setError(out, 'Masukkan minimal 2 pilihan.'); return; }
    
    // Efek loading singkat
    out.textContent = 'Memilih...';
    out.classList.remove('is-empty');
    let count = 0;
    const interval = setInterval(() => {
      out.textContent = list[Math.floor(Math.random() * list.length)];
      count++;
      if (count > 10) {
        clearInterval(interval);
        const winner = list[Math.floor(Math.random() * list.length)];
        out.textContent = winner;
        out.classList.remove('is-anim');
        void out.offsetWidth;
        out.classList.add('is-anim');
      }
    }, 50);
  });
}

/* 2. coinFlip — Lempar Koin */
export function coinFlip(el) {
  el.innerHTML = `
    <div style="text-align:center; margin: 32px 0;">
      <div id="cf-coin" style="width:120px; height:120px; border-radius:50%; border:4px solid var(--border); background:var(--surface); margin:0 auto; display:flex; align-items:center; justify-content:center; font-size:3rem; font-family:var(--font-display); font-weight:700; transition: transform 0.5s ease-out, background 0.2s;">
        ?
      </div>
    </div>
    <div class="tool-actions" style="justify-content:center;">
      <button type="button" class="btn btn-primary" id="cf-go">Lempar Koin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="cf-out" style="text-align:center;">-</div>
    </div>
  `;
  const coin = el.querySelector('#cf-coin');
  const out = el.querySelector('#cf-out');
  
  el.querySelector('#cf-go').addEventListener('click', () => {
    coin.style.transform = 'rotateY(720deg) scale(1.2)';
    setTimeout(() => { coin.style.transform = 'rotateY(0) scale(1)'; }, 500);
    
    setTimeout(() => {
      const res = Math.random() < 0.5 ? 'Angka' : 'Gambar';
      coin.textContent = res === 'Angka' ? 'A' : 'G';
      coin.style.background = res === 'Angka' ? 'var(--cat-hiburan)' : 'var(--accent)';
      coin.style.color = 'var(--ink-inv)';
      setResult(out, `Hasil: ${res}`);
    }, 500);
  });
}

/* 3. diceRoll — Lempar Dadu */
export function diceRoll(el) {
  el.innerHTML = `
    <div class="field">
      <label for="dr-count">Jumlah Dadu (1-5)</label>
      <input type="number" id="dr-count" value="2" min="1" max="5">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="dr-go">Lempar Dadu</button>
    </div>
    <div id="dr-dice" style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin: 24px 0;"></div>
    <div class="field mt-4">
      <span class="label">Total</span>
      <div class="result is-empty" id="dr-out" style="text-align:center; font-size:1.5rem;">-</div>
    </div>
  `;
  const diceEl = el.querySelector('#dr-dice');
  const out = el.querySelector('#dr-out');
  
  el.querySelector('#dr-go').addEventListener('click', () => {
    const count = Math.min(5, Math.max(1, parseInt(el.querySelector('#dr-count').value) || 1));
    diceEl.innerHTML = '';
    let total = 0;
    
    for (let i = 0; i < count; i++) {
      const val = Math.floor(Math.random() * 6) + 1;
      total += val;
      const box = document.createElement('div');
      box.style.cssText = 'width:64px; height:64px; border:var(--bw-strong) solid var(--border); border-radius:8px; background:var(--surface); display:flex; align-items:center; justify-content:center; font-size:2rem; font-family:var(--font-mono); font-weight:700; animation:fade-up 0.3s ease-out;';
      box.textContent = val;
      diceEl.appendChild(box);
    }
    setResult(out, `Total: ${total}`);
  });
  el.querySelector('#dr-go').click();
}

/* 4. numberGenerator — Angka Acak */
export function numberGenerator(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="ng-min">Minimal</label>
        <input type="number" id="ng-min" value="1">
      </div>
      <div class="field">
        <label for="ng-max">Maksimal</label>
        <input type="number" id="ng-max" value="100">
      </div>
    </div>
    <div class="field">
      <label for="ng-count">Jumlah angka</label>
      <input type="number" id="ng-count" value="5" min="1" max="50">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="ng-go">Generate</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="ng-out" style="font-family:var(--font-mono);">-</div>
    </div>
  `;
  const out = el.querySelector('#ng-out');
  el.querySelector('#ng-go').addEventListener('click', () => {
    const min = parseInt(el.querySelector('#ng-min').value);
    const max = parseInt(el.querySelector('#ng-max').value);
    const count = Math.min(50, Math.max(1, parseInt(el.querySelector('#ng-count').value) || 5));
    
    if (isNaN(min) || isNaN(max) || min > max) { setError(out, 'Rentang angka tidak valid.'); return; }
    
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    setResult(out, results.join(', '));
  });
}

/* 5. randomQuote — Quote Acak */
export function randomQuote(el) {
  const quotes = [
    { t: "Hidup adalah perjalanan, bukan tujuan.", a: "Anonim" },
    { t: "Orang yang berhenti belajar akan menjadi pemilik masa lalu.", a: "Anonim" },
    { t: "Jangan takut gagal, takutlah untuk tidak mencoba.", a: "Anonim" },
    { t: "Kesuksesan berawal dari keberanian bermimpi.", a: "Anonim" },
    { t: "Waktu terbaik untuk menanam pohon adalah 20 tahun yang lalu. Waktu terbaik kedua adalah sekarang.", a: "Pepatah Cina" },
    { t: "Kebahagiaan bukan sesuatu yang siap pakai. Ia datang dari tindakan Anda sendiri.", a: "Dalai Lama" },
    { t: "Ilmu tanpa amal bagaikan pohon tanpa buah.", a: "Pepatah Arab" },
    { t: "Barang siapa bersungguh-sungguh, maka ia akan mendapatkan apa yang ia inginkan.", a: "Pepatah Arab" },
    { t: "Janganlah kamu berduka cita, sesungguhnya Allah beserta kita.", a: "QS. At-Taubah: 40" },
    { t: "Sesungguhnya bersama kesulitan ada kemudahan.", a: "QS. Al-Insyirah: 6" }
  ];
  
  el.innerHTML = `
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="rq-go">Quote Baru</button>
    </div>
    <div class="field mt-4">
      <div class="result" id="rq-out" style="font-family:var(--font-edit); font-style:italic; font-size:1.25rem; padding:32px; text-align:center; min-height:150px; display:flex; flex-direction:column; justify-content:center;">
        -
      </div>
    </div>
  `;
  const out = el.querySelector('#rq-out');
  
  const render = () => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    out.innerHTML = `
      <div style="margin-bottom:16px;">"${q.t}"</div>
      <div style="font-family:var(--font-body); font-style:normal; font-size:0.9rem; color:var(--ink-muted);">— ${q.a}</div>
    `;
  };
  
  el.querySelector('#rq-go').addEventListener('click', render);
  render();
}