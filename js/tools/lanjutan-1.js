// lanjutan-1.js — TTS, Steganografi, ASCII, Terminal
import { copyText, setResult, setError, toast } from './util.js';

export function textToSpeech(el) {
  el.innerHTML = `
    <div class="field">
      <label for="tts-text">Teks yang akan dibacakan</label>
      <textarea id="tts-text" rows="5">Halo, selamat datang di AIO Tools. Website ini berjalan sepenuhnya di browser Anda.</textarea>
    </div>
    <div class="tool-grid-2">
      <div class="field">
        <label for="tts-rate">Kecepatan (<span id="tts-rate-val">1</span>x)</label>
        <input type="range" id="tts-rate" min="0.5" max="2" step="0.1" value="1" style="width:100%;">
      </div>
      <div class="field">
        <label for="tts-pitch">Nada Suara (<span id="tts-pitch-val">1</span>)</label>
        <input type="range" id="tts-pitch" min="0" max="2" step="0.1" value="1" style="width:100%;">
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="tts-play">Putar Suara</button>
      <button type="button" class="btn" id="tts-stop">Berhenti</button>
    </div>
  `;
  const synth = window.speechSynthesis;
  const rate = el.querySelector('#tts-rate');
  const pitch = el.querySelector('#tts-pitch');
  rate.addEventListener('input', () => el.querySelector('#tts-rate-val').textContent = rate.value);
  pitch.addEventListener('input', () => el.querySelector('#tts-pitch-val').textContent = pitch.value);

  el.querySelector('#tts-play').addEventListener('click', () => {
    const text = el.querySelector('#tts-text').value;
    if (!text) return toast('Masukkan teks dulu.');
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = parseFloat(rate.value);
    utter.pitch = parseFloat(pitch.value);
    utter.lang = 'id-ID';
    synth.speak(utter);
  });
  el.querySelector('#tts-stop').addEventListener('click', () => synth.cancel());
}

