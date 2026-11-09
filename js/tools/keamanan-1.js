// keamanan-1.js — 5 tool keamanan pertama
import { copyText, setResult, setError, toast } from './util.js';

const LIB_CRYPTO = 'https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js';

async function loadCryptoJS() {
  if (window.CryptoJS) return window.CryptoJS;
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = LIB_CRYPTO;
    s.onload = () => resolve(window.CryptoJS);
    s.onerror = () => reject(new Error('Gagal memuat library kriptografi.'));
    document.head.appendChild(s);
  });
}

/* 1. passwordGenerator — Generator Password */
export function passwordGenerator(el) {
  el.innerHTML = `
    <div class="field">
      <label for="pg-len">Panjang Password: <span id="pg-len-val">16</span></label>
      <input type="range" id="pg-len" min="4" max="64" value="16" style="width:100%;">
    </div>
    <div class="field">
      <label><input type="checkbox" id="pg-upper" checked> Huruf Besar (A-Z)</label>
      <label><input type="checkbox" id="pg-lower" checked> Huruf Kecil (a-z)</label>
      <label><input type="checkbox" id="pg-num" checked> Angka (0-9)</label>
      <label><input type="checkbox" id="pg-sym" checked> Simbol (!@#$...)</label>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="pg-go">Generate</button>
      <button type="button" class="btn" id="pg-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="pg-out" style="font-size:20px; font-weight:700; letter-spacing:1px; text-align:center;">-</div>
    </div>
  `;
  const lenIn = el.querySelector('#pg-len');
  const lenVal = el.querySelector('#pg-len-val');
  const out = el.querySelector('#pg-out');
  
  lenIn.addEventListener('input', () => lenVal.textContent = lenIn.value);

  el.querySelector('#pg-go').addEventListener('click', () => {
    const len = parseInt(lenIn.value);
    const upper = el.querySelector('#pg-upper').checked;
    const lower = el.querySelector('#pg-lower').checked;
    const num = el.querySelector('#pg-num').checked;
    const sym = el.querySelector('#pg-sym').checked;
    
    if (!upper && !lower && !num && !sym) {
      setError(out, 'Pilih minimal satu jenis karakter.'); return;
    }
    
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (num) chars += '0123456789';
    if (sym) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let pwd = '';
    const array = new Uint32Array(len);
    crypto.getRandomValues(array);
    for (let i = 0; i < len; i++) {
      pwd += chars[array[i] % chars.length];
    }
    
    setResult(out, pwd);
  });
  el.querySelector('#pg-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 2. passwordChecker — Cek Kekuatan Password */
export function passwordChecker(el) {
  el.innerHTML = `
    <div class="field">
      <label for="pc-in">Masukkan Password</label>
      <input type="password" id="pc-in" placeholder="Ketik password untuk dianalisis...">
      <label style="margin-top:8px; display:block; font-weight:400;"><input type="checkbox" id="pc-show"> Tampilkan password</label>
    </div>
    <div class="field mt-4">
      <span class="label">Kekuatan</span>
      <div class="result is-empty" id="pc-out">Belum ada input.</div>
      <div id="pc-bar" style="height:8px; background:var(--surface-2); border-radius:4px; margin-top:8px; overflow:hidden;">
        <div id="pc-fill" style="height:100%; width:0%; background:var(--danger); transition:width 0.3s, background 0.3s;"></div>
      </div>
    </div>
    <div class="field mt-4">
      <span class="label">Estimasi Waktu Tebak</span>
      <div class="result" id="pc-time" style="font-family:var(--font-mono);">-</div>
    </div>
  `;
  const input = el.querySelector('#pc-in');
  const show = el.querySelector('#pc-show');
  const out = el.querySelector('#pc-out');
  const bar = el.querySelector('#pc-fill');
  const timeOut = el.querySelector('#pc-time');

  show.addEventListener('change', () => {
    input.type = show.checked ? 'text' : 'password';
  });

  input.addEventListener('input', () => {
    const pwd = input.value;
    if (!pwd) {
      setError(out, 'Belum ada input.');
      bar.style.width = '0%';
      timeOut.textContent = '-';
      return;
    }

    let score = 0;
    if (pwd.length > 8) score++;
    if (pwd.length > 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    let label = '', color = '', pct = 0;
    if (score <= 2) { label = 'Lemah'; color = 'var(--danger)'; pct = 25; }
    else if (score <= 4) { label = 'Sedang'; color = 'var(--cat-konverter)'; pct = 50; }
    else if (score === 5) { label = 'Kuat'; color = 'var(--cat-kalkulator)'; pct = 75; }
    else { label = 'Sangat Kuat'; color = 'var(--cat-developer)'; pct = 100; }

    out.textContent = label;
    out.classList.remove('is-empty');
    bar.style.width = pct + '%';
    bar.style.background = color;

    // Estimasi waktu tebak (asumsi 10 miliar tebakan/detik)
    let poolSize = 0;
    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) poolSize += 32;
    
    if (poolSize === 0) { timeOut.textContent = 'Instan'; return; }
    
    const combinations = Math.pow(poolSize, pwd.length);
    const seconds = combinations / 1e10; // 10 miliar tebakan/detik
    
    let timeStr = '';
    if (seconds < 1) timeStr = 'Instan';
    else if (seconds < 60) timeStr = Math.round(seconds) + ' detik';
    else if (seconds < 3600) timeStr = Math.round(seconds / 60) + ' menit';
    else if (seconds < 86400) timeStr = Math.round(seconds / 3600) + ' jam';
    else if (seconds < 31536000) timeStr = Math.round(seconds / 86400) + ' hari';
    else if (seconds < 3153600000) timeStr = Math.round(seconds / 31536000) + ' tahun';
    else if (seconds < 3.15e16) timeStr = Math.round(seconds / 3153600000) + ' ribu tahun';
    else timeStr = 'Miliaran tahun (Aman)';

    timeOut.textContent = timeStr;
  });
}

/* 3. hashGenerator — Generator Hash MD5/SHA */
export function hashGenerator(el) {
  el.innerHTML = `
    <div class="field">
      <label for="hg-in">Teks</label>
      <textarea id="hg-in" rows="4" placeholder="Masukkan teks..."></textarea>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="hg-go">Generate Hash</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="hg-out">Belum diproses.</div>
    </div>
  `;
  const out = el.querySelector('#hg-out');
  el.querySelector('#hg-go').addEventListener('click', async () => {
    const txt = el.querySelector('#hg-in').value;
    if (!txt) { setError(out, 'Masukkan teks.'); return; }
    try {
      setResult(out, 'Menghitung hash...');
      const CryptoJS = await loadCryptoJS();
      const md5 = CryptoJS.MD5(txt).toString();
      const sha1 = CryptoJS.SHA1(txt).toString();
      const sha256 = CryptoJS.SHA256(txt).toString();
      
      setResult(out, 
        `MD5:    ${md5}\n` +
        `SHA-1:  ${sha1}\n` +
        `SHA-256: ${sha256}`
      );
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 4. aesEncrypt — Enkripsi & Dekripsi AES */
export function aesEncrypt(el) {
  el.innerHTML = `
    <div class="field">
      <label for="aes-txt">Teks (Pesan atau Sandi)</label>
      <textarea id="aes-txt" rows="5" placeholder="Masukkan teks..."></textarea>
    </div>
    <div class="field">
      <label for="aes-pass">Kunci Rahasia (Password)</label>
      <input type="password" id="aes-pass" placeholder="Kunci enkripsi...">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="aes-enc">Enkripsi</button>
      <button type="button" class="btn" id="aes-dec">Dekripsi</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="aes-out">Belum diproses.</div>
    </div>
  `;
  const txt = el.querySelector('#aes-txt');
  const pass = el.querySelector('#aes-pass');
  const out = el.querySelector('#aes-out');

  el.querySelector('#aes-enc').addEventListener('click', async () => {
    if (!txt.value || !pass.value) { setError(out, 'Isi teks dan kunci.'); return; }
    try {
      setResult(out, 'Memproses...');
      const CryptoJS = await loadCryptoJS();
      const encrypted = CryptoJS.AES.encrypt(txt.value, pass.value).toString();
      setResult(out, encrypted);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });

  el.querySelector('#aes-dec').addEventListener('click', async () => {
    if (!txt.value || !pass.value) { setError(out, 'Isi teks dan kunci.'); return; }
    try {
      setResult(out, 'Memproses...');
      const CryptoJS = await loadCryptoJS();
      const decrypted = CryptoJS.AES.decrypt(txt.value, pass.value);
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      if (!result) throw new Error('Kunci salah atau teks bukan hasil enkripsi AES.');
      setResult(out, result);
    } catch (e) { setError(out, 'Gagal: ' + e.message); }
  });
}

/* 5. tokenGenerator — Generator Token Acak */
export function tokenGenerator(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="tg-len">Panjang (karakter)</label>
        <input type="number" id="tg-len" value="32" min="8" max="128">
      </div>
      <div class="field">
        <label for="tg-type">Format</label>
        <select id="tg-type">
          <option value="hex">Hexadesimal (0-9a-f)</option>
          <option value="base64">Base64 URL-Safe</option>
        </select>
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="tg-go">Generate</button>
      <button type="button" class="btn" id="tg-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="tg-out">-</div>
    </div>
  `;
  const out = el.querySelector('#tg-out');
  
  el.querySelector('#tg-go').addEventListener('click', () => {
    const len = parseInt(el.querySelector('#tg-len').value);
    const type = el.querySelector('#tg-type').value;
    if (len < 8 || len > 128) { setError(out, 'Panjang harus 8-128.'); return; }

    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    
    if (type === 'hex') {
      const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
      setResult(out, hex.slice(0, len));
    } else {
      const b64 = btoa(String.fromCharCode.apply(null, arr))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      setResult(out, b64.slice(0, len));
    }
  });
  el.querySelector('#tg-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}