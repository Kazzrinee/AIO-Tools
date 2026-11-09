// islami-2.js — 5 tool islami & lokal berikutnya
import { setResult, setError, toast } from './util.js';

/* 6. kalkulatorTHR — Kalkulator THR */
export function kalkulatorTHR(el) {
  el.innerHTML = `
    <div class="field">
      <label for="thr-salary">Gaji bulanan (Rp)</label>
      <input type="number" id="thr-salary" placeholder="5000000" value="5000000">
    </div>
    <div class="field">
      <label for="thr-start">Tanggal mulai bekerja</label>
      <input type="date" id="thr-start">
    </div>
    <div class="field">
      <label for="thr-end">Tanggal pembayaran THR</label>
      <input type="date" id="thr-end">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="thr-go">Hitung THR</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="thr-out">Belum dihitung.</div>
    </div>
    <div class="help mt-2">Sesuai Permenaker No. 6/2016: masa kerja ≥12 bulan mendapat 1× gaji; 1-11 bulan mendapat prorata (masa kerja/12 × gaji).</div>
  `;
  const out = el.querySelector('#thr-out');
  const rp = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');
  const startIn = el.querySelector('#thr-start');
  const endIn = el.querySelector('#thr-end');
  const today = new Date().toISOString().slice(0, 10);
  endIn.value = today;

  el.querySelector('#thr-go').addEventListener('click', () => {
    const salary = parseFloat(el.querySelector('#thr-salary').value);
    if (!salary || salary <= 0) { setError(out, 'Masukkan gaji yang valid.'); return; }
    if (!startIn.value) { setError(out, 'Isi tanggal mulai bekerja.'); return; }

    const start = new Date(startIn.value);
    const end = new Date(endIn.value);
    if (start > end) { setError(out, 'Tanggal mulai harus sebelum tanggal pembayaran.'); return; }

    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (end.getDate() < start.getDate()) months--;
    months = Math.max(1, months);

    let thr;
    let ket;
    if (months >= 12) {
      thr = salary;
      ket = 'Masa kerja ≥12 bulan, mendapat 1× gaji penuh.';
    } else {
      thr = (months / 12) * salary;
      ket = `Masa kerja ${months} bulan, THR prorata.`;
    }

    setResult(out,
      `Gaji: ${rp(salary)}\n` +
      `Masa kerja: ${months} bulan\n\n` +
      `THR diterima: ${rp(thr)}\n\n` +
      ket
    );
  });
}

/* 7. hariLibur — Hari Libur Nasional */
export function hariLibur(el) {
  // Data hari libur nasional & cuti bersama Indonesia 2026 (perkiraan, dapat berubah)
  const HOLIDAYS_2026 = [
    { d: '2026-01-01', n: 'Tahun Baru Masehi' },
    { d: '2026-01-16', n: 'Isra Mikraj Nabi Muhammad' },
    { d: '2026-02-17', n: 'Tahun Baru Imlek 2577' },
    { d: '2026-03-19', n: 'Hari Suci Nyepi' },
    { d: '2026-03-20', n: 'Idul Fitri 1447 H (Hari 1)' },
    { d: '2026-03-21', n: 'Idul Fitri 1447 H (Hari 2)' },
    { d: '2026-04-03', n: 'Wafat Isa Al-Masih' },
    { d: '2026-05-01', n: 'Hari Buruh Internasional' },
    { d: '2026-05-14', n: 'Kenaikan Isa Al-Masih' },
    { d: '2026-05-27', n: 'Idul Adha 1447 H' },
    { d: '2026-06-01', n: 'Hari Lahir Pancasila' },
    { d: '2026-06-16', n: 'Tahun Baru Islam 1448 H' },
    { d: '2026-08-17', n: 'Hari Kemerdekaan RI' },
    { d: '2026-08-25', n: 'Maulid Nabi Muhammad' },
    { d: '2026-12-25', n: 'Hari Raya Natal' }
  ];

  el.innerHTML = `
    <div class="field">
      <label for="hl-year">Tahun</label>
      <select id="hl-year">
        <option value="2026">2026</option>
      </select>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="hl-go">Tampilkan</button>
    </div>
    <div class="field mt-4">
      <span class="label">Daftar Hari Libur</span>
      <div id="hl-out" class="result is-empty">Belum ditampilkan.</div>
    </div>
    <div class="help mt-2">
      Tanggal keagamaan (Idul Fitri, Idul Adha, Hijriah) bersifat perkiraan dan dapat berbeda 1 hari setelah sidang isbat. Cek SKB 3 Menteri terbaru untuk kepastian.
    </div>
  `;
  const out = el.querySelector('#hl-out');
  el.querySelector('#hl-go').addEventListener('click', () => {
    const list = HOLIDAYS_2026;
    const rows = list.map(h => {
      const d = new Date(h.d + 'T12:00:00');
      const wd = d.toLocaleDateString('id-ID', { weekday: 'short' });
      const dstr = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      return `${wd}, ${dstr} — ${h.n}`;
    });
    setResult(out, rows.join('\n'));
  });
  el.querySelector('#hl-go').click();
}

