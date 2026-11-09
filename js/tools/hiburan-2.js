// hiburan-2.js — 5 tool hiburan berikutnya
import { setResult, setError, toast } from './util.js';

/* 6. spinWheel — Roda Undian */
export function spinWheel(el) {
  el.innerHTML = `
    <div class="field">
      <label for="sw-in">Pilihan (satu per baris, maks 8)</label>
      <textarea id="sw-in" rows="5">Nasi Goreng\nMie Ayam\nSate\nBakso\nSoto\nGado-Gado</textarea>
    </div>
    <div style="position:relative; width:280px; height:280px; margin:20px auto;">
      <canvas id="sw-canvas" width="280" height="280" style="cursor:pointer; border-radius:50%; border:4px solid var(--border);"></canvas>
      <div style="position:absolute; top:-10px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:12px solid transparent; border-right:12px solid transparent; border-top:20px solid var(--accent);"></div>
    </div>
    <div class="tool-actions" style="justify-content:center;">
      <button type="button" class="btn btn-primary" id="sw-go">Putar Roda</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="sw-out" style="text-align:center; font-size:1.5rem; font-weight:700;">-</div>
    </div>
  `;
  const canvas = el.querySelector('#sw-canvas');
  const ctx = canvas.getContext('2d');
  const out = el.querySelector('#sw-out');
  const colors = ['#234876', '#155A4A', '#9A4A28', '#5A3D5F', '#2E5A2E', '#8A6216', '#8B2E2E', '#3A4A5C'];
  
  let currentAngle = 0;
  let isSpinning = false;

  const drawWheel = () => {
    const items = el.querySelector('#sw-in').value.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 8);
    const arc = (Math.PI * 2) / items.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < items.length; i++) {
      const start = i * arc + currentAngle;
      const end = start + arc;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, start, end);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = 'var(--border)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Teks
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(items[i], canvas.width / 2 - 16, 5);
      ctx.restore();
    }
  };

  el.querySelector('#sw-in').addEventListener('input', drawWheel);

  el.querySelector('#sw-go').addEventListener('click', () => {
    if (isSpinning) return;
    const items = el.querySelector('#sw-in').value.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 8);
    if (items.length < 2) { setError(out, 'Masukkan minimal 2 pilihan.'); return; }
    
    isSpinning = true;
    setError(out, 'Memutar...');
    
    // Putar selama 3 detik
    const startAngle = currentAngle;
    const targetAngle = startAngle + Math.PI * 2 * (5 + Math.random() * 3); // Putar 5-8 kali
    const startTime = Date.now();
    const duration = 3000;
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / duration);
      // Easing out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      currentAngle = startAngle + (targetAngle - startAngle) * eased;
      
      drawWheel();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isSpinning = false;
        // Hitung pemenang
        // Titik panah ada di atas (sudut 270 derajat atau -90 derajat)
        const arc = (Math.PI * 2) / items.length;
        // Normalisasi sudut akhir agar berada di 0-2PI
        let finalAngle = currentAngle % (Math.PI * 2);
        if (finalAngle < 0) finalAngle += Math.PI * 2;
        
        // Cari index berdasarkan sudut
        // Karena kita menggambar searah jarum jam mulai dari sudut 0 (kanan),
        // dan panah ada di atas, kita perlu menyesuaikan perhitungan
        const pointerAngle = Math.PI * 1.5; 
        let diff = pointerAngle - finalAngle;
        if (diff < 0) diff += Math.PI * 2;
        
        const index = Math.floor(diff / arc) % items.length;
        setResult(out, items[index]);
      }
    };
    
    animate();
  });

  drawWheel();
}

