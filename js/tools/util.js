// util.js — helper bersama untuk semua tool

export function copyText(text, btn) {
  if (!text) return;
  const done = () => { if (btn) flashBtn(btn, 'Tersalin'); else toast('Tersalin ke clipboard'); };
  const fail = () => toast('Gagal menyalin. Salin manual ya.');
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(fail);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch { fail(); }
    document.body.removeChild(ta);
  }
}

export function downloadFile(filename, content, mime = 'text/plain') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

let toastTimer;
export function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2400);
}

export function flashBtn(btn, label = 'Selesai') {
  const orig = btn.dataset.orig || btn.textContent;
  btn.dataset.orig = orig;
  btn.textContent = label;
  btn.disabled = true;
  setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1200);
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, c => (
    { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]
  ));
}

export function setResult(el, value) {
  el.textContent = value;
  el.classList.remove('is-empty');
  el.classList.remove('is-anim');
  void el.offsetWidth;
  el.classList.add('is-anim');
}

export function setError(el, msg) {
  el.textContent = msg;
  el.classList.add('is-empty');
}

export function loading(btn, on) {
  btn.classList.toggle('is-loading', on);
  btn.disabled = on;
}