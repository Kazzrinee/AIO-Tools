// consent.js
import { toast } from './tools/util.js';
const KEY = 'aio-consent';
function getConsent() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } }
function saveConsent(obj) {
  try { localStorage.setItem(KEY, JSON.stringify({ essential: true, prefs: !!obj.prefs, analytics: !!obj.analytics, ts: new Date().toISOString(), version: 1 })); } catch {}
}
export function initConsent() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-delete-all]')) {
      if(confirm('Hapus semua data lokal?')) { localStorage.clear(); location.reload(); }
    }
  });
  if (!getConsent()) {
    setTimeout(() => {
      if(document.getElementById('consent-banner')) return;
      const b = document.createElement('div');
      b.id = 'consent-banner';
      b.className = 'consent-banner';
      b.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:var(--surface);border:var(--bw-strong) solid var(--border);padding:16px;border-radius:8px;z-index:99;display:flex;gap:12px;flex-wrap:wrap;justify-content:center;width:90%;max-width:500px;box-shadow:var(--shadow);';
      b.innerHTML = `<p style="margin:0;font-size:14px;flex:1;min-width:200px;">Kami hanya menyimpan preferensi di browser Anda. Tanpa pelacakan.</p>
                      <button class="btn btn-primary" id="btn-terima">Terima</button>
                      <button class="btn btn-ink" id="btn-tolak">Tolak</button>`;
      document.body.appendChild(b);
      document.getElementById('btn-terima').onclick = () => { saveConsent({prefs:true}); b.remove(); };
      document.getElementById('btn-tolak').onclick = () => { saveConsent({prefs:false}); b.remove(); };
    }, 500);
  }
}