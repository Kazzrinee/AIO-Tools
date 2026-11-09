// islami-1.js — 5 tool islami pertama (waktu salat, kiblat, hijriah, zakat)
import { setResult, setError, toast } from './util.js';

const CITIES = [
  { name: 'Jakarta', lat: -6.2088, lng: 106.8456, tz: 7 },
  { name: 'Bandung', lat: -6.9175, lng: 107.6191, tz: 7 },
  { name: 'Surabaya', lat: -7.2575, lng: 112.7521, tz: 7 },
  { name: 'Medan', lat: 3.5952, lng: 98.6722, tz: 7 },
  { name: 'Semarang', lat: -6.9667, lng: 110.4203, tz: 7 },
  { name: 'Yogyakarta', lat: -7.7956, lng: 110.3695, tz: 7 },
  { name: 'Makassar', lat: -5.1477, lng: 119.4327, tz: 8 },
  { name: 'Denpasar', lat: -8.6705, lng: 115.1889, tz: 8 },
  { name: 'Balikpapan', lat: -1.2379, lng: 116.8287, tz: 8 },
  { name: 'Jayapura', lat: -2.5916, lng: 140.7181, tz: 9 }
];

function julianDay(y, m, d) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

function sunDeclinationAndEqTime(y, m, d) {
  const jd = julianDay(y, m, d);
  const JC = (jd - 2451545) / 36525;
  const L0 = (280.46646 + JC * (36000.76983 + JC * 0.0003032)) % 360;
  const M = 357.52911 + JC * (35999.05029 - 0.0001537 * JC);
  const e = 0.016708634 - JC * (0.000042037 + 0.0000001267 * JC);
  const Mr = M * Math.PI / 180;
  const C = Math.sin(Mr) * (1.914602 - JC * (0.004817 + 0.000014 * JC))
          + Math.sin(2 * Mr) * (0.019993 - 0.000101 * JC)
          + Math.sin(3 * Mr) * 0.000289;
  const sunLon = L0 + C;
  const omega = 125.04 - 1934.136 * JC;
  const lambda = sunLon - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180);
  const eps0 = 23 + (26 + ((21.448 - JC * (46.815 + JC * (0.00059 - JC * 0.001813))) / 60)) / 60;
  const eps = eps0 + 0.00256 * Math.cos(omega * Math.PI / 180);
  const decl = Math.asin(Math.sin(eps * Math.PI / 180) * Math.sin(lambda * Math.PI / 180)) * 180 / Math.PI;
  const yv = Math.pow(Math.tan(eps * Math.PI / 360), 2);
  const L0r = L0 * Math.PI / 180;
  const eqTime = 4 * (180 / Math.PI) * (
    yv * Math.sin(2 * L0r)
    - 2 * e * Math.sin(Mr)
    + 4 * e * yv * Math.sin(Mr) * Math.cos(2 * L0r)
    - 0.5 * yv * yv * Math.sin(4 * L0r)
    - 1.25 * e * e * Math.sin(2 * Mr)
  );
  return { decl, eqTime };
}

function hourAngleDeg(lat, decl, altitude) {
  const cosHA = (Math.sin(altitude * Math.PI / 180) - Math.sin(lat * Math.PI / 180) * Math.sin(decl * Math.PI / 180))
              / (Math.cos(lat * Math.PI / 180) * Math.cos(decl * Math.PI / 180));
  if (cosHA > 1 || cosHA < -1) return null;
  return Math.acos(cosHA) * 180 / Math.PI;
}

function fmtHour(h) {
  if (h == null || isNaN(h)) return '—';
  h = ((h % 24) + 24) % 24;
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return String(hh).padStart(2, '0') + ':' + String(mm % 60).padStart(2, '0');
}