/* 8. tasbihDigital — Tasbih Digital */
export function tasbihDigital(el) {
  el.innerHTML = `
    <div style="text-align:center; padding: 16px;">
      <div id="tb-count" style="font-family:var(--font-mono); font-size:5rem; font-weight:700; line-height:1; color:var(--accent);">0</div>
      <div style="font-family:var(--font-edit); font-style:italic; color:var(--ink-muted); margin-top:8px;" id="tb-target">Target: 33</div>
    </div>
    <div style="text-align:center; margin: 24px 0;">
      <button type="button" id="tb-tap" style="width:160px; height:160px; border-radius:50%; background:var(--accent); color:var(--accent-ink); border:var(--bw-strong) solid var(--border); font-family:var(--font-display); font-size:1.5rem; font-weight:700; cursor:pointer; box-shadow:var(--shadow); transition: transform 0.1s;">
        TAP
      </button>
    </div>
    <div class="tool-grid-2">
      <div class="field">
        <label for="tb-target-in">Target dzikir</label>
        <select id="tb-target-in">
          <option value="33">Subhanallah (33×)</option>
          <option value="33">Alhamdulillah (33×)</option>
          <option value="34">Allahu Akbar (34×)</option>
          <option value="100">Asmaul Husna (100×)</option>
          <option value="999">Bebas</option>
        </select>
      </div>
      <div class="field">
        <label for="tb-custom">Atau masukkan target</label>
        <input type="number" id="tb-custom" placeholder="0" min="1">
      </div>
    </div>
    <div class="tool-actions" style="justify-content:center;">
      <button type="button" class="btn" id="tb-reset">Reset</button>
    </div>
  `;
  const countEl = el.querySelector('#tb-count');
  const targetEl = el.querySelector('#tb-target');
  const tapBtn = el.querySelector('#tb-tap');
  let count = parseInt(localStorage.getItem('aio-tasbih') || '0');
  let target = parseInt(localStorage.getItem('aio-tasbih-target') || '33');

  const render = () => {
    countEl.textContent = count;
    targetEl.textContent = `Target: ${target}`;
    if (count >= target) countEl.style.color = 'var(--cat-kalkulator)';
    else countEl.style.color = 'var(--accent)';
  };

  tapBtn.addEventListener('click', () => {
    count++;
    localStorage.setItem('aio-tasbih', String(count));
    render();
    tapBtn.style.transform = 'scale(0.95)';
    setTimeout(() => tapBtn.style.transform = 'scale(1)', 100);
    if (count === target) toast('Alhamdulillah, target tercapai!');
    if (navigator.vibrate) navigator.vibrate(20);
  });

  el.querySelector('#tb-target-in').addEventListener('change', (e) => {
    target = parseInt(e.target.value);
    localStorage.setItem('aio-tasbih-target', String(target));
    render();
  });

  el.querySelector('#tb-custom').addEventListener('input', (e) => {
    const v = parseInt(e.target.value);
    if (v > 0) {
      target = v;
      localStorage.setItem('aio-tasbih-target', String(target));
      render();
    }
  });

  el.querySelector('#tb-reset').addEventListener('click', () => {
    if (confirm('Reset hitungan tasbih ke 0?')) {
      count = 0;
      localStorage.setItem('aio-tasbih', '0');
      render();
    }
  });

  render();
}

