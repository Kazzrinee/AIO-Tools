// pelajar-2.js — 5 tool pelajar berikutnya
import { setResult, setError, toast } from './util.js';

/* 6. kanbanBoard — Kanban Sederhana */
export function kanbanBoard(el) {
  el.innerHTML = `
    <div class="field" style="display:flex; gap:8px;">
      <input type="text" id="kb-in" placeholder="Tugas baru..." style="flex:1;">
      <button type="button" class="btn btn-primary" id="kb-add">Tambah</button>
    </div>
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-top:16px;">
      <div>
        <div style="font-family:var(--font-display); font-weight:700; text-align:center; border-bottom:var(--bw-strong) solid var(--border); padding-bottom:4px;">To-Do</div>
        <div id="kb-todo" style="min-height:100px; padding-top:8px;"></div>
      </div>
      <div>
        <div style="font-family:var(--font-display); font-weight:700; text-align:center; border-bottom:var(--bw-strong) solid var(--border); padding-bottom:4px;">Proses</div>
        <div id="kb-doing" style="min-height:100px; padding-top:8px;"></div>
      </div>
      <div>
        <div style="font-family:var(--font-display); font-weight:700; text-align:center; border-bottom:var(--bw-strong) solid var(--border); padding-bottom:4px;">Selesai</div>
        <div id="kb-done" style="min-height:100px; padding-top:8px;"></div>
      </div>
    </div>
  `;
  let data = JSON.parse(localStorage.getItem('aio-kanban') || '[]');
  
  const render = () => {
    const cols = { todo: '', doing: '', done: '' };
    data.forEach(t => {
      const card = `
        <div style="background:var(--surface); border:var(--bw) solid var(--border); border-radius:var(--r-md); padding:8px; margin-bottom:8px; box-shadow:1px 1px 0 var(--border);">
          <div style="font-size:14px; margin-bottom:8px;">${t.text}</div>
          <div style="display:flex; justify-content:space-between;">
            ${t.status !== 'todo' ? `<button type="button" class="btn btn-sm" style="padding:2px 6px; min-height:24px;" data-id="${t.id}" data-move="-1">&larr;</button>` : '<span></span>'}
            <button type="button" class="btn btn-sm" style="padding:2px 6px; min-height:24px; color:var(--danger);" data-id="${t.id}" data-del="1">&times;</button>
            ${t.status !== 'done' ? `<button type="button" class="btn btn-sm" style="padding:2px 6px; min-height:24px;" data-id="${t.id}" data-move="1">&rarr;</button>` : '<span></span>'}
          </div>
        </div>
      `;
      cols[t.status] += card;
    });
    el.querySelector('#kb-todo').innerHTML = cols.todo || '<div style="font-size:12px; color:var(--ink-muted); text-align:center;">Kosong</div>';
    el.querySelector('#kb-doing').innerHTML = cols.doing || '<div style="font-size:12px; color:var(--ink-muted); text-align:center;">Kosong</div>';
    el.querySelector('#kb-done').innerHTML = cols.done || '<div style="font-size:12px; color:var(--ink-muted); text-align:center;">Kosong</div>';
    
    el.querySelectorAll('[data-move]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const dir = parseInt(btn.dataset.move);
        const item = data.find(t => t.id === id);
        if (!item) return;
        if (dir === -1 && item.status === 'doing') item.status = 'todo';
        if (dir === -1 && item.status === 'done') item.status = 'doing';
        if (dir === 1 && item.status === 'todo') item.status = 'doing';
        if (dir === 1 && item.status === 'doing') item.status = 'done';
        save(); render();
      });
    });
    el.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        data = data.filter(t => t.id !== id);
        save(); render();
      });
    });
  };

  const save = () => localStorage.setItem('aio-kanban', JSON.stringify(data));

  el.querySelector('#kb-add').addEventListener('click', () => {
    const txt = el.querySelector('#kb-in').value.trim();
    if (!txt) return;
    data.push({ id: Date.now(), text: txt, status: 'todo' });
    el.querySelector('#kb-in').value = '';
    save(); render();
  });
  el.querySelector('#kb-in').addEventListener('keydown', (e) => { if (e.key === 'Enter') el.querySelector('#kb-add').click(); });

  render();
}