/* 7. nameGenerator — Generator Nama */
export function nameGenerator(el) {
  const firstM = ['Budi', 'Agus', 'Joko', 'Rizky', 'Fajar', 'Hendra', 'Dimas', 'Andi'];
  const firstF = ['Siti', 'Dewi', 'Rina', 'Ayu', 'Putri', 'Indah', 'Lestari', 'Maya'];
  const last = ['Santoso', 'Wijaya', 'Pratama', 'Kusuma', 'Saputra', 'Hidayat', 'Nugroho', 'Siregar'];
  
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="ng-gender">Jenis Kelamin</label>
        <select id="ng-gender">
          <option value="m">Pria</option>
          <option value="f">Wanita</option>
        </select>
      </div>
      <div class="field">
        <label for="ng-count">Jumlah Nama</label>
        <input type="number" id="ng-count" value="5" min="1" max="20">
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="ng-go">Generate Nama</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="ng-out" style="font-family:var(--font-mono);">-</div>
    </div>
  `;
  const out = el.querySelector('#ng-out');
  el.querySelector('#ng-go').addEventListener('click', () => {
    const gender = el.querySelector('#ng-gender').value;
    const count = Math.min(20, Math.max(1, parseInt(el.querySelector('#ng-count').value) || 5));
    const pool = gender === 'm' ? firstM : firstF;
    const res = [];
    
    for (let i = 0; i < count; i++) {
      const f = pool[Math.floor(Math.random() * pool.length)];
      const l = last[Math.floor(Math.random() * last.length)];
      res.push(`${f} ${l}`);
    }
    setResult(out, res.join('\n'));
  });
}

/* 8. rockPaperScissors — Suit (Batu Gunting Kertas) */
export function rockPaperScissors(el) {
  const choices = [
    { id: 'rock', label: 'Batu', icon: 'i-square' },
    { id: 'paper', label: 'Kertas', icon: 'i-file-text' },
    { id: 'scissors', label: 'Gunting', icon: 'i-scissors' }
  ];
  
  el.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-bottom:16px;">
      <div class="field" style="text-align:center;">
        <span class="label">Komputer</span>
        <div class="result" id="rps-comp" style="font-size:2rem; display:flex; align-items:center; justify-content:center; height:80px;">?</div>
      </div>
      <div class="field" style="text-align:center; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-weight:700; font-size:1.5rem;">VS</div>
      <div class="field" style="text-align:center;">
        <span class="label">Anda</span>
        <div class="result" id="rps-you" style="font-size:2rem; display:flex; align-items:center; justify-content:center; height:80px;">?</div>
      </div>
    </div>
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
      <button type="button" class="btn" data-choice="rock" style="flex-direction:column; height:80px;">
        <svg aria-hidden="true" style="width:24px; height:24px; margin-bottom:4px;"><use href="/assets/icons.svg#i-square"/></svg> Batu
      </button>
      <button type="button" class="btn" data-choice="paper" style="flex-direction:column; height:80px;">
        <svg aria-hidden="true" style="width:24px; height:24px; margin-bottom:4px;"><use href="/assets/icons.svg#i-file-text"/></svg> Kertas
      </button>
      <button type="button" class="btn" data-choice="scissors" style="flex-direction:column; height:80px;">
        <svg aria-hidden="true" style="width:24px; height:24px; margin-bottom:4px;"><use href="/assets/icons.svg#i-scissors"/></svg> Gunting
      </button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="rps-out" style="text-align:center; font-weight:700;">Pilih senjata Anda.</div>
    </div>
  `;
  
  const compEl = el.querySelector('#rps-comp');
  const youEl = el.querySelector('#rps-you');
  const out = el.querySelector('#rps-out');
  
  el.querySelectorAll('[data-choice]').forEach(btn => {
    btn.addEventListener('click', () => {
      const you = btn.dataset.choice;
      const comp = choices[Math.floor(Math.random() * 3)].id;
      
      youEl.innerHTML = `<svg style="width:40px;height:40px;"><use href="/assets/icons.svg#${choices.find(c => c.id === you).icon}"/></svg>`;
      compEl.innerHTML = `<svg style="width:40px;height:40px;"><use href="/assets/icons.svg#${choices.find(c => c.id === comp).icon}"/></svg>`;
      
      if (you === comp) setResult(out, 'Seri!');
      else if ((you === 'rock' && comp === 'scissors') || (you === 'paper' && comp === 'rock') || (you === 'scissors' && comp === 'paper')) setResult(out, 'Anda Menang!');
      else setResult(out, 'Komputer Menang!');
    });
  });
}

/* 9. multiCoinFlip — Lempar Banyak Koin */
export function multiCoinFlip(el) {
  el.innerHTML = `
    <div class="field">
      <label for="mc-count">Jumlah Koin (1-100)</label>
      <input type="number" id="mc-count" value="10" min="1" max="100">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="mc-go">Lempar</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="mc-out" style="text-align:center; font-size:1.25rem;">-</div>
    </div>
  `;
  const out = el.querySelector('#mc-out');
  el.querySelector('#mc-go').addEventListener('click', () => {
    const count = Math.min(100, Math.max(1, parseInt(el.querySelector('#mc-count').value) || 10));
    let heads = 0;
    let tails = 0;
    for (let i = 0; i < count; i++) {
      if (Math.random() < 0.5) heads++; else tails++;
    }
    setResult(out, `Angka (A): ${heads}\nGambar (G): ${tails}\n\nTotal: ${count} koin`);
  });
}

/* 10. giftDraw — Undian Hadiah */
export function giftDraw(el) {
  el.innerHTML = `
    <div class="field">
      <label for="gd-in">Daftar Peserta (satu per baris)</label>
      <textarea id="gd-in" rows="6" placeholder="Peserta 1&#10;Peserta 2&#10;Peserta 3"></textarea>
    </div>
    <div class="field">
      <label for="gd-prize">Nama Hadiah</label>
      <input type="text" id="gd-prize" placeholder="Contoh: Voucher 100rb" value="Hadiah Utama">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="gd-go">Tarik Undian</button>
    </div>
    <div class="field mt-4">
      <div class="result is-empty" id="gd-out" style="text-align:center; padding:32px;">
        <div style="font-size:3rem; margin-bottom:12px;"><svg style="width:48px;height:48px;display:inline-block;"><use href="/assets/icons.svg#i-gift"/></svg></div>
        <div style="font-family:var(--font-display); font-weight:700; font-size:1.5rem;" id="gd-winner">-</div>
        <div style="font-size:0.9rem; color:var(--ink-muted); margin-top:8px;" id="gd-prize-label"></div>
      </div>
    </div>
  `;
  const out = el.querySelector('#gd-out');
  const winnerEl = el.querySelector('#gd-winner');
  const prizeLabel = el.querySelector('#gd-prize-label');
  
  el.querySelector('#gd-go').addEventListener('click', () => {
    const list = el.querySelector('#gd-in').value.split('\n').map(s => s.trim()).filter(Boolean);
    const prize = el.querySelector('#gd-prize').value || 'Hadiah';
    
    if (list.length < 1) { setError(out, 'Masukkan minimal 1 peserta.'); return; }
    
    out.classList.remove('is-empty');
    winnerEl.textContent = 'Mengocok...';
    prizeLabel.textContent = prize;
    
    let count = 0;
    const interval = setInterval(() => {
      winnerEl.textContent = list[Math.floor(Math.random() * list.length)];
      count++;
      if (count > 15) {
        clearInterval(interval);
        winnerEl.textContent = list[Math.floor(Math.random() * list.length)];
        winnerEl.classList.remove('is-anim');
        void winnerEl.offsetWidth;
        winnerEl.classList.add('is-anim');
      }
    }, 60);
  });
}