/* 9. doaHarian — Doa Harian */
export function doaHarian(el) {
  const DOAS = [
    { t: 'Sebelum Makan', a: 'Bismillahi wa ala barakatillah', art: 'Dengan nama Allah dan dengan berkah-Nya.' },
    { t: 'Setelah Makan', a: 'Alhamdulillahilladzi ath\'amana wa saqana wa ja\'alana minal muslimin', art: 'Segala puji bagi Allah yang memberi kami makan dan minum serta menjadikan kami orang Islam.' },
    { t: 'Sebelum Tidur', a: 'Bismika Allahumma ahya wa bismika amut', art: 'Dengan nama-Mu ya Allah aku hidup dan dengan nama-Mu aku mati.' },
    { t: 'Bangun Tidur', a: 'Alhamdulillahilladzi ahyana ba\'da ma amatana wa ilaihin nusyur', art: 'Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami dan kepada-Nya kami dikembalikan.' },
    { t: 'Masuk WC', a: 'Allahumma inni a\'udzu bika minal khubutsi wal khaba\'its', art: 'Ya Allah, aku berlindung pada-Mu dari setan jantan dan betina.' },
    { t: 'Keluar WC', a: 'Ghufranak', art: 'Aku memohon ampunan-Mu.' },
    { t: 'Masuk Masjid', a: 'Allahummaftah li abwaba rahmatik', art: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.' },
    { t: 'Keluar Masjid', a: 'Allahumma inni as\'aluka min fadlik', art: 'Ya Allah, aku memohon kepada-Mu sebagian dari karunia-Mu.' },
    { t: 'Sebelum Belajar', a: 'Rabbi zidni ilma warzuqni fahma', art: 'Tuhanku, tambahkanlah ilmu kepadaku dan berilah aku pemahaman.' },
    { t: 'Untuk Orang Tua', a: 'Rabbighfir li wa liwalidayya warhamhuma kama rabbayani shaghira', art: 'Tuhanku, ampunilah aku dan kedua orang tuaku, sayangilah mereka sebagaimana mereka menyayangiku sewaktu kecil.' },
    { t: 'Kebaikan Dunia Akhirat', a: 'Rabbana atina fid dunya hasanah wa fil akhirati hasanah wa qina adzaban nar', art: 'Tuhan kami, berilah kami kebaikan di dunia dan akhirat, dan lindungilah kami dari siksa api neraka.' },
    { t: 'Ketika Hujan', a: 'Allahumma shayyiban nafi\'a', art: 'Ya Allah, turunkanlah hujan yang bermanfaat.' },
    { t: 'Saat Kesulitan', a: 'La ilaha illallahul \'azhimul halim, la ilaha illallahu rabbul \'arsyil \'azhim', art: 'Tiada tuhan selain Allah yang Maha Agung lagi Maha Penyantun. Tiada tuhan selain Allah, Tuhan pemilik Arsy yang agung.' },
    { t: 'Memakai Pakaian', a: 'Alhamdulillahilladzi kasani hadza wa razaqanihi min ghairi haulin minni wa la quwwah', art: 'Segala puji bagi Allah yang memberiku pakaian ini dan memberiku rezeki tanpa daya dan kekuatan dariku.' },
    { t: 'Bepergian', a: 'Subhanalladzi sakhkhara lana hadza wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun', art: 'Maha Suci Allah yang menundukkan kendaraan ini untuk kami, padahal kami sebelumnya tidak mampu menguasainya. Dan sungguh kepada Tuhan kami, kami akan kembali.' }
  ];

  el.innerHTML = `
    <div class="field">
      <label for="dh-search">Cari doa</label>
      <input type="text" id="dh-search" placeholder="Ketik untuk mencari doa...">
    </div>
    <div id="dh-list" style="margin-top:16px;"></div>
  `;
  const listEl = el.querySelector('#dh-list');
  const search = el.querySelector('#dh-search');

  const render = (filter = '') => {
    const f = filter.toLowerCase().trim();
    const items = f ? DOAS.filter(d => d.t.toLowerCase().includes(f) || d.a.toLowerCase().includes(f)) : DOAS;
    if (items.length === 0) {
      listEl.innerHTML = '<div class="empty-state" style="padding:16px;">Tidak ada doa yang cocok.</div>';
      return;
    }
    listEl.innerHTML = items.map(d => `
      <details style="border-bottom:var(--bw) solid var(--border); padding:12px 0;">
        <summary style="cursor:pointer; font-family:var(--font-display); font-weight:700; font-size:1rem;">${d.t}</summary>
        <div style="margin-top:8px;">
          <div style="font-family:var(--font-edit); font-style:italic; color:var(--accent); font-size:1.05rem; margin-bottom:6px;">${d.a}</div>
          <div style="font-size:0.9rem; color:var(--ink-muted);">Artinya: ${d.art}</div>
        </div>
      </details>
    `).join('');
  };

  search.addEventListener('input', () => render(search.value));
  render();
}

/* 10. asmaulHusna — Asmaul Husna */
export function asmaulHusna(el) {
  const ASMA = [
    ['Ar-Rahman','Maha Pengasih'],['Ar-Rahim','Maha Penyayang'],['Al-Malik','Maha Merajai'],['Al-Quddus','Maha Suci'],
    ['As-Salam','Maha Pemberi Kesejahteraan'],['Al-Mu\'min','Maha Pemberi Keamanan'],['Al-Muhaimin','Maha Pemelihara'],
    ['Al-\'Aziz','Maha Perkasa'],['Al-Jabbar','Maha Memaksa'],['Al-Mutakabbir','Maha Megah'],
    ['Al-Khaliq','Maha Pencipta'],['Al-Bari\'','Maha Mengadakan'],['Al-Mushawwir','Maha Pembentuk Rupa'],
    ['Al-Ghaffar','Maha Pengampun'],['Al-Qahhar','Maha Menundukkan'],['Al-Wahhab','Maha Pemberi Karunia'],
    ['Ar-Razzaq','Maha Pemberi Rezeki'],['Al-Fattah','Maha Pembuka Rahmat'],['Al-\'Alim','Maha Mengetahui'],
    ['Al-Qabidh','Maha Menyempitkan'],['Al-Basith','Maha Melapangkan'],['Al-Khafidh','Maha Merendahkan'],
    ['Ar-Rafi\'','Maha Meninggikan'],['Al-Mu\'izz','Maha Memuliakan'],['Al-Mudzill','Maha Menghinakan'],
    ['As-Sami\'','Maha Mendengar'],['Al-Bashir','Maha Melihat'],['Al-Hakam','Maha Menetapkan'],
    ['Al-\'Adl','Maha Adil'],['Al-Lathif','Maha Lembut'],['Al-Khabir','Maha Waspada'],
    ['Al-Halim','Maha Penyantun'],['Al-\'Azhim','Maha Agung'],['Al-Ghafur','Maha Pengampun'],
    ['Asy-Syakur','Maha Pembalas Budi'],['Al-\'Aliy','Maha Tinggi'],['Al-Kabir','Maha Besar'],
    ['Al-Hafizh','Maha Menjaga'],['Al-Muqit','Maha Pemberi Kecukupan'],['Al-Hasib','Maha Membuat Perhitungan'],
    ['Al-Jalil','Maha Luhur'],['Al-Karim','Maha Pemurah'],['Ar-Raqib','Maha Mengawasi'],
    ['Al-Mujib','Maha Mengabulkan'],['Al-Wasi\'','Maha Luas'],['Al-Hakim','Maha Bijaksana'],
    ['Al-Wadud','Maha Pencinta'],['Al-Majid','Maha Mulia'],['Al-Ba\'its','Maha Membangkitkan'],
    ['Asy-Syahid','Maha Menyaksikan'],['Al-Haqq','Maha Benar'],['Al-Wakil','Maha Memelihara'],
    ['Al-Qawiy','Maha Kuat'],['Al-Matin','Maha Kokoh'],['Al-Waliy','Maha Melindungi'],
    ['Al-Hamid','Maha Terpuji'],['Al-Muhshi','Maha Menghitung'],['Al-Mubdi\'','Maha Memulai'],
    ['Al-Mu\'id','Maha Mengembalikan'],['Al-Muhyi','Maha Menghidupkan'],['Al-Mumit','Maha Mematikan'],
    ['Al-Hayy','Maha Hidup'],['Al-Qayyum','Maha Berdiri Sendiri'],['Al-Wajid','Maha Menemukan'],
    ['Al-Majid','Maha Mulia'],['Al-Wahid','Maha Tunggal'],['Al-Ahad','Maha Esa'],
    ['Ash-Shamad','Maha Dibutuhkan'],['Al-Qadir','Maha Berkuasa'],['Al-Muqtadir','Maha Menentukan'],
    ['Al-Muqaddim','Maha Mendahulukan'],['Al-Mu\'akhkhir','Maha Mengakhirkan'],['Al-Awwal','Maha Awal'],
    ['Al-Akhir','Maha Akhir'],['Azh-Zhahir','Maha Nyata'],['Al-Bathin','Maha Tersembunyi'],
    ['Al-Wali','Maha Memerintah'],['Al-Muta\'ali','Maha Tinggi'],['Al-Barr','Maha Penderma'],
    ['At-Tawwab','Maha Penerima Tobat'],['Al-Muntaqim','Maha Pemberi Balasan'],['Al-\'Afuw','Maha Pemaaf'],
    ['Ar-Ra\'uf','Maha Pengasih'],['Malikul Mulk','Maha Penguasa Kerajaan'],['Dzul Jalali wal Ikram','Maha Pemilik Kebesaran dan Kemuliaan'],
    ['Al-Muqsith','Maha Pemberi Keadilan'],['Al-Jami\'','Maha Mengumpulkan'],['Al-Ghaniy','Maha Kaya'],
    ['Al-Mughni','Maha Pemberi Kekayaan'],['Al-Mani\'','Maha Mencegah'],['Adh-Dharr','Maha Pemberi Bahaya'],
    ['An-Nafi\'','Maha Pemberi Manfaat'],['An-Nur','Maha Bercahaya'],['Al-Hadi','Maha Pemberi Petunjuk'],
    ['Al-Badi\'','Maha Pencipta'],['Al-Baqi','Maha Kekal'],['Al-Warits','Maha Pewaris'],
    ['Ar-Rasyid','Maha Pandai'],['Ash-Shabur','Maha Sabar']
  ];

  el.innerHTML = `
    <div class="field">
      <label for="ah-search">Cari nama atau arti</label>
      <input type="text" id="ah-search" placeholder="Ketik untuk mencari...">
    </div>
    <div id="ah-list" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:8px; margin-top:16px;"></div>
  `;
  const listEl = el.querySelector('#ah-list');
  const search = el.querySelector('#ah-search');

  const render = (filter = '') => {
    const f = filter.toLowerCase().trim();
    const items = f ? ASMA.map((a, i) => ({ ...({ name: a[0], art: a[1], num: i + 1 }), _keep: a[0].toLowerCase().includes(f) || a[1].toLowerCase().includes(f) })).filter(x => x._keep) : ASMA.map((a, i) => ({ name: a[0], art: a[1], num: i + 1 }));
    
    if (items.length === 0) {
      listEl.innerHTML = '<div class="empty-state" style="grid-column:1/-1; padding:16px;">Tidak ada yang cocok.</div>';
      return;
    }
    
    listEl.innerHTML = items.map(a => `
      <div style="padding:12px; border:var(--bw) solid var(--border); border-radius:var(--r-md); background:var(--surface);">
        <div style="font-family:var(--font-mono); font-size:11px; color:var(--ink-muted); margin-bottom:4px;">#${a.num}</div>
        <div style="font-family:var(--font-display); font-weight:700; font-size:1rem;">${a.name}</div>
        <div style="font-size:0.85rem; color:var(--ink-muted);">${a.art}</div>
      </div>
    `).join('');
  };

  search.addEventListener('input', () => render(search.value));
  render();
}