export function steganografi(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div>
        <h3 style="font-size:1rem; margin-bottom:8px;">Sisipkan Pesan</h3>
        <div class="field"><label for="stg-file" class="btn btn-sm" style="cursor:pointer;">Pilih Gambar PNG</label><input type="file" id="stg-file" accept="image/png" style="position:absolute;left:-9999px;"></div>
        <div class="field"><label for="stg-msg">Pesan Rahasia</label><input type="text" id="stg-msg" placeholder="Ketik pesan..."></div>
        <button type="button" class="btn btn-primary" id="stg-hide">Sisipkan & Unduh</button>
      </div>
      <div>
        <h3 style="font-size:1rem; margin-bottom:8px;">Ekstrak Pesan</h3>
        <div class="field"><label for="stg-ext-file" class="btn btn-sm" style="cursor:pointer;">Pilih Gambar Tersisipi</label><input type="file" id="stg-ext-file" accept="image/png" style="position:absolute;left:-9999px;"></div>
        <button type="button" class="btn" id="stg-extract" style="margin-top:22px;">Baca Pesan</button>
      </div>
    </div>
    <div class="field mt-4"><span class="label">Hasil</span><div class="result is-empty" id="stg-out">Belum ada pesan.</div></div>
  `;
  const loadImg = (file) => new Promise((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = URL.createObjectURL(file); });
  
  el.querySelector('#stg-hide').addEventListener('click', async () => {
    const file = el.querySelector('#stg-file').files[0];
    const msg = el.querySelector('#stg-msg').value;
    if (!file || !msg) return toast('Pilih gambar dan isi pesan.');
    try {
      const img = await loadImg(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const msgBin = Array.from(new TextEncoder().encode(msg + '\0')).map(b => b.toString(2).padStart(8, '0')).join('');
      if (msgBin.length > data.length) throw new Error('Pesan terlalu panjang.');
      for (let i = 0; i < msgBin.length; i++) data[i * 4] = (data[i * 4] & 254) | parseInt(msgBin[i]);
      ctx.putImageData(imgData, 0, 0);
      canvas.toBlob(blob => {
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rahasia.png'; a.click();
        toast('Gambar berisi pesan berhasil diunduh (PNG).');
      }, 'image/png');
    } catch (e) { toast(e.message); }
  });

  el.querySelector('#stg-extract').addEventListener('click', async () => {
    const file = el.querySelector('#stg-ext-file').files[0];
    if (!file) return toast('Pilih gambar dulu.');
    try {
      const img = await loadImg(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      let bin = '', bytes = [];
      for (let i = 0; i < data.length; i += 4) {
        bin += (data[i] & 1).toString();
        if (bin.length % 8 === 0) { const b = parseInt(bin.slice(-8), 2); if (b === 0) break; bytes.push(b); }
      }
      const msg = new TextDecoder().decode(new Uint8Array(bytes));
      if (!msg) throw new Error('Tidak ada pesan tersembunyi (pastikan gambar asli PNG).');
      setResult(el.querySelector('#stg-out'), msg);
    } catch (e) { setError(el.querySelector('#stg-out'), e.message); }
  });
}

export function asciiArt(el) {
  el.innerHTML = `
    <div class="field"><label for="asc-file" class="btn" style="cursor:pointer;">Pilih Gambar</label><input type="file" id="asc-file" accept="image/*" style="position:absolute;left:-9999px;"></div>
    <div class="field"><label for="asc-width">Lebar Karakter</label><input type="range" id="asc-width" min="40" max="150" value="80" style="width:100%;"></div>
    <div class="tool-actions"><button type="button" class="btn btn-primary" id="asc-go">Buat ASCII</button><button type="button" class="btn" id="asc-copy">Salin</button></div>
    <div class="field mt-4"><div class="result" id="asc-out" style="font-family:var(--font-mono); font-size:8px; line-height:1; letter-spacing:0; background:#000; color:#fff; white-space:pre; overflow:auto;">-</div></div>
  `;
  el.querySelector('#asc-go').addEventListener('click', () => {
    const file = el.querySelector('#asc-file').files[0];
    if (!file) return toast('Pilih gambar dulu.');
    const w = parseInt(el.querySelector('#asc-width').value);
    const img = new Image();
    img.onload = () => {
      const h = Math.round(w * (img.height / img.width) * 0.5);
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      const chars = '@%#*+=-:. '; let ascii = '';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const lum = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
          ascii += chars[Math.floor((lum / 255) * (chars.length - 1))];
        }
        ascii += '\n';
      }
      el.querySelector('#asc-out').textContent = ascii;
    };
    img.src = URL.createObjectURL(file);
  });
  el.querySelector('#asc-copy').addEventListener('click', (e) => copyText(el.querySelector('#asc-out').textContent, e.currentTarget));
}

export function webTerminal(el) {
  el.innerHTML = `
    <div id="term-container" style="background:#1B1A17; color:#F4EFE6; padding:16px; border-radius:var(--r-md); font-family:var(--font-mono); height:300px; overflow-y:auto; font-size:14px;">
      <div id="term-output">Ketik <span style="color:var(--accent)">help</span> untuk perintah.<br><br></div>
      <div style="display:flex; gap:8px;"><span style="color:var(--accent)">guest@aio:~$</span><input type="text" id="term-input" style="flex:1; background:transparent; border:none; color:#F4EFE6; outline:none; font-family:var(--font-mono);" autocomplete="off" spellcheck="false" autofocus></div>
    </div>
  `;
  const out = el.querySelector('#term-output'); const input = el.querySelector('#term-input'); const container = el.querySelector('#term-container');
  const cmds = { help: 'Perintah: help, ls, pwd, echo [teks], date, clear, whoami', ls: 'Documents  Downloads  secret.txt', pwd: '/home/guest', whoami: 'guest', date: new Date().toString(), 'secret.txt': 'Jangan beritahu siapa-siapa!' };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim(); input.value = ''; if (!cmd) return;
      out.innerHTML += `<div><span style="color:var(--accent)">guest@aio:~$</span> ${cmd}</div>`;
      const mainCmd = cmd.split(' ')[0].toLowerCase();
      if (mainCmd === 'clear') { out.innerHTML = ''; return; }
      out.innerHTML += `<div>${mainCmd === 'echo' ? cmd.slice(5) : (cmds[mainCmd] || `Perintah tidak ditemukan.`)}</div><br>`;
      container.scrollTop = container.scrollHeight;
    }
  });
  container.addEventListener('click', () => input.focus());
}