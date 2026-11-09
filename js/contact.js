// contact.js — validasi form kontak + kirim via mailto (tanpa server)
import { toast } from './tools/util.js';

// Email pemilik situs
const OWNER_EMAIL = 'releain@gmail.com';

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const get = (id) => form.querySelector('#' + id);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = get('c-name').value.trim();
    const email = get('c-email').value.trim();
    const topic = get('c-topic').value;
    const message = get('c-message').value.trim();
    const consent = get('c-consent').checked;

    if (!name) return showErr('Nama wajib diisi.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErr('Email tidak valid.');
    if (!topic) return showErr('Pilih topik dulu.');
    if (message.length < 10) return showErr('Pesan terlalu pendek (minimal 10 karakter).');
    if (!consent) return showErr('Centang persetujuan dulu sebelum mengirim.');

    const subject = `[All In One Tools] ${topic} — ${name}`;
    const body =
      `Nama: ${name}\n` +
      `Email: ${email}\n` +
      `Topik: ${topic}\n\n` +
      `Pesan:\n${message}\n`;

    const mailto = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    toast('Aplikasi email dibuka. Kirim dari sana untuk mengirim pesan.');
    clearErr();
  });

  const errBox = document.getElementById('contact-error');
  function showErr(msg) {
    if (!errBox) { toast(msg); return; }
    errBox.textContent = msg;
    errBox.classList.remove('hidden');
  }
  function clearErr() {
    if (!errBox) return;
    errBox.textContent = '';
    errBox.classList.add('hidden');
  }

  // Tombol salin email tujuan sebagai fallback
  const copyBtn = document.getElementById('copy-owner-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(OWNER_EMAIL)
          .then(() => toast('Email disalin'))
          .catch(() => toast('Gagal menyalin'));
      } else {
        toast('Salin manual: ' + OWNER_EMAIL);
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}