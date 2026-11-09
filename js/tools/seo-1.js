// seo-1.js — 5 tool SEO & Marketing
import { copyText, setResult, setError } from './util.js';

/* 1. metaTagGenerator — Generator Meta Tag */
export function metaTagGenerator(el) {
  el.innerHTML = `
    <div class="field">
      <label for="mt-title">Title Tag (max 60 karakter)</label>
      <input type="text" id="mt-title" placeholder="Contoh: Jasa Pembuatan Website Murah" maxlength="60">
    </div>
    <div class="field">
      <label for="mt-desc">Meta Description (max 160 karakter)</label>
      <textarea id="mt-desc" rows="3" maxlength="160" placeholder="Contoh: Layanan pembuatan website profesional untuk UMKM..."></textarea>
    </div>
    <div class="tool-grid-2">
      <div class="field">
        <label for="mt-author">Author</label>
        <input type="text" id="mt-author" placeholder="Nama Anda">
      </div>
      <div class="field">
        <label for="mt-robots">Robots</label>
        <select id="mt-robots">
          <option value="index, follow">index, follow (default)</option>
          <option value="noindex, nofollow">noindex, nofollow</option>
        </select>
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="mt-go">Generate</button>
      <button type="button" class="btn" id="mt-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="mt-out" style="font-size:12px; font-family:var(--font-mono);">Belum diproses.</div>
    </div>
  `;
  const out = el.querySelector('#mt-out');
  el.querySelector('#mt-go').addEventListener('click', () => {
    const title = el.querySelector('#mt-title').value.trim();
    const desc = el.querySelector('#mt-desc').value.trim();
    const author = el.querySelector('#mt-author').value.trim();
    const robots = el.querySelector('#mt-robots').value;
    
    if (!title || !desc) { setError(out, 'Title dan Description wajib diisi.'); return; }
    
    let html = '';
    html += `<title>${title}</title>\n`;
    html += `<meta name="description" content="${desc}">\n`;
    if (author) html += `<meta name="author" content="${author}">\n`;
    html += `<meta name="robots" content="${robots}">\n`;
    html += `<meta name="viewport" content="width=device-width, initial-scale=1">\n`;
    html += `<meta charset="UTF-8">`;
    
    setResult(out, html);
  });
  el.querySelector('#mt-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 2. openGraphGenerator — Generator Open Graph */
export function openGraphGenerator(el) {
  el.innerHTML = `
    <div class="field">
      <label for="og-title">Judul</label>
      <input type="text" id="og-title" placeholder="Judul Halaman">
    </div>
    <div class="field">
      <label for="og-desc">Deskripsi</label>
      <textarea id="og-desc" rows="3" placeholder="Deskripsi singkat..."></textarea>
    </div>
    <div class="tool-grid-2">
      <div class="field">
        <label for="og-url">URL Halaman</label>
        <input type="url" id="og-url" placeholder="https://situs.com/halaman">
      </div>
      <div class="field">
        <label for="og-image">URL Gambar</label>
        <input type="url" id="og-image" placeholder="https://situs.com/gambar.jpg">
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="og-go">Generate</button>
      <button type="button" class="btn" id="og-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="og-out" style="font-size:12px; font-family:var(--font-mono);">Belum diproses.</div>
    </div>
  `;
  const out = el.querySelector('#og-out');
  el.querySelector('#og-go').addEventListener('click', () => {
    const title = el.querySelector('#og-title').value.trim();
    const desc = el.querySelector('#og-desc').value.trim();
    const url = el.querySelector('#og-url').value.trim();
    const image = el.querySelector('#og-image').value.trim();
    
    if (!title || !desc || !url) { setError(out, 'Judul, Deskripsi, dan URL wajib diisi.'); return; }
    
    let html = '';
    html += `<meta property="og:type" content="website">\n`;
    html += `<meta property="og:title" content="${title}">\n`;
    html += `<meta property="og:description" content="${desc}">\n`;
    html += `<meta property="og:url" content="${url}">\n`;
    if (image) {
      html += `<meta property="og:image" content="${image}">\n`;
      html += `<meta name="twitter:card" content="summary_large_image">\n`;
      html += `<meta name="twitter:image" content="${image}">\n`;
    } else {
      html += `<meta name="twitter:card" content="summary">\n`;
    }
    html += `<meta name="twitter:title" content="${title}">\n`;
    html += `<meta name="twitter:description" content="${desc}">`;
    
    setResult(out, html);
  });
  el.querySelector('#og-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 3. robotsTxtGenerator — Generator robots.txt */
export function robotsTxtGenerator(el) {
  el.innerHTML = `
    <div class="field">
      <label for="rb-allow">Izinkan Akses (Disallow kosongkan jika semua boleh)</label>
      <input type="text" id="rb-allow" placeholder="/">
    </div>
    <div class="field">
      <label for="rb-disallow">Larang Akses (pisahkan dengan enter atau koma)</label>
      <textarea id="rb-disallow" rows="3" placeholder="/admin/&#10;/private/"></textarea>
    </div>
    <div class="field">
      <label for="rb-sitemap">URL Sitemap</label>
      <input type="url" id="rb-sitemap" placeholder="https://situs.com/sitemap.xml">
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="rb-go">Generate</button>
      <button type="button" class="btn" id="rb-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="rb-out" style="font-size:12px; font-family:var(--font-mono);">Belum diproses.</div>
    </div>
  `;
  const out = el.querySelector('#rb-out');
  el.querySelector('#rb-go').addEventListener('click', () => {
    const allow = el.querySelector('#rb-allow').value.trim();
    const disallowRaw = el.querySelector('#rb-disallow').value;
    const sitemap = el.querySelector('#rb-sitemap').value.trim();
    
    let txt = 'User-agent: *\n';
    if (allow) txt += `Allow: ${allow}\n`;
    if (disallowRaw) {
      const list = disallowRaw.split('\n').join(',').split(',').map(s => s.trim()).filter(Boolean);
      list.forEach(path => { txt += `Disallow: ${path}\n`; });
    } else {
      txt += `Disallow:\n`;
    }
    
    if (sitemap) txt += `\nSitemap: ${sitemap}`;
    
    setResult(out, txt);
  });
  el.querySelector('#rb-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 4. utmBuilder — Pembuat UTM Link */
export function utmBuilder(el) {
  el.innerHTML = `
    <div class="field">
      <label for="ut-url">URL Tujuan</label>
      <input type="url" id="ut-url" placeholder="https://situs.com/promo">
    </div>
    <div class="tool-grid-2">
      <div class="field">
        <label for="ut-source">Source (Wajib)</label>
        <input type="text" id="ut-source" placeholder="facebook, newsletter">
      </div>
      <div class="field">
        <label for="ut-medium">Medium (Wajib)</label>
        <input type="text" id="ut-medium" placeholder="cpc, email, social">
      </div>
    </div>
    <div class="tool-grid-2">
      <div class="field">
        <label for="ut-camp">Campaign</label>
        <input type="text" id="ut-camp" placeholder="promo-natal">
      </div>
      <div class="field">
        <label for="ut-content">Content (Opsional)</label>
        <input type="text" id="ut-content" placeholder="banner-atas">
      </div>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="ut-go">Buat Link</button>
      <button type="button" class="btn" id="ut-copy"><svg aria-hidden="true"><use href="/assets/icons.svg#i-copy"/></svg> Salin</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="ut-out" style="word-break:break-all;">Belum diproses.</div>
    </div>
  `;
  const out = el.querySelector('#ut-out');
  el.querySelector('#ut-go').addEventListener('click', () => {
    const url = el.querySelector('#ut-url').value.trim();
    const src = el.querySelector('#ut-source').value.trim();
    const med = el.querySelector('#ut-medium').value.trim();
    const camp = el.querySelector('#ut-camp').value.trim();
    const cont = el.querySelector('#ut-content').value.trim();
    
    if (!url || !src || !med) { setError(out, 'URL, Source, dan Medium wajib diisi.'); return; }
    
    try {
      const u = new URL(url);
      u.searchParams.set('utm_source', src);
      u.searchParams.set('utm_medium', med);
      if (camp) u.searchParams.set('utm_campaign', camp);
      if (cont) u.searchParams.set('utm_content', cont);
      setResult(out, u.toString());
    } catch (e) { setError(out, 'URL tidak valid.'); }
  });
  el.querySelector('#ut-copy').addEventListener('click', (e) => copyText(out.textContent, e.currentTarget));
}

/* 5. keywordDensity — Kepadatan Kata Kunci */
export function keywordDensity(el) {
  el.innerHTML = `
    <div class="field">
      <label for="kd-in">Teks Konten</label>
      <textarea id="kd-in" rows="8" placeholder="Tempel artikel Anda di sini..."></textarea>
    </div>
    <div class="tool-actions">
      <button type="button" class="btn btn-primary" id="kd-go">Analisis</button>
    </div>
    <div class="field mt-4">
      <span class="label">Hasil</span>
      <div class="result is-empty" id="kd-out" style="max-height:300px; overflow:auto;">Belum dianalisis.</div>
    </div>
  `;
  const out = el.querySelector('#kd-out');
  el.querySelector('#kd-go').addEventListener('click', () => {
    const txt = el.querySelector('#kd-in').value.toLowerCase();
    if (!txt.trim()) { setError(out, 'Masukkan teks.'); return; }
    
    // Bersihkan tanda baca dan ambil kata (min 3 huruf)
    const words = txt.replace(/[^\w\s\u00C0-\u024F]/g, '').split(/\s+/).filter(w => w.length > 2);
    const total = words.length;
    if (total === 0) { setError(out, 'Tidak ada kata yang valid.'); return; }
    
    const freq = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 15);
    
    let res = `Total kata: ${total}\n\n`;
    res += `Kata Kunci (Top 15):\n`;
    res += `--------------------------------\n`;
    sorted.forEach(([word, count]) => {
      const pct = ((count / total) * 100).toFixed(2);
      res += `${word.padEnd(15)} ${count.toString().padStart(4)}x (${pct}%)\n`;
    });
    
    setResult(out, res);
  });
}