function computePrayer(lat, lng, tz, date) {
  const { decl, eqTime } = sunDeclinationAndEqTime(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const noon = 12 - eqTime / 60 - lng / 15 + tz;
  const haSun = hourAngleDeg(lat, decl, -0.833);
  const ha18 = hourAngleDeg(lat, decl, -18);
  const asrAlt = Math.atan(1 / (1 + Math.abs(Math.tan((lat - decl) * Math.PI / 180)))) * 180 / Math.PI;
  const haAsr = hourAngleDeg(lat, decl, asrAlt);
  if (haSun == null || ha18 == null || haAsr == null) return null;
  return {
    imsak: noon - ha18 / 15 - 10 / 60,
    fajr: noon - ha18 / 15,
    sunrise: noon - haSun / 15,
    dhuhr: noon + 1 / 60,
    asr: noon + haAsr / 15,
    maghrib: noon + haSun / 15,
    isha: noon + ha18 / 15
  };
}

/* 1. waktuSalat — Waktu Salat Harian */
export function waktuSalat(el) {
  el.innerHTML = `
    <div class="field">
      <label for="ws-city">Kota</label>
      <select id="ws-city">
        ${CITIES.map((c, i) => `<option value="${i}">${c.name}</option>`).join('')}
        <option value="geo">Gunakan Lokasi Saya (GPS)</option>
      </select>
    </div>
    <div class="field">
      <label for="ws-date">Tanggal</label>
      <input type="date" id="ws-date">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="ws-go">Hitung</button>
    </div>
    <div class="field mt-4">
      <span class="label">Waktu Salat</span>
      <div id="ws-out" class="result is-empty">Belum dihitung.</div>
    </div>
    <div class="help mt-2">
      Perhitungan memakai metode sudut -18° untuk Fajr dan Isha (standar mayoritas). Waktu bisa berbeda 1-3 menit dari jadwal resmi. Untuk kepastian, rujuk jadwal dari Kemenag atau masjid setempat.
    </div>
  `;
  const citySel = el.querySelector('#ws-city');
  const dateIn = el.querySelector('#ws-date');
  const out = el.querySelector('#ws-out');
  const today = new Date();
  dateIn.value = today.toISOString().slice(0, 10);

  const render = (lat, lng, tz, label) => {
    const d = new Date(dateIn.value + 'T12:00:00');
    const t = computePrayer(lat, lng, tz, d);
    if (!t) { setError(out, 'Tidak bisa dihitung (lintang terlalu ekstrem).'); return; }
    setResult(out,
      `Lokasi: ${label}\n` +
      `Tanggal: ${d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}\n\n` +
      `Imsak   : ${fmtHour(t.imsak)}\n` +
      `Subuh   : ${fmtHour(t.fajr)}\n` +
      `Terbit  : ${fmtHour(t.sunrise)}\n` +
      `Dzuhur  : ${fmtHour(t.dhuhr)}\n` +
      `Ashar   : ${fmtHour(t.asr)}\n` +
      `Maghrib : ${fmtHour(t.maghrib)}\n` +
      `Isya    : ${fmtHour(t.isha)}`
    );
  };

  el.querySelector('#ws-go').addEventListener('click', () => {
    if (citySel.value === 'geo') {
      if (!navigator.geolocation) { setError(out, 'Browser tidak mendukung GPS.'); return; }
      out.textContent = 'Mengambil lokasi...';
      navigator.geolocation.getCurrentPosition(
        pos => render(pos.coords.latitude, pos.coords.longitude, Math.round((new Date().getTimezoneOffset() / -60)), 'Lokasi Anda (GPS)'),
        () => setError(out, 'Gagal mengambil lokasi. Pilih kota manual.')
      );
    } else {
      const c = CITIES[parseInt(citySel.value)];
      render(c.lat, c.lng, c.tz, c.name);
    }
  });
  el.querySelector('#ws-go').click();
}

/* 2. arahKiblat — Arah Kiblat */
export function arahKiblat(el) {
  el.innerHTML = `
    <div class="field">
      <label for="qk-city">Kota</label>
      <select id="qk-city">
        ${CITIES.map((c, i) => `<option value="${i}">${c.name}</option>`).join('')}
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="qk-go">Hitung Arah Kiblat</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="qk-out">Belum dihitung.</div>
    </div>
    <div class="field mt-4" style="text-align:center;">
      <div id="qk-compass" style="position:relative; width:200px; height:200px; margin:0 auto; border:var(--bw-strong) solid var(--border); border-radius:50%; background:var(--surface);">
        <div id="qk-needle" style="position:absolute; left:50%; top:50%; width:4px; height:80px; background:var(--accent); transform-origin:50% 100%; transform:translate(-50%,-100%) rotate(0deg); border-radius:2px; transition:transform 0.6s ease;"></div>
        <div style="position:absolute; left:50%; top:50%; width:12px; height:12px; background:var(--border); border-radius:50%; transform:translate(-50%,-50%);"></div>
      </div>
      <div style="font-family:var(--font-mono); font-size:12px; color:var(--ink-muted); margin-top:8px;">Panah = arah kiblat (dari utara)</div>
    </div>
  `;
  const out = el.querySelector('#qk-out');
  const needle = el.querySelector('#qk-needle');

  el.querySelector('#qk-go').addEventListener('click', () => {
    const c = CITIES[parseInt(el.querySelector('#qk-city').value)];
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    const dLng = (kaabaLng - c.lng) * Math.PI / 180;
    const latR = c.lat * Math.PI / 180;
    const kLatR = kaabaLat * Math.PI / 180;
    let bearing = Math.atan2(
      Math.sin(dLng) * Math.cos(kLatR),
      Math.cos(latR) * Math.sin(kLatR) - Math.sin(latR) * Math.cos(kLatR) * Math.cos(dLng)
    ) * 180 / Math.PI;
    if (bearing < 0) bearing += 360;
    
    let arah = '';
    if (bearing >= 337.5 || bearing < 22.5) arah = 'Utara';
    else if (bearing < 67.5) arah = 'Timur Laut';
    else if (bearing < 112.5) arah = 'Timur';
    else if (bearing < 157.5) arah = 'Tenggara';
    else if (bearing < 202.5) arah = 'Selatan';
    else if (bearing < 247.5) arah = 'Barat Daya';
    else if (bearing < 292.5) arah = 'Barat';
    else arah = 'Barat Laut';

    setResult(out,
      `Lokasi: ${c.name}\n` +
      `Arah Kiblat: ${bearing.toFixed(2)}° dari Utara\n` +
      `Arah: ${arah}\n\n` +
      `Cara pakai: letakkan kompas menghadap utara, putar badan hingga menghadap ${bearing.toFixed(0)}°.`
    );
    needle.style.transform = `translate(-50%,-100%) rotate(${bearing}deg)`;
  });
  el.querySelector('#qk-go').click();
}

/* 3. konversiHijriah — Konversi Masehi ↔ Hijriah */
export function konversiHijriah(el) {
  const HIJRI_MONTHS = ['Muharram','Safar','Rabiul Awal','Rabiul Akhir','Jumadil Awal','Jumadil Akhir','Rajab','Syaban','Ramadhan','Syawal','Dzulqadah','Dzulhijjah'];
  
  const gregToHijri = (y, m, d) => {
    const jd = julianDay(y, m, d);
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
              Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
               Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const month = Math.floor((24 * l3) / 709);
    const day = l3 - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;
    return { y: year, m: month, d: day };
  };

  const hijriToGreg = (hy, hm, hd) => {
    const jd = Math.floor((11 * hy + 3) / 30) + 354 * hy + 30 * hm -
               Math.floor((hm - 1) / 2) + hd + 1948440 - 385;
    let l = jd + 68569;
    const n = Math.floor((4 * l) / 146097);
    l = l - Math.floor((146097 * n + 3) / 4);
    const i = Math.floor((4000 * (l + 1)) / 1461001);
    l = l - Math.floor((1461 * i) / 4) + 31;
    const j = Math.floor((80 * l) / 2447);
    const day = l - Math.floor((2447 * j) / 80);
    l = Math.floor(j / 11);
    const month = j + 2 - 12 * l;
    const year = 100 * (n - 49) + i + l;
    return { y: year, m: month, d: day };
  };

  el.innerHTML = `
    <div class="tool-grid-2">
      <div class="field">
        <label for="hj-mode">Arah Konversi</label>
        <select id="hj-mode">
          <option value="g2h">Masehi → Hijriah</option>
          <option value="h2g">Hijriah → Masehi</option>
        </select>
      </div>
      <div class="field">
        <label for="hj-date">Tanggal</label>
        <input type="date" id="hj-date">
      </div>
    </div>
    <div class="field hidden" id="hj-hfields">
      <label>Tanggal Hijriah</label>
      <div class="tool-grid-2">
        <input type="number" id="hj-hd" placeholder="Hari" min="1" max="30" value="1">
        <input type="number" id="hj-hm" placeholder="Bulan (1-12)" min="1" max="12" value="1">
        <input type="number" id="hj-hy" placeholder="Tahun H" min="1300" max="1600" value="1447">
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="hj-go">Konversi</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="hj-out">Belum dihitung.</div>
    </div>
  `;
  const mode = el.querySelector('#hj-mode');
  const dateIn = el.querySelector('#hj-date');
  const hFields = el.querySelector('#hj-hfields');
  const out = el.querySelector('#hj-out');
  dateIn.value = new Date().toISOString().slice(0, 10);

  mode.addEventListener('change', () => {
    if (mode.value === 'h2g') {
      dateIn.parentElement.classList.add('hidden');
      hFields.classList.remove('hidden');
    } else {
      dateIn.parentElement.classList.remove('hidden');
      hFields.classList.add('hidden');
    }
  });

  el.querySelector('#hj-go').addEventListener('click', () => {
    if (mode.value === 'g2h') {
      if (!dateIn.value) { setError(out, 'Pilih tanggal Masehi.'); return; }
      const d = new Date(dateIn.value + 'T12:00:00');
      const h = gregToHijri(d.getFullYear(), d.getMonth() + 1, d.getDate());
      setResult(out,
        `Masehi: ${d.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}\n\n` +
        `Hijriah: ${h.d} ${HIJRI_MONTHS[h.m - 1]} ${h.y} H\n\n` +
        `Catatan: kalender Hijriah aritmatika bisa berbeda 1-2 hari dari kalender resmi (rukyat).`
      );
    } else {
      const hd = parseInt(el.querySelector('#hj-hd').value);
      const hm = parseInt(el.querySelector('#hj-hm').value);
      const hy = parseInt(el.querySelector('#hj-hy').value);
      if (!hd || !hm || !hy || hm < 1 || hm > 12) { setError(out, 'Isi tanggal Hijriah dengan benar.'); return; }
      const g = hijriToGreg(hy, hm, hd);
      setResult(out,
        `Hijriah: ${hd} ${HIJRI_MONTHS[hm - 1]} ${hy} H\n\n` +
        `Masehi: ${g.d}/${g.m}/${g.y}\n\n` +
        `Catatan: kalender Hijriah aritmatika bisa berbeda 1-2 hari dari kalender resmi (rukyat).`
      );
    }
  });
}

/* 4. zakatMaal — Kalkulator Zakat Maal */
export function zakatMaal(el) {
  el.innerHTML = `
    <div class="field">
      <label for="zm-gold">Harga emas saat ini (Rp/gram)</label>
      <input type="number" id="zm-gold" value="1500000" placeholder="1500000">
      <div class="help">Nisab zakat maal = 85 gram emas. Ganti dengan harga emas hari ini.</div>
    </div>
    <div class="field">
      <label for="zm-cash">Uang tunai / tabungan (Rp)</label>
      <input type="number" id="zm-cash" placeholder="0" value="0">
    </div>
    <div class="field">
      <label for="zm-gold-value">Nilai emas/perak yang disimpan (Rp)</label>
      <input type="number" id="zm-gold-value" placeholder="0" value="0">
    </div>
    <div class="field">
      <label for="zm-assets">Aset perdagangan/investasi (Rp)</label>
      <input type="number" id="zm-assets" placeholder="0" value="0">
    </div>
    <div class="field">
      <label for="zm-debt">Hutang jatuh tempo (Rp)</label>
      <input type="number" id="zm-debt" placeholder="0" value="0">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="zm-go">Hitung Zakat</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="zm-out">Belum dihitung.</div>
    </div>
  `;
  const out = el.querySelector('#zm-out');
  const rp = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');

  el.querySelector('#zm-go').addEventListener('click', () => {
    const goldPrice = parseFloat(el.querySelector('#zm-gold').value) || 0;
    const cash = parseFloat(el.querySelector('#zm-cash').value) || 0;
    const goldVal = parseFloat(el.querySelector('#zm-gold-value').value) || 0;
    const assets = parseFloat(el.querySelector('#zm-assets').value) || 0;
    const debt = parseFloat(el.querySelector('#zm-debt').value) || 0;
    
    if (goldPrice <= 0) { setError(out, 'Masukkan harga emas.'); return; }
    
    const nisab = 85 * goldPrice;
    const total = cash + goldVal + assets - debt;
    const wajib = total >= nisab;
    const zakat = wajib ? total * 0.025 : 0;

    let res = `Nisab (85 gr emas): ${rp(nisab)}\n`;
    res += `Total harta bersih: ${rp(total)}\n\n`;
    if (wajib) {
      res += `Anda WAJIB zakat.\n`;
      res += `Zakat 2,5%: ${rp(zakat)}`;
    } else {
      res += `Anda BELUM wajib zakat (harta di bawah nisab).\n`;
      res += `Kekurangan: ${rp(nisab - total)}`;
    }
    setResult(out, res);
  });
}

/* 5. zakatFitrah — Kalkulator Zakat Fitrah */
export function zakatFitrah(el) {
  el.innerHTML = `
    <div class="field">
      <label for="zf-count">Jumlah jiwa</label>
      <input type="number" id="zf-count" value="1" min="1">
    </div>
    <div class="field">
      <label for="zf-mode">Bentuk zakat</label>
      <select id="zf-mode">
        <option value="beras">Beras (2,5 kg per jiwa)</option>
        <option value="uang">Uang (setara harga beras)</option>
      </select>
    </div>
    <div class="field">
      <label for="zf-rice-price">Harga beras per kg (Rp)</label>
      <input type="number" id="zf-rice-price" value="15000">
      <div class="help">Standar: 2,5 kg beras atau setara 3,5 liter beras (mayoritas ulama Indonesia).</div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="zf-go">Hitung</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="zf-out">Belum dihitung.</div>
    </div>
  `;
  const out = el.querySelector('#zf-out');
  const rp = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');

  el.querySelector('#zf-go').addEventListener('click', () => {
    const count = parseInt(el.querySelector('#zf-count').value);
    const mode = el.querySelector('#zf-mode').value;
    const price = parseFloat(el.querySelector('#zf-rice-price').value) || 0;
    
    if (!count || count < 1) { setError(out, 'Jumlah jiwa minimal 1.'); return; }
    if (price <= 0) { setError(out, 'Masukkan harga beras.'); return; }

    if (mode === 'beras') {
      setResult(out,
        `Jumlah jiwa: ${count} orang\n` +
        `Zakat fitrah: ${(count * 2.5).toFixed(1)} kg beras\n` +
        `Setara: ${(count * 3.5).toFixed(1)} liter beras\n\n` +
        `(Bisa dibulatkan ke atas untuk kehati-hatian.)`
      );
    } else {
      const perJiwa = 2.5 * price;
      setResult(out,
        `Jumlah jiwa: ${count} orang\n` +
        `Harga beras: ${rp(price)}/kg\n\n` +
        `Zakat per jiwa: ${rp(perJiwa)}\n` +
        `Zakat total: ${rp(perJiwa * count)}`
      );
    }
  });
}