/* 7. averageCalculator — Kalkulator Rata-rata */
export function averageCalculator(el) {
  el.innerHTML = `
    <div class="field">
      <label for="av-in">Angka (pisahkan dengan spasi, koma, atau baris baru)</label>
      <textarea id="av-in" rows="5" placeholder="Contoh: 80, 90, 85, 95"></textarea>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="av-go">Hitung</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="av-out">Belum dihitung.</div>
    </div>
  `;
  const out = el.querySelector('#av-out');
  el.querySelector('#av-go').addEventListener('click', () => {
    const raw = el.querySelector('#av-in').value;
    const nums = raw.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    if (nums.length === 0) { setError(out, 'Masukkan angka yang valid.'); return; }
    
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = sum / nums.length;
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    setResult(out, 
      `Jumlah data: ${nums.length}\n` +
      `Rata-rata (Mean): ${avg.toFixed(2)}\n` +
      `Median: ${median}\n` +
      `Terkecil (Min): ${min}\n` +
      `Terbesar (Max): ${max}\n` +
      `Total (Sum): ${sum}`
    );
  });
}

/* 8. countdownTimer — Timer Hitung Mundur */
export function countdownTimer(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="cd-m">Menit</label>
        <input type="number" id="cd-m" value="5" min="0" max="99">
      </div>
      <div class="field">
        <label for="cd-s">Detik</label>
        <input type="number" id="cd-s" value="0" min="0" max="59">
      </div>
    </div>
    <div class="field" style="text-align:center; margin-top:24px;">
      <div class="result" id="cd-time" style="font-size:4rem; font-family:var(--font-mono); font-weight:700; padding:32px; border:none; background:none; color:var(--ink);">05:00</div>
    </div>
    <div class="tool-actions" style="justify-content:center;">
      <button type="button" class="btn btn-primary" id="cd-start">Mulai</button>
      <button type="button" class="btn" id="cd-reset">Reset</button>
    </div>
  `;
  const mIn = el.querySelector('#cd-m');
  const sIn = el.querySelector('#cd-s');
  const timeEl = el.querySelector('#cd-time');
  const startBtn = el.querySelector('#cd-start');
  let timer = null;
  let isRunning = false;

  const updateDisplay = () => {
    const m = parseInt(mIn.value) || 0;
    const s = parseInt(sIn.value) || 0;
    timeEl.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  [mIn, sIn].forEach(i => i.addEventListener('input', () => { if (!isRunning) updateDisplay(); }));

  startBtn.addEventListener('click', () => {
    if (isRunning) {
      clearInterval(timer);
      isRunning = false;
      startBtn.textContent = 'Lanjut';
      return;
    }
    let totalSec = (parseInt(mIn.value) || 0) * 60 + (parseInt(sIn.value) || 0);
    if (totalSec <= 0) { toast('Atur waktu dulu.'); return; }
    
    isRunning = true;
    startBtn.textContent = 'Jeda';
    
    timer = setInterval(() => {
      totalSec--;
      if (totalSec < 0) {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = 'Mulai';
        toast('Waktu habis!');
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          osc.connect(ctx.destination);
          osc.start(); osc.stop(ctx.currentTime + 1);
        } catch {}
        return;
      }
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      timeEl.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, 1000);
  });

  el.querySelector('#cd-reset').addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = 'Mulai';
    mIn.value = 5; sIn.value = 0;
    updateDisplay();
  });
}

/* 9. stopwatch — Stopwatch */
export function stopwatch(el) {
  el.innerHTML = `
    <div class="field" style="text-align:center; margin-top:16px;">
      <div class="result" id="sw-time" style="font-size:4rem; font-family:var(--font-mono); font-weight:700; padding:32px; border:none; background:none; color:var(--ink);">00:00.00</div>
    </div>
    <div class="tool-actions" style="justify-content:center;">
      <button type="button" class="btn btn-primary" id="sw-start">Mulai</button>
      <button type="button" class="btn" id="sw-lap">Lap</button>
      <button type="button" class="btn" id="sw-reset">Reset</button>
    </div>
    <div class="field mt-4">
      <span class="label">Lap</span>
      <div class="result" id="sw-laps" style="max-height:150px; overflow:auto; font-family:var(--font-mono); font-size:14px;">Belum ada lap.</div>
    </div>
  `;
  const timeEl = el.querySelector('#sw-time');
  const startBtn = el.querySelector('#sw-start');
  const lapBtn = el.querySelector('#sw-lap');
  const resetBtn = el.querySelector('#sw-reset');
  const lapsEl = el.querySelector('#sw-laps');
  
  let startTime = 0;
  let elapsed = 0;
  let timer = null;
  let isRunning = false;
  let laps = [];

  const format = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    const cs = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${m}:${s}.${cs}`;
  };

  const update = () => {
    timeEl.textContent = format(elapsed + (Date.now() - startTime));
  };

  startBtn.addEventListener('click', () => {
    if (isRunning) {
      clearInterval(timer);
      elapsed += Date.now() - startTime;
      startBtn.textContent = 'Lanjut';
    } else {
      startTime = Date.now();
      timer = setInterval(update, 30);
      startBtn.textContent = 'Jeda';
    }
    isRunning = !isRunning;
  });

  lapBtn.addEventListener('click', () => {
    if (!isRunning) return;
    const current = elapsed + (Date.now() - startTime);
    laps.push(current);
    let html = '';
    laps.forEach((t, i) => {
      html += `<div style="padding:4px 0; border-bottom:1px solid var(--border-muted);">Lap ${i + 1}: ${format(t)}</div>`;
    });
    lapsEl.innerHTML = html;
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    elapsed = 0;
    laps = [];
    startBtn.textContent = 'Mulai';
    timeEl.textContent = '00:00.00';
    lapsEl.innerHTML = 'Belum ada lap.';
  });
}

/* 10. groupRandomizer — Pengacak Kelompok */
export function groupRandomizer(el) {
  el.innerHTML = `
    <div class="field">
      <label for="gr-in">Daftar Nama (satu per baris)</label>
      <textarea id="gr-in" rows="6" placeholder="Budi&#10;Siti&#10;Agus&#10;Dewi&#10;Rina&#10;Joko"></textarea>
    </div>
    <div class="field">
      <label for="gr-size">Jumlah per Kelompok</label>
      <input type="number" id="gr-size" value="2" min="1">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="gr-go">Bagi Kelompok</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="gr-out">Belum diproses.</div>
    </div>
  `;
  const out = el.querySelector('#gr-out');
  el.querySelector('#gr-go').addEventListener('click', () => {
    const names = el.querySelector('#gr-in').value.split('\n').map(s => s.trim()).filter(Boolean);
    const size = parseInt(el.querySelector('#gr-size').value);
    
    if (names.length < 2) { setError(out, 'Masukkan minimal 2 nama.'); return; }
    if (!size || size < 1) { setError(out, 'Ukuran kelompok tidak valid.'); return; }

    // Fisher-Yates Shuffle
    for (let i = names.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [names[i], names[j]] = [names[j], names[i]];
    }

    let res = '';
    let groupNum = 1;
    for (let i = 0; i < names.length; i += size) {
      const chunk = names.slice(i, i + size);
      res += `Kelompok ${groupNum}:\n`;
      chunk.forEach(n => { res += `- ${n}\n`; });
      res += '\n';
      groupNum++;
    }
    
    setResult(out, res.trim());
  });
}