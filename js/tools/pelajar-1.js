// pelajar-1.js — 5 tool pelajar pertama
import { setResult, setError, toast } from './util.js';

/* 1. pomodoroTimer — Pomodoro Timer */
export function pomodoroTimer(el) {
  el.innerHTML = `
    <div class="field" style="text-align:center;">
      <span class="label" id="pomo-status" style="font-size:1.2rem; color:var(--accent);">Waktu Fokus (25:00)</span>
      <div class="result" id="pomo-time" style="font-size:4rem; font-family:var(--font-mono); font-weight:700; padding:32px; border:none; background:none; color:var(--ink);">25:00</div>
    </div>
    <div class="tool-actions" style="justify-content:center;">
      <button type="button" class="btn btn-primary" id="pomo-start">Mulai</button>
      <button type="button" class="btn" id="pomo-reset">Reset</button>
    </div>
  `;
  const timeEl = el.querySelector('#pomo-time');
  const statusEl = el.querySelector('#pomo-status');
  const startBtn = el.querySelector('#pomo-start');
  let timer = null;
  let timeLeft = 25 * 60;
  let isRunning = false;
  let isBreak = false;

  const updateDisplay = () => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    timeEl.textContent = `${m}:${s}`;
    document.title = `${m}:${s} — Pomodoro`;
  };

  const stopTimer = () => {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = 'Mulai';
    startBtn.classList.replace('btn-primary', 'btn');
  };

  startBtn.addEventListener('click', () => {
    if (isRunning) { stopTimer(); return; }
    isRunning = true;
    startBtn.textContent = 'Jeda';
    startBtn.classList.replace('btn', 'btn-primary');
    
    timer = setInterval(() => {
      timeLeft--;
      updateDisplay();
      if (timeLeft <= 0) {
        stopTimer();
        toast(isBreak ? 'Waktu istirahat selesai!' : 'Sesi fokus selesai!');
        // Mainkan suara beep sederhana
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          osc.connect(ctx.destination);
          osc.start(); osc.stop(ctx.currentTime + 0.5);
        } catch {}
        
        isBreak = !isBreak;
        timeLeft = isBreak ? 5 * 60 : 25 * 60;
        statusEl.textContent = isBreak ? 'Waktu Istirahat (05:00)' : 'Waktu Fokus (25:00)';
        updateDisplay();
      }
    }, 1000);
  });

  el.querySelector('#pomo-reset').addEventListener('click', () => {
    stopTimer();
    isBreak = false;
    timeLeft = 25 * 60;
    statusEl.textContent = 'Waktu Fokus (25:00)';
    updateDisplay();
  });
}

/* 2. todoList — To-Do List */
export function todoList(el) {
  el.innerHTML = `
    <div class="field" style="display:flex; gap:8px;">
      <input type="text" id="td-in" placeholder="Tugas baru..." style="flex:1;">
      <button type="button" class="btn btn-primary" id="td-add">Tambah</button>
    </div>
    <div id="td-list" class="mt-4"></div>
    <div class="tool-actions mt-4">
      <button type="button" class="btn btn-ghost btn-sm" id="td-clear">Hapus Selesai</button>
    </div>
  `;
  const inEl = el.querySelector('#td-in');
  const listEl = el.querySelector('#td-list');
  
  const load = () => {
    const data = JSON.parse(localStorage.getItem('aio-todo') || '[]');
    listEl.innerHTML = data.length ? '' : '<div class="empty-state" style="padding:16px;">Belum ada tugas.</div>';
    
    data.forEach((task, i) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; align-items:center; gap:12px; padding:12px; border-bottom:1px solid var(--border-muted);';
      row.innerHTML = `
        <input type="checkbox" ${task.done ? 'checked' : ''} style="width:20px; height:20px; accent-color:var(--accent);" data-i="${i}" class="td-check">
        <span style="flex:1; ${task.done ? 'text-decoration:line-through; color:var(--ink-muted);' : ''}">${task.text}</span>
        <button type="button" class="icon-btn" style="width:32px; height:32px; border:none; background:none; color:var(--danger);" data-i="${i}" class="td-del">
          <svg aria-hidden="true"><use href="/assets/icons.svg#i-trash"/></svg>
        </button>
      `;
      listEl.appendChild(row);
    });

    // Attach events
    listEl.querySelectorAll('.td-check').forEach(cb => {
      cb.addEventListener('change', () => {
        const d = JSON.parse(localStorage.getItem('aio-todo') || '[]');
        d[cb.dataset.i].done = cb.checked;
        localStorage.setItem('aio-todo', JSON.stringify(d));
        load();
      });
    });
    listEl.querySelectorAll('.td-del').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = JSON.parse(localStorage.getItem('aio-todo') || '[]');
        d.splice(btn.dataset.i, 1);
        localStorage.setItem('aio-todo', JSON.stringify(d));
        load();
      });
    });
  };

  const add = () => {
    const text = inEl.value.trim();
    if (!text) return;
    const d = JSON.parse(localStorage.getItem('aio-todo') || '[]');
    d.push({ text, done: false });
    localStorage.setItem('aio-todo', JSON.stringify(d));
    inEl.value = '';
    load();
  };

  el.querySelector('#td-add').addEventListener('click', add);
  inEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') add(); });
  
  el.querySelector('#td-clear').addEventListener('click', () => {
    let d = JSON.parse(localStorage.getItem('aio-todo') || '[]');
    d = d.filter(t => !t.done);
    localStorage.setItem('aio-todo', JSON.stringify(d));
    load();
  });

  load();
}

/* 3. quickNotes — Catatan Cepat */
export function quickNotes(el) {
  el.innerHTML = `
    <div class="field">
      <label for="qn-in">Catatan (tersimpan otomatis)</label>
      <textarea id="qn-in" rows="12" placeholder="Mulai mengetik..."></textarea>
      <div class="help" id="qn-status" style="text-align:right;">Tersimpan</div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-ghost" id="qn-clear" style="color:var(--danger); border-color:var(--danger);">Hapus Semua</button>
    </div>
  `;
  const textarea = el.querySelector('#qn-in');
  const status = el.querySelector('#qn-status');
  let saveTimer;

  textarea.value = localStorage.getItem('aio-notes') || '';
  
  textarea.addEventListener('input', () => {
    status.textContent = 'Menyimpan...';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      localStorage.setItem('aio-notes', textarea.value);
      status.textContent = 'Tersimpan';
    }, 500);
  });

  el.querySelector('#qn-clear').addEventListener('click', () => {
    if (!confirm('Hapus semua catatan?')) return;
    textarea.value = '';
    localStorage.setItem('aio-notes', '');
    status.textContent = 'Tersimpan';
  });
}

/* 4. gpaCalculator — Kalkulator IPK */
export function gpaCalculator(el) {
  el.innerHTML = `
    <div id="gpa-rows"></div>
    <button type="button" class="btn btn-sm mt-2" id="gpa-add">+ Tambah Mata Kuliah</button>
    <div class="tool-actions mt-4">
      <button type="button" class="btn btn-primary" id="gpa-go">Hitung IPK</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="gpa-out">Belum dihitung.</div>
    </div>
  `;
  const rowsEl = el.querySelector('#gpa-rows');
  const out = el.querySelector('#gpa-out');
  const grades = { 'A': 4, 'A-': 3.7, 'B+': 3.3, 'B': 3, 'B-': 2.7, 'C+': 2.3, 'C': 2, 'C-': 1.7, 'D': 1, 'E': 0 };

  const addRow = () => {
    const div = document.createElement('div');
    div.className = 'gpa-row';
    div.style.cssText = 'display:grid; grid-template-columns:1fr 80px 80px 40px; gap:8px; margin-bottom:8px; align-items:center;';
    div.innerHTML = `
      <input type="text" placeholder="Nama MK" class="form-control" style="width:100%; min-height:36px; padding:4px 8px; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); font-size:14px;">
      <input type="number" placeholder="SKS" min="1" max="6" value="3" class="form-control" style="width:100%; min-height:36px; padding:4px 8px; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); font-size:14px; text-align:center;">
      <select class="form-control" style="width:100%; min-height:36px; padding:4px 8px; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); font-size:14px;">
        ${Object.keys(grades).map(g => `<option value="${g}">${g}</option>`).join('')}
      </select>
      <button type="button" class="icon-btn" style="border:none; background:none; color:var(--danger); width:32px; height:32px; justify-self:center;">&times;</button>
    `;
    div.querySelector('button').addEventListener('click', () => div.remove());
    rowsEl.appendChild(div);
  };

  el.querySelector('#gpa-add').addEventListener('click', addRow);
  addRow(); addRow(); addRow(); // Start with 3 rows

  el.querySelector('#gpa-go').addEventListener('click', () => {
    const rows = rowsEl.querySelectorAll('.gpa-row');
    let totalSKS = 0;
    let totalMutu = 0;
    let valid = true;

    rows.forEach(r => {
      const inputs = r.querySelectorAll('input, select');
      const sks = parseFloat(inputs[1].value);
      const grade = inputs[2].value;
      if (isNaN(sks) || sks < 1) valid = false;
      else {
        totalSKS += sks;
        totalMutu += (sks * grades[grade]);
      }
    });

    if (!valid || totalSKS === 0) { setError(out, 'Isi SKS dengan benar (minimal 1).'); return; }
    
    const ipk = totalMutu / totalSKS;
    let predikat = '';
    if (ipk >= 3.5) predikat = 'Cum Laude';
    else if (ipk >= 3.0) predikat = 'Sangat Memuaskan';
    else if (ipk >= 2.5) predikat = 'Memuaskan';
    else predikat = 'Cukup';

    setResult(out, `Total SKS: ${totalSKS}\nTotal Mutu: ${totalMutu.toFixed(2)}\n\nIPK: ${ipk.toFixed(2)} (${predikat})`);
  });
}

/* 5. flashcards — Flashcard Sederhana */
export function flashcards(el) {
  el.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
      <input type="text" id="fc-q" placeholder="Pertanyaan..." style="min-height:36px; padding:4px 8px; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md);">
      <input type="text" id="fc-a" placeholder="Jawaban..." style="min-height:36px; padding:4px 8px; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md);">
    </div>
    <div class="tool-actions mb-4">
      <button type="button" class="btn btn-primary btn-sm" id="fc-add">Tambah Kartu</button>
    </div>
    
    <div id="fc-display" style="perspective:1000px; margin: 24px 0; cursor:pointer; user-select:none;">
      <div id="fc-card" style="position:relative; width:100%; min-height:160px; transition:transform 0.6s; transform-style:preserve-3d; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); background:var(--surface);">
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:24px; backface-visibility:hidden; font-size:1.25rem; text-align:center;" id="fc-front">Klik untuk mulai</div>
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:24px; backface-visibility:hidden; transform:rotateY(180deg); background:var(--cat-pelajar); color:var(--ink-inv); font-size:1.25rem; text-align:center;" id="fc-back">Jawaban</div>
      </div>
    </div>
    
    <div class="tool-actions" style="justify-content:center;">
      <button type="button" class="btn btn-sm" id="fc-prev">Sebelumnya</button>
      <span id="fc-count" style="display:inline-flex; align-items:center; padding:0 12px; font-family:var(--font-mono);">0 / 0</span>
      <button type="button" class="btn btn-sm" id="fc-next">Selanjutnya</button>
    </div>
  `;
  const front = el.querySelector('#fc-front');
  const back = el.querySelector('#fc-back');
  const card = el.querySelector('#fc-card');
  const count = el.querySelector('#fc-count');
  
  let cards = JSON.parse(localStorage.getItem('aio-flashcards') || '[]');
  let current = 0;
  let isFlipped = false;

  const updateCard = () => {
    if (cards.length === 0) {
      front.textContent = 'Belum ada kartu';
      back.textContent = 'Tambahkan di atas';
      count.textContent = '0 / 0';
      card.style.transform = 'rotateY(0deg)';
      return;
    }
    front.textContent = cards[current].q;
    back.textContent = cards[current].a;
    count.textContent = `${current + 1} / ${cards.length}`;
    if (isFlipped) card.style.transform = 'rotateY(180deg)';
    else card.style.transform = 'rotateY(0deg)';
  };

  card.addEventListener('click', () => {
    if (cards.length === 0) return;
    isFlipped = !isFlipped;
    card.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
  });

  el.querySelector('#fc-add').addEventListener('click', () => {
    const q = el.querySelector('#fc-q').value.trim();
    const a = el.querySelector('#fc-a').value.trim();
    if (!q || !a) { toast('Isi pertanyaan dan jawaban.'); return; }
    cards.push({ q, a });
    localStorage.setItem('aio-flashcards', JSON.stringify(cards));
    el.querySelector('#fc-q').value = '';
    el.querySelector('#fc-a').value = '';
    if (cards.length === 1) { current = 0; isFlipped = false; }
    updateCard();
  });

  el.querySelector('#fc-prev').addEventListener('click', () => {
    if (cards.length === 0) return;
    current = (current - 1 + cards.length) % cards.length;
    isFlipped = false;
    updateCard();
  });

  el.querySelector('#fc-next').addEventListener('click', () => {
    if (cards.length === 0) return;
    current = (current + 1) % cards.length;
    isFlipped = false;
    updateCard();
  });

  updateCard();
}