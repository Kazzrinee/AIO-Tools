// registry.js — sumber tunggal kebenaran untuk kategori & tool.
export const CATEGORIES = [
  { id: 'teks',       name: 'Teks',              icon: 'i-text',      desc: 'Hitung, ubah, urutkan, ekstrak.' },
  { id: 'developer',  name: 'Developer',         icon: 'i-code',      desc: 'JSON, encode, regex, warna.' },
  { id: 'gambar',     name: 'Gambar',            icon: 'i-image',     desc: 'Kompres, resize, konversi.' },
  { id: 'pdf',        name: 'PDF',               icon: 'i-pdf',       desc: 'Gabung, pisah, rotasi.' },
  { id: 'kalkulator', name: 'Kalkulator',        icon: 'i-calc',      desc: 'Umum, keuangan, kesehatan.' },
  { id: 'konverter',  name: 'Konverter',         icon: 'i-swap',      desc: 'Satuan, suhu, mata uang, angka.' },
  { id: 'keamanan',   name: 'Keamanan',          icon: 'i-shield',    desc: 'Password, hash, enkripsi.' },
  { id: 'seo',        name: 'SEO & Marketing',   icon: 'i-trend',     desc: 'Meta tag, sitemap, UTM.' },
  { id: 'pelajar',    name: 'Pelajar & Produktivitas', icon: 'i-book', desc: 'Pomodoro, catatan, IPK.' },
  { id: 'hiburan',    name: 'Hiburan & Acak',    icon: 'i-dice',      desc: 'Random, dadu, nama.' },
  { id: 'islami',     name: 'Islami & Lokal',    icon: 'i-moonstar',  desc: 'Salat, kiblat, Hijriah, THR.' }
];

export const TOOLS = [
  // ============ TEKS ============
  {
    slug: 'penghitung-kata',
    name: 'Penghitung Kata & Karakter',
    category: 'teks', icon: 'i-text',
    desc: 'Hitung jumlah kata, karakter, kalimat, dan paragraf secara instan.',
    seoTitle: 'Penghitung Kata & Karakter Online — Gratis',
    seoDesc: 'Hitung kata, karakter, kalimat, dan paragraf secara instan di browser. Tanpa login, tanpa iklan.',
    howTo: ['Tempel atau tulis teks di kotak input.', 'Angka hasil diperbarui otomatis saat Anda mengetik.', 'Klik Reset untuk mengosongkan kolom.'],
    faq: [
      { q: 'Apakah teks saya dikirim ke server?', a: 'Tidak. Semua perhitungan terjadi di browser Anda. Tidak ada data yang keluar dari perangkat.' },
      { q: 'Bagaimana kalimat dihitung?', a: 'Kalimat dihitung berdasarkan tanda baca . ! ? diikuti spasi atau akhir teks.' },
      { q: 'Apakah ada batas panjang teks?', a: 'Tidak ada batas keras dari sisi kami, tetapi teks yang sangat panjang bisa memperlambat browser.' }
    ],
    module: 'teks-1.js', fn: 'wordCounter'
  },
  {
    slug: 'ubah-huruf',
    name: 'Ubah Huruf Besar/Kecil',
    category: 'teks', icon: 'i-text',
    desc: 'Ubah teks ke UPPERCASE, lowercase, Title Case, atau Sentence case.',
    seoTitle: 'Ubah Huruf Besar Kecil Online — Gratis',
    seoDesc: 'Konversi huruf besar/kecil, Title Case, dan Sentence case secara instan. Tanpa login.',
    howTo: ['Tempel teks di kolom input.', 'Pilih mode huruf yang diinginkan.', 'Klik Salin untuk menyalin hasil.'],
    faq: [
      { q: 'Apa beda Title Case dan Sentence case?', a: 'Title Case mengkapitalisasi awal tiap kata; Sentence case hanya awal kalimat.' },
      { q: 'Apakah tanda baca berubah?', a: 'Tidak. Hanya huruf yang diubah; tanda baca dan spasi tetap.' },
      { q: 'Bisa untuk bahasa Indonesia?', a: 'Ya, konversi berlaku universal untuk huruf Latin.' }
    ],
    module: 'teks-1.js', fn: 'caseConverter'
  },
  {
    slug: 'hapus-duplikat-baris',
    name: 'Hapus Duplikat Baris',
    category: 'teks', icon: 'i-filter',
    desc: 'Hapus baris yang sama dari daftar panjang. Pertahankan urutan kemunculan pertama.',
    seoTitle: 'Hapus Baris Duplikat Online — Gratis',
    seoDesc: 'Hapus baris duplikat dari daftar. Pertahankan urutan, tanpa login.',
    howTo: ['Tempel daftar di kotak input (satu item per baris).', 'Pilih opsi case-sensitive jika perlu.', 'Salin atau unduh hasilnya.'],
    faq: [
      { q: 'Apa artinya case-sensitive?', a: 'Jika aktif, "Apel" dan "apel" dianggap berbeda. Jika tidak, dianggap sama.' },
      { q: 'Apakah urutan berubah?', a: 'Tidak. Kemunculan pertama dipertahankan; duplikat berikutnya dihapus.' },
      { q: 'Apakah baris kosong ikut dihapus?', a: 'Baris kosong dihilangkan secara default; nonaktifkan opsi jika ingin dipertahankan.' }
    ],
    module: 'teks-1.js', fn: 'removeDuplicates'
  },
  {
    slug: 'urutkan-baris',
    name: 'Urutkan Baris',
    category: 'teks', icon: 'i-sort',
    desc: 'Urutkan baris A–Z, Z–A, atau acak. Opsi hapus duplikat.',
    seoTitle: 'Urutkan Baris Online — A-Z, Z-A, Acak',
    seoDesc: 'Urutkan baris teks alfabetis naik/turun atau acak. Tanpa login.',
    howTo: ['Tempel baris di kotak input.', 'Pilih mode: A–Z, Z–A, atau Acak.', 'Salin hasilnya.'],
    faq: [
      { q: 'Bagaimana angka diurutkan?', a: 'Mengikuti locale Indonesia: angka sebelum huruf, urutan natural.' },
      { q: 'Bisa hapus duplikat sekaligus?', a: 'Ya, centang "Hapus duplikat" sebelum mengurutkan.' },
      { q: 'Apakah urutan acak bisa diulang?', a: 'Tidak. Setiap klik Acak menghasilkan urutan baru.' }
    ],
    module: 'teks-1.js', fn: 'sortLines'
  },
  {
    slug: 'cari-ganti',
    name: 'Cari & Ganti Teks',
    category: 'teks', icon: 'i-search',
    desc: 'Cari dan ganti kata atau pola di teks. Dukungan regex opsional.',
    seoTitle: 'Cari & Ganti Teks Online — Gratis',
    seoDesc: 'Cari dan ganti kata di teks, dengan opsi regex. Berjalan di browser.',
    howTo: ['Tempel teks di kolom input.', 'Isi "Cari" dan "Ganti dengan".', 'Klik Ganti Semua, lalu salin hasilnya.'],
    faq: [
      { q: 'Apa itu regex?', a: 'Regular expression — pola pencarian lanjutan. Gunakan /pola/flags seperti /\\d+/g.' },
      { q: 'Apakah semua kemunculan diganti?', a: 'Ya, tombol Ganti Semua mengganti setiap kemunculan.' },
      { q: 'Bagaimana jika pola saya salah?', a: 'Pesan error akan tampil; periksa sintaks regex Anda.' }
    ],
    module: 'teks-1.js', fn: 'findReplace'
  },
  {
    slug: 'lorem-ipsum',
    name: 'Generator Lorem Ipsum',
    category: 'teks', icon: 'i-lorem',
    desc: 'Hasilkan teks placeholder Lorem Ipsum dalam jumlah paragraf yang ditentukan.',
    seoTitle: 'Generator Lorem Ipsum — Paragraf Placeholder',
    seoDesc: 'Buat teks placeholder Lorem Ipsum. Atur jumlah paragraf, kalimat per paragraf.',
    howTo: ['Atur jumlah paragraf dan kalimat.', 'Klik Hasilkan.', 'Salin atau unduh hasilnya.'],
    faq: [
      { q: 'Apa itu Lorem Ipsum?', a: 'Teks dummy berbahasa Latin yang digunakan desainer untuk placeholder.' },
      { q: 'Apakah deterministik?', a: 'Tidak sepenuhnya; ada keacakan kecil di setiap hasil.' },
      { q: 'Bisa untuk bahasa Indonesia?', a: 'Lorem Ipsum bersifat universal di tipografi; gunakan sebagai placeholder murni.' }
    ],
    module: 'teks-2.js', fn: 'loremIpsum'
  },
  {
    slug: 'pembuat-slug',
    name: 'Pembuat Slug URL',
    category: 'teks', icon: 'i-slug',
    desc: 'Ubah judul menjadi slug URL yang aman: huruf kecil, tanda hubung, tanpa simbol.',
    seoTitle: 'Pembuat Slug URL Online — Gratis',
    seoDesc: 'Konversi judul ke slug URL yang ramah SEO. Huruf kecil, tanda hubung.',
    howTo: ['Tempel judul di kolom input.', 'Pilih pemisah (tanda hubung atau garis bawah).', 'Salin slug hasilnya.'],
    faq: [
      { q: 'Apa itu slug?', a: 'Bagian URL yang mengidentifikasi halaman, biasanya huruf kecil dipisah tanda hubung.' },
      { q: 'Bagaimana aksen/diakritik?', a: 'Di-normalisasi ke huruf Latin dasar (é→e, ñ→n).' },
      { q: 'Panjang maksimal?', a: 'Tidak ada batas keras. Untuk SEO, 3–5 kata biasanya ideal.' }
    ],
    module: 'teks-2.js', fn: 'slugGenerator'
  },
  {
    slug: 'pembalik-teks',
    name: 'Pembalik Teks',
    category: 'teks', icon: 'i-reverse',
    desc: 'Balik urutan karakter, kata, atau baris teks.',
    seoTitle: 'Pembalik Teks Online — Gratis',
    seoDesc: 'Balik teks per karakter, kata, atau baris. Tanpa login.',
    howTo: ['Tempel teks.', 'Pilih mode: karakter, kata, atau baris.', 'Salin hasilnya.'],
    faq: [
      { q: 'Apa beda balik karakter dan kata?', a: 'Balik karakter membalik "halo"→"olah". Balik kata membalik urutan kata, bukan huruf.' },
      { q: 'Apakah emoji didukung?', a: 'Ya, tetapi urutan bisa aneh untuk gabungan emoji kompleks.' },
      { q: 'Bisa untuk teks panjang?', a: 'Bisa; hanya dibatasi memori browser Anda.' }
    ],
    module: 'teks-2.js', fn: 'reverseText'
  },
  {
    slug: 'diff-teks',
    name: 'Diff Teks',
    category: 'teks', icon: 'i-diff',
    desc: 'Bandingkan dua versi teks dan lihat baris yang ditambah/dihapus.',
    seoTitle: 'Diff Teks Online — Bandingkan Dua Teks',
    seoDesc: 'Temukan perbedaan dua versi teks. Penanda + dan − untuk baris baru/dihapus.',
    howTo: ['Tempel teks lama di kiri, teks baru di kanan.', 'Klik Bandingkan.', 'Lihat baris dengan penanda.'],
    faq: [
      { q: 'Bagaimana perbandingan dilakukan?', a: 'Per baris, menggunakan algoritma LCS sederhana.' },
      { q: 'Apakah spasi dianggap?', a: 'Ya, perbedaan spasi terdeteksi. Gunakan trim jika perlu.' },
      { q: 'Bisa untuk file besar?', a: 'Untuk teks di atas ribuan baris, browser bisa melambat.' }
    ],
    module: 'teks-2.js', fn: 'diffText'
  },
  {
    slug: 'ekstrak-email-url',
    name: 'Ekstrak Email & URL',
    category: 'teks', icon: 'i-mail',
    desc: 'Ambil semua alamat email dan URL dari teks bebas.',
    seoTitle: 'Ekstrak Email & URL dari Teks — Gratis',
    seoDesc: 'Ekstrak alamat email dan URL dari teks apa pun secara instan.',
    howTo: ['Tempel teks di kolom input.', 'Klik Ekstrak.', 'Salin daftar email atau URL yang ditemukan.'],
    faq: [
      { q: 'Format email apa yang dikenali?', a: 'Pola umum seperti nama@domain.tld.' },
      { q: 'Apakah hasil unik?', a: 'Ya, duplikat dihapus otomatis.' },
      { q: 'Bagaimana jika teks berisi ribuan email?', a: 'Diproses sekaligus; tetap nyaman di browser modern.' }
    ],
    module: 'teks-2.js', fn: 'extractEmails'
  },

  // ============ DEVELOPER ============
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'developer', icon: 'i-braces',
    desc: 'Format, minify, dan validasi JSON. Tampilkan error dengan pesan jelas.',
    seoTitle: 'JSON Formatter & Validator Online — Gratis',
    seoDesc: 'Format, minify, dan validasi JSON secara instan di browser. Pesan error jelas.',
    howTo: ['Tempel JSON di kotak input.', 'Pilih Format, Minify, atau Validasi.', 'Salin atau unduh hasilnya.'],
    faq: [
      { q: 'Apakah JSON saya dikirim ke server?', a: 'Tidak. Semua pemrosesan terjadi di browser Anda.' },
      { q: 'Bagaimana jika JSON tidak valid?', a: 'Pesan error dari parser akan ditampilkan beserta lokasi baris jika tersedia.' },
      { q: 'Bisa untuk JSON besar?', a: 'Bisa, tetapi JSON di atas beberapa MB bisa memperlambat browser.' }
    ],
    module: 'developer-1.js', fn: 'jsonFormatter'
  },
  {
    slug: 'base64',
    name: 'Base64 Encode/Decode',
    category: 'developer', icon: 'i-key',
    desc: 'Konversi teks ke Base64 dan sebaliknya. Dukungan URL-safe.',
    seoTitle: 'Base64 Encoder & Decoder Online — Gratis',
    seoDesc: 'Encode dan decode Base64 secara instan. Dukungan UTF-8 dan URL-safe.',
    howTo: ['Tempel teks atau Base64 di kotak input.', 'Pilih Encode atau Decode.', 'Salin hasilnya.'],
    faq: [
      { q: 'Apa itu Base64?', a: 'Skema encoding biner-ke-teks yang memetakan data ke 64 karakter ASCII.' },
      { q: 'Kapan perlu URL-safe?', a: 'Saat Base64 akan dipakai dalam URL atau query string, karena + / = bermasalah di sana.' },
      { q: 'Apakah UTF-8 didukung?', a: 'Ya, termasuk emoji dan aksara non-Latin.' }
    ],
    module: 'developer-1.js', fn: 'base64Tool'
  },
  {
    slug: 'url-codec',
    name: 'URL Encode/Decode',
    category: 'developer', icon: 'i-swap',
    desc: 'Encode dan decode URL atau komponen URL dengan aman.',
    seoTitle: 'URL Encode/Decode Online — Gratis',
    seoDesc: 'Encode dan decode URL atau komponen URL. Berjalan di browser.',
    howTo: ['Tempel teks atau URL.', 'Pilih jenis encode/decode.', 'Salin hasilnya.'],
    faq: [
      { q: 'Apa beda "komponen" dan "URL utuh"?', a: 'Komponen meng-encode semua karakter khusus (untuk query value). URL utuh mempertahankan : / ? & = agar URL tetap utuh.' },
      { q: 'Kapan perlu encode?', a: 'Saat ada spasi, karakter non-ASCII, atau karakter khusus dalam URL.' },
      { q: 'Apakah error muncul untuk input tidak valid?', a: 'Ya, pesan error akan ditampilkan jika decode gagal.' }
    ],
    module: 'developer-1.js', fn: 'urlCodec'
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    category: 'developer', icon: 'i-hash',
    desc: 'Hasilkan UUID v4 secara acak. Opsi huruf besar, tanpa tanda hubung, bungkus kurung kurawal.',
    seoTitle: 'UUID v4 Generator Online — Gratis',
    seoDesc: 'Generate UUID v4 acak di browser. Tanpa server, tanpa login.',
    howTo: ['Atur jumlah UUID yang diinginkan.', 'Pilih format (huruf besar, tanpa dash, dsb).', 'Klik Generate, lalu salin.'],
    faq: [
      { q: 'Apakah UUID benar-benar acak?', a: 'Ya, menggunakan crypto.randomUUID() bila tersedia, dengan fallback Math.random().' },
      { q: 'Apa itu UUID v4?', a: 'UUID versi 4 adalah identifier 128-bit yang hampir seluruhnya acak.' },
      { q: 'Bisa untuk produksi?', a: 'Untuk kebanyakan kebutuhan, ya. Untuk keamanan tingkat tinggi, gunakan generator UUID kriptografis di backend.' }
    ],
    module: 'developer-1.js', fn: 'uuidGenerator'
  },
  {
    slug: 'timestamp-converter',
    name: 'Konverter Timestamp',
    category: 'developer', icon: 'i-clock',
    desc: 'Konversi Unix timestamp ke tanggal dan sebaliknya. Lihat waktu sekarang secara live.',
    seoTitle: 'Unix Timestamp Converter Online — Gratis',
    seoDesc: 'Konversi timestamp Unix ke tanggal ISO/UTC/lokal dan sebaliknya.',
    howTo: ['Lihat waktu sekarang di bagian atas.', 'Tempel timestamp atau tanggal di kotak input.', 'Klik Konversi untuk melihat semua format.'],
    faq: [
      { q: 'Detik atau milidetik?', a: 'Otomatis dideteksi: angka di bawah 10^11 dianggap detik, selebihnya milidetik.' },
      { q: 'Format tanggal apa yang diterima?', a: 'Hampir semua format yang dikenali Date.parse: ISO 8601, "2025-01-15", "Jan 15 2025", dan seterusnya.' },
      { q: 'Zona waktu apa yang ditampilkan?', a: 'UTC dan lokal (perangkat Anda).' }
    ],
    module: 'developer-1.js', fn: 'timestampConverter'
  },
  {
    slug: 'color-converter',
    name: 'Konverter Warna HEX/RGB/HSL',
    category: 'developer', icon: 'i-palette',
    desc: 'Konversi warna antar format HEX, RGB, dan HSL. Pratinjau langsung.',
    seoTitle: 'Konverter Warna HEX RGB HSL Online — Gratis',
    seoDesc: 'Konversi kode warna antara HEX, RGB, dan HSL. Pilih warna dari color picker.',
    howTo: ['Masukkan kode warna atau pilih dari color picker.', 'Klik Konversi.', 'Salin semua format yang Anda butuhkan.'],
    faq: [
      { q: 'Format warna apa yang diterima?', a: 'HEX (#RRGGBB atau #RGB), rgb(), rgba(), hsl(), hsla().' },
      { q: 'Apakah alpha didukung?', a: 'Input rgba/hsla diterima, tetapi output hanya menampilkan versi tanpa alpha.' },
      { q: 'Kenapa pratinjau bisa berbeda dari layar lain?', a: 'Kalibrasi warna layar berbeda-beda. Gunakan kode HEX sebagai acuan standar.' }
    ],
    module: 'developer-2.js', fn: 'colorConverter'
  },
  {
    slug: 'box-shadow-generator',
    name: 'CSS Box Shadow Generator',
    category: 'developer', icon: 'i-layer',
    desc: 'Buat box-shadow CSS dengan pratinjau langsung dan salin ke kode.',
    seoTitle: 'CSS Box Shadow Generator Online — Gratis',
    seoDesc: 'Buat CSS box-shadow dengan slider dan color picker. Salin kode siap pakai.',
    howTo: ['Atur horizontal, vertikal, blur, dan spread.', 'Pilih warna dan centang inset jika perlu.', 'Salin CSS yang dihasilkan.'],
    faq: [
      { q: 'Apa itu spread?', a: 'Memperbesar atau memperkecil bayangan dari ukuran elemen asli. Negatif mengecilkan.' },
      { q: 'Apa arti inset?', a: 'Bayangan diletakkan di dalam elemen, bukan di luar.' },
      { q: 'Bisa gandakan bayangan?', a: 'Di versi ini hanya satu lapis. Untuk multiple shadow, gabungkan hasilnya secara manual di CSS Anda.' }
    ],
    module: 'developer-2.js', fn: 'boxShadowGenerator'
  },
  {
    slug: 'minifier-kode',
    name: 'Minifier HTML/CSS/JS',
    category: 'developer', icon: 'i-code',
    desc: 'Perkecil ukuran HTML, CSS, atau JS dengan menghapus komentar dan spasi berlebih.',
    seoTitle: 'Minifier HTML CSS JS Online — Gratis',
    seoDesc: 'Perkecil kode HTML, CSS, dan JS secara instan di browser. Hapus komentar & spasi.',
    howTo: ['Pilih jenis kode (CSS, HTML, JS).', 'Tempel kode di kotak input.', 'Klik Minify, lalu salin hasilnya.'],
    faq: [
      { q: 'Apakah ini minifier penuh?', a: 'Tidak. Ini versi konservatif yang hanya menghapus komentar dan spasi berlebih. Untuk produksi, gunakan Terser, csso, atau html-minifier.' },
      { q: 'Mengapa JS tidak dipadatkan seagresif CSS?', a: 'Minifikasi JS tanpa parser bisa merusak kode (string, regex, template literal). Kami memilih aman.' },
      { q: 'Apakah kode saya diunggah?', a: 'Tidak. Semua terjadi di browser Anda.' }
    ],
    module: 'developer-2.js', fn: 'codeMinifier'
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    category: 'developer', icon: 'i-terminal',
    desc: 'Uji pola regex terhadap teks, lihat semua match dan posisinya.',
    seoTitle: 'Regex Tester Online — Gratis',
    seoDesc: 'Uji regex JavaScript di browser. Highlight match, lihat posisi dan grup.',
    howTo: ['Masukkan pola regex tanpa slash (misal \\d+).', 'Atur flags (g, i, m, s, u, y).', 'Ketik teks uji — hasil muncul langsung.'],
    faq: [
      { q: 'Flavor regex apa?', a: 'JavaScript (ECMAScript). Pola khusus PCRE mungkin tidak berjalan.' },
      { q: 'Bagaimana grup tangkapan ditampilkan?', a: 'Setiap grup ditampilkan di detail match dalam format array JSON.' },
      { q: 'Bagaimana match kosong ditangani?', a: 'Dengan aman: lastIndex dinaikkan otomatis dan loop dibatasi 10.000 iterasi.' }
    ],
    module: 'developer-2.js', fn: 'regexTester'
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'developer', icon: 'i-shield',
    desc: 'Decode header dan payload JWT tanpa verifikasi tanda tangan.',
    seoTitle: 'JWT Decoder Online — Lihat Header & Payload',
    seoDesc: 'Decode JWT (JSON Web Token) di browser. Lihat header, payload, dan signature.',
    howTo: ['Tempel token JWT (3 bagian dipisah titik).', 'Klik Decode.', 'Lihat header dan payload dalam format JSON.'],
    faq: [
      { q: 'Apakah token diverifikasi?', a: 'Tidak. Tool ini hanya decode base64url. Jangan gunakan untuk memvalidasi keamanan.' },
      { q: 'Kenapa signature tidak bisa dibaca?', a: 'Signature adalah hash biner; ditampilkan apa adanya sebagai string base64url.' },
      { q: 'Apakah token saya dikirim ke server?', a: 'Tidak. Semua proses di browser.' }
    ],
        module: 'developer-2.js', fn: 'jwtDecoder'
  },

  // ============ GAMBAR ============
  {
    slug: 'kompres-gambar',
    name: 'Kompres Gambar',
    category: 'gambar', icon: 'i-image',
    desc: 'Perkecil ukuran file JPG/PNG/WebP tanpa upload ke server.',
    seoTitle: 'Kompres Gambar Online — Gratis & Lokal',
    seoDesc: 'Perkecil ukuran gambar langsung di browser. Tidak ada file diunggah ke server.',
    howTo: ['Pilih gambar JPG/PNG/WebP.', 'Atur kualitas (0.8 = 80% biasanya cukup).', 'Klik Kompres, lalu unduh hasilnya.'],
    faq: [
      { q: 'Apakah gambar saya diunggah?', a: 'Tidak. Proses memakai Canvas API di browser Anda.' },
      { q: 'Format apa yang didukung?', a: 'Masukan JPG, PNG, WebP, GIF (frame pertama). Keluaran JPEG atau WebP.' },
      { q: 'Berapa persen penghematan tipikal?', a: 'Untuk foto, 40–80% dengan penurunan kualitas yang tidak terlalu terlihat.' }
    ],
    module: 'gambar-1.js', fn: 'compressImage'
  },
  {
    slug: 'resize-gambar',
    name: 'Resize Gambar',
    category: 'gambar', icon: 'i-sliders',
    desc: 'Ubah dimensi lebar dan tinggi gambar dengan menjaga rasio aspek.',
    seoTitle: 'Resize Gambar Online — Gratis',
    seoDesc: 'Ubah ukuran gambar langsung di browser. Jaga rasio aspek. Tanpa upload.',
    howTo: ['Pilih gambar.', 'Masukkan lebar atau tinggi baru.', 'Klik Resize, lalu unduh hasilnya.'],
    faq: [
      { q: 'Apakah rasio aspek bisa dijaga?', a: 'Ya, secara default. Nonaktifkan centang untuk mengubah dimensi bebas.' },
      { q: 'Apakah kualitas berkurang?', a: 'Sedikit untuk pembesaran besar; untuk pengecilan biasanya tidak terlihat.' },
      { q: 'Format keluaran?', a: 'PNG, sehingga transparansi tetap terjaga.' }
    ],
    module: 'gambar-1.js', fn: 'resizeImage'
  },
  {
    slug: 'konversi-gambar',
    name: 'Konversi Format Gambar',
    category: 'gambar', icon: 'i-swap',
    desc: 'Konversi JPG ↔ PNG ↔ WebP langsung di browser.',
    seoTitle: 'Konversi Gambar JPG PNG WebP — Gratis',
    seoDesc: 'Konversi format gambar JPG, PNG, WebP secara instan. Tanpa upload.',
    howTo: ['Pilih gambar.', 'Pilih format tujuan.', 'Klik Konversi, lalu unduh hasilnya.'],
    faq: [
      { q: 'Kenapa JPEG kehilangan transparansi?', a: 'JPEG tidak mendukung transparansi. Latar transparan otomatis diganti putih.' },
      { q: 'Apakah WebP didukung semua browser?', a: 'Hampir semua modern. Untuk kompatibilitas maksimal, pilih JPG atau PNG.' },
      { q: 'Apakah meta data dipertahankan?', a: 'Tidak. Canvas API tidak menyimpan EXIF/GPS. Ini juga mengurangi risiko privasi.' }
    ],
    module: 'gambar-1.js', fn: 'convertImage'
  },
  {
    slug: 'gambar-ke-base64',
    name: 'Gambar ke Base64',
    category: 'gambar', icon: 'i-hash',
    desc: 'Ubah gambar menjadi string Base64 (data URI) untuk disematkan di HTML/CSS.',
    seoTitle: 'Gambar ke Base64 Online — Gratis',
    seoDesc: 'Konversi gambar ke string Base64 / data URI. Tanpa upload.',
    howTo: ['Pilih gambar.', 'Centang "hanya data base64" jika perlu.', 'Klik Ubah, lalu salin hasilnya.'],
    faq: [
      { q: 'Kenapa pakai Base64?', a: 'Untuk menyematkan ikon kecil langsung di CSS atau HTML tanpa request HTTP tambahan.' },
      { q: 'Apakah bisa untuk semua gambar?', a: 'Bisa, tetapi untuk gambar besar (>50 KB) sebaiknya gunakan file terpisah karena HTML/CSS jadi gemuk.' },
      { q: 'Apakah string aman dibagikan?', a: 'String mewakili gambar Anda; jangan bagikan jika gambar bersifat pribadi.' }
    ],
    module: 'gambar-1.js', fn: 'imageToBase64'
  },
  {
    slug: 'base64-ke-gambar',
    name: 'Base64 ke Gambar',
    category: 'gambar', icon: 'i-image',
    desc: 'Ubah string Base64 kembali menjadi gambar yang bisa diunduh.',
    seoTitle: 'Base64 ke Gambar Online — Gratis',
    seoDesc: 'Konversi string Base64 atau data URI menjadi gambar. Pratinjau dan unduh.',
    howTo: ['Tempel string Base64 atau data URI.', 'Klik Tampilkan.', 'Unduh gambar yang muncul.'],
    faq: [
      { q: 'Perlu prefix data:image/?', a: 'Tidak wajib. Jika tidak ada prefix, sistem menganggap PNG.' },
      { q: 'Bagaimana jika string bukan gambar?', a: 'Pesan error akan tampil.' },
      { q: 'Apakah data dikirim ke server?', a: 'Tidak. Semua di browser.' }
    ],
    module: 'gambar-1.js', fn: 'base64ToImage'
  },
  {
    slug: 'potong-gambar',
    name: 'Potong Gambar (Crop)',
    category: 'gambar', icon: 'i-crop',
    desc: 'Potong area tertentu dari gambar dengan koordinat presisi.',
    seoTitle: 'Crop Gambar Online — Gratis',
    seoDesc: 'Crop gambar dengan koordinat X/Y dan ukuran tertentu. Tanpa upload.',
    howTo: ['Pilih gambar.', 'Atur X, Y, lebar, tinggi.', 'Klik Potong, lalu unduh hasilnya.'],
    faq: [
      { q: 'Bagaimana menentukan X dan Y?', a: 'X dan Y adalah titik kiri-atas area potong, dihitung dari pojok kiri-atas gambar (0,0).' },
      { q: 'Area yang valid?', a: 'X + lebar harus ≤ lebar gambar, dan Y + tinggi ≤ tinggi gambar.' },
      { q: 'Format keluaran?', a: 'PNG, agar kualitas tidak turun.' }
    ],
    module: 'gambar-2.js', fn: 'cropImage'
  },
  {
    slug: 'putar-balik-gambar',
    name: 'Putar & Balik Gambar',
    category: 'gambar', icon: 'i-rotate',
    desc: 'Putar 90 derajat atau balik gambar secara horizontal/vertikal.',
    seoTitle: 'Putar & Balik Gambar Online — Gratis',
    seoDesc: 'Rotasi 90°, 180°, 270° dan flip horizontal/vertikal. Unduh PNG.',
    howTo: ['Pilih gambar.', 'Klik tombol Putar atau Balik yang diinginkan.', 'Unduh hasil PNG.'],
    faq: [
      { q: 'Bisa putar 45 derajat?', a: 'Versi ini hanya 90° kelipatan. Putaran bebas butuh tool terpisah.' },
      { q: 'Apakah transformasi bisa digabung?', a: 'Ya, setiap klik tombol menumpuk transformasi pada state saat ini.' },
      { q: 'Format keluaran?', a: 'PNG transparan.' }
    ],
    module: 'gambar-2.js', fn: 'rotateFlipImage'
  },
  {
    slug: 'ambil-warna-gambar',
    name: 'Ambil Warna dari Gambar',
    category: 'gambar', icon: 'i-droplet',
    desc: 'Ketuk gambar untuk mengambil warna piksel dalam format HEX dan RGB.',
    seoTitle: 'Ambil Warna dari Gambar Online — Gratis',
    seoDesc: 'Klik gambar untuk ambil warna piksel. Dapatkan HEX dan RGB instan.',
    howTo: ['Pilih gambar.', 'Klik pada area yang ingin diambil warnanya.', 'Salin kode HEX/RGB yang muncul.'],
    faq: [
      { q: 'Kenapa warna yang saya ambil beda dari yang saya kira?', a: 'Kompresi JPEG bisa menggeser warna sedikit. Ambil dari area yang warnanya seragam.' },
      { q: 'Bisa untuk gambar transparan?', a: 'Ya, tetapi piksel transparan akan terbaca sebagai (0,0,0) hitam.' },
      { q: 'Apakah gambar diunggah?', a: 'Tidak. Semua pixel dibaca lokal via Canvas.' }
    ],
    module: 'gambar-2.js', fn: 'colorPickerImage'
  },
  {
    slug: 'watermark-gambar',
    name: 'Watermark Gambar',
    category: 'gambar', icon: 'i-layer',
    desc: 'Tambahkan teks watermark dengan posisi, warna, dan opasitas yang bisa diatur.',
    seoTitle: 'Watermark Gambar Online — Gratis',
    seoDesc: 'Tambahkan teks watermark pada gambar. Atur warna, posisi, opasitas.',
    howTo: ['Pilih gambar.', 'Atur teks, warna, ukuran, posisi.', 'Klik Terapkan, lalu unduh.'],
    faq: [
      { q: 'Bisa pakai logo gambar?', a: 'Versi ini hanya teks. Untuk logo gambar, perlu tool lanjutan.' },
      { q: 'Apakah watermark bisa dihapus?', a: 'Watermark ditanam ke piksel (bukan layer terpisah), jadi sulit dihapus tanpa edit lanjutan.' },
      { q: 'Ukuran font dalam persen itu apa?', a: 'Persentase terhadap lebar gambar. 6% kira-kira 6% dari lebar gambar.' }
    ],
    module: 'gambar-2.js', fn: 'watermarkImage'
  },
  {
    slug: 'filter-gambar',
    name: 'Filter Gambar',
    category: 'gambar', icon: 'i-sliders',
    desc: 'Terapkan filter grayscale, sepia, invert, blur, dan lainnya.',
    seoTitle: 'Filter Gambar Online — Grayscale, Sepia, Blur',
    seoDesc: 'Terapkan filter CSS ke gambar Anda: grayscale, sepia, invert, blur, brightness, contrast, saturate.',
    howTo: ['Pilih gambar.', 'Pilih filter dari dropdown.', 'Klik Terapkan, lalu unduh hasil PNG.'],
    faq: [
      { q: 'Apakah efeknya bisa digabung?', a: 'Versi ini satu filter per proses. Untuk kombinasi, unduh hasil pertama lalu terapkan filter kedua.' },
      { q: 'Bagaimana cara kerja filter?', a: 'Memakai ctx.filter dari Canvas 2D, yang kompatibel dengan sintaks filter CSS.' },
      { q: 'Apakah kualitas turun?', a: 'Tidak, keluaran PNG lossless (kecuali filter blur memang mengaburkan).' }
    ],
        module: 'gambar-2.js', fn: 'imageFilter'
  },

  // ============ PDF ============
  {
    slug: 'gabung-pdf',
    name: 'Gabung PDF',
    category: 'pdf', icon: 'i-merge',
    desc: 'Gabungkan beberapa file PDF menjadi satu dokumen utuh.',
    seoTitle: 'Gabung PDF Online — Gratis & Lokal',
    seoDesc: 'Gabungkan file PDF langsung di browser. Tidak ada file yang diunggah ke server.',
    howTo: ['Pilih 2 atau lebih file PDF.', 'Klik Gabungkan.', 'Unduh hasil PDF gabungan.'],
    faq: [
      { q: 'Apakah file saya diunggah?', a: 'Tidak. Semua proses berjalan di memori browser Anda.' },
      { q: 'Bagaimana urutan halaman?', a: 'Sesuai urutan file yang Anda pilih. File pertama menjadi halaman awal.' },
      { q: 'Apakah ada batas ukuran?', a: 'Dibatasi memori browser. Total file di bawah 100 MB umumnya aman.' }
    ],
    module: 'pdf-1.js', fn: 'mergePdf'
  },
  {
    slug: 'pisah-pdf',
    name: 'Pisah PDF',
    category: 'pdf', icon: 'i-scissors',
    desc: 'Ambil halaman tertentu dari PDF dan jadikan file baru.',
    seoTitle: 'Pisah PDF Online — Ekstrak Halaman',
    seoDesc: 'Ambil halaman tertentu dari PDF. Tanpa upload, berjalan di browser.',
    howTo: ['Pilih file PDF.', 'Isi rentang halaman (contoh: 1-3, 5).', 'Klik Pisahkan, lalu unduh hasilnya.'],
    faq: [
      { q: 'Bagaimana format rentang?', a: 'Gunakan koma untuk halaman terpisah dan tanda hubung untuk rentang: 1-3, 5, 8-10.' },
      { q: 'Apakah file asli berubah?', a: 'Tidak. File asli tetap utuh; tool ini membuat file baru.' },
      { q: 'Bisa hanya 1 halaman?', a: 'Bisa. Isi "3" untuk mengambil hanya halaman 3.' }
    ],
    module: 'pdf-1.js', fn: 'splitPdf'
  },
  {
    slug: 'kompres-pdf',
    name: 'Kompres PDF',
    category: 'pdf', icon: 'i-filter',
    desc: 'Optimasi struktur PDF dan hapus metadata untuk memperkecil ukuran.',
    seoTitle: 'Kompres PDF Online — Gratis',
    seoDesc: 'Perkecil ukuran file PDF di browser. Optimasi struktur dan metadata.',
    howTo: ['Pilih file PDF.', 'Klik Kompres.', 'Unduh hasil yang lebih kecil.'],
    faq: [
      { q: 'Berapa persen penghematannya?', a: 'Biasanya 5-15% dari optimasi struktur. Kompresi gambar di dalam PDF butuh tools khusus.' },
      { q: 'Apakah kualitas gambar turun?', a: 'Tidak. Tool ini tidak menyentuh gambar, hanya struktur file.' },
      { q: 'Bagaimana jika ukurannya malah lebih besar?', a: 'Sangat jarang terjadi, tetapi bisa jika PDF asli sudah sangat optimal. Batalkan saja.' }
    ],
    module: 'pdf-1.js', fn: 'compressPdf'
  },
  {
    slug: 'gambar-ke-pdf',
    name: 'Gambar ke PDF',
    category: 'pdf', icon: 'i-image',
    desc: 'Ubah satu atau beberapa gambar (JPG/PNG) menjadi satu file PDF.',
    seoTitle: 'Gambar ke PDF Online — Gratis',
    seoDesc: 'Konversi gambar JPG atau PNG menjadi dokumen PDF. Tanpa upload.',
    howTo: ['Pilih satu atau beberapa gambar.', 'Klik Buat PDF.', 'Unduh hasilnya.'],
    faq: [
      { q: 'Format apa yang didukung?', a: 'JPG/JPEG dan PNG. WebP perlu dikonversi dulu lewat tool Konversi Gambar.' },
      { q: 'Bagaimana ukuran halaman PDF?', a: 'Mengikuti ukuran asli gambar, sehingga proporsi tidak berubah.' },
      { q: 'Bisa atur orientasi?', a: 'Otomatis mengikuti orientasi gambar (landscape atau portrait).' }
    ],
    module: 'pdf-1.js', fn: 'imageToPdf'
  },
  {
    slug: 'teks-ke-pdf',
    name: 'Teks ke PDF',
    category: 'pdf', icon: 'i-file-text',
    desc: 'Ubah teks biasa menjadi dokumen PDF dengan format A4 atau Letter.',
    seoTitle: 'Teks ke PDF Online — Gratis',
    seoDesc: 'Konversi teks menjadi file PDF di browser. Atur ukuran kertas.',
    howTo: ['Tempel atau tulis teks.', 'Pilih ukuran kertas (A4/Letter).', 'Klik Buat PDF, lalu unduh.'],
    faq: [
      { q: 'Apakah baris panjang dipotong?', a: 'Tidak. Teks akan di-wrap otomatis sesuai lebar halaman.' },
      { q: 'Bisa atur font?', a: 'Versi ini memakai Helvetica standar. Untuk font kustom, perlu tool terpisah.' },
      { q: 'Bagaimana dengan teks non-Latin?', a: 'Font standar PDF mungkin tidak mendukung semua karakter non-Latin. Untuk karakter khusus, convert dulu ke gambar lalu ke PDF.' }
    ],
    module: 'pdf-1.js', fn: 'textToPdf'
  },
  {
    slug: 'putar-pdf',
    name: 'Putar PDF',
    category: 'pdf', icon: 'i-rotate',
    desc: 'Putar semua halaman PDF sebesar 90, 180, atau 270 derajat.',
    seoTitle: 'Putar PDF Online — Rotasi Halaman',
    seoDesc: 'Putar halaman PDF dengan sudut 90, 180, atau 270 derajat. Tanpa upload.',
    howTo: ['Pilih file PDF.', 'Pilih sudut putaran.', 'Klik Putar, lalu unduh.'],
    faq: [
      { q: 'Apakah teks jadi miring?', a: 'Tidak. Halaman diputar sebagai objek utuh, sehingga teks tetap tegak lurus.' },
      { q: 'Bisa putar halaman tertentu saja?', a: 'Versi ini memutar semua halaman. Untuk putar sebagian, gunakan Pisah PDF dulu.' },
      { q: 'Apakah file asli berubah?', a: 'Tidak, dibuat file PDF baru.' }
    ],
    module: 'pdf-2.js', fn: 'rotatePdf'
  },
  {
    slug: 'nomor-halaman-pdf',
    name: 'Nomor Halaman PDF',
    category: 'pdf', icon: 'i-list',
    desc: 'Tambahkan nomor halaman otomatis di posisi yang bisa Anda pilih.',
    seoTitle: 'Tambah Nomor Halaman PDF Online — Gratis',
    seoDesc: 'Tambahkan nomor halaman otomatis ke PDF. Atur posisi dan nomor awal.',
    howTo: ['Pilih file PDF.', 'Pilih posisi dan nomor awal.', 'Klik Terapkan, lalu unduh.'],
    faq: [
      { q: 'Bisa mulai dari angka selain 1?', a: 'Bisa. Isi "Mulai dari angka" sesuai kebutuhan (misal 5).' },
      { q: 'Apakah nomor bisa dihilangkan?', a: 'Tool ini hanya menambah. Untuk menghapus, perlu editor PDF lain.' },
      { q: 'Ukuran font nomor halaman?', a: '12pt, warna abu-abu agar tidak mencolok.' }
    ],
    module: 'pdf-2.js', fn: 'pageNumbers'
  },
  {
    slug: 'watermark-pdf',
    name: 'Watermark PDF',
    category: 'pdf', icon: 'i-layer',
    desc: 'Tambahkan teks watermark diagonal dengan opasitas rendah ke semua halaman.',
    seoTitle: 'Watermark PDF Online — Gratis',
    seoDesc: 'Tambah teks watermark diagonal pada PDF. Atur teks, opacity, dan warna.',
    howTo: ['Pilih file PDF.', 'Masukkan teks watermark.', 'Klik Terapkan, lalu unduh.'],
    faq: [
      { q: 'Bisa pakai logo?', a: 'Versi ini hanya teks. Untuk logo gambar, perlu tool terpisah.' },
      { q: 'Watermark di tengah halaman?', a: 'Ya, diagonal 45 derajat di tengah, dengan opacity 40%.' },
      { q: 'Apakah bisa dihapus dari PDF?', a: 'Watermark ditanam ke konten PDF. Bisa dihapus dengan editor PDF profesional.' }
    ],
    module: 'pdf-2.js', fn: 'watermarkPdf'
  },
  {
    slug: 'hapus-halaman-pdf',
    name: 'Hapus Halaman PDF',
    category: 'pdf', icon: 'i-trash',
    desc: 'Hapus halaman tertentu dari PDF tanpa mengubah halaman lain.',
    seoTitle: 'Hapus Halaman PDF Online — Gratis',
    seoDesc: 'Hapus halaman tertentu dari file PDF. Tanpa upload, cepat, aman.',
    howTo: ['Pilih file PDF.', 'Isi nomor halaman yang dihapus (contoh: 2, 5-7).', 'Klik Hapus, lalu unduh.'],
    faq: [
      { q: 'Bisa hapus beberapa halaman sekaligus?', a: 'Ya, pisahkan dengan koma atau gunakan rentang (2, 5-7).' },
      { q: 'Apakah urutan halaman lain berubah?', a: 'Tidak. Halaman yang tersisa tetap dalam urutan semula.' },
      { q: 'Bagaimana jika semua halaman dihapus?', a: 'Tool akan menolak karena PDF tidak boleh kosong.' }
    ],
    module: 'pdf-2.js', fn: 'deletePages'
  },
  {
    slug: 'ekstrak-teks-pdf',
    name: 'Ekstrak Teks PDF',
    category: 'pdf', icon: 'i-file-text',
    desc: 'Ambil teks dari dalam file PDF (bukan dari gambar).',
    seoTitle: 'Ekstrak Teks dari PDF Online — Gratis',
    seoDesc: 'Ekstrak teks dari file PDF di browser. Tanpa upload, aman untuk dokumen pribadi.',
    howTo: ['Pilih file PDF.', 'Klik Ekstrak Teks.', 'Salin hasilnya.'],
    faq: [
      { q: 'Mengapa hasilnya kosong?', a: 'PDF hasil scan (gambar) tidak punya teks yang bisa diekstrak. Perlu OCR.' },
      { q: 'Format hasilnya bagaimana?', a: 'Teks per halaman dengan pemisah "--- Halaman N ---".' },
      { q: 'Apakah semua PDF didukung?', a: 'Sebagian besar PDF digital (bukan scan) didukung.' }
    ],
    module: 'pdf-2.js', fn: 'extractTextPdf'
  },

  // ============ KALKULATOR ============
  {
    slug: 'kalkulator-umum',
    name: 'Kalkulator Umum',
    category: 'kalkulator', icon: 'i-calc',
    desc: 'Kalkulator standar untuk penjumlahan, pengurangan, perkalian, dan pembagian.',
    seoTitle: 'Kalkulator Umum Online — Gratis',
    seoDesc: 'Kalkulator dasar untuk operasi aritmatika. Bisa pakai keyboard atau tombol.',
    howTo: ['Klik tombol angka atau ketik di kolom input.', 'Gunakan operator +, -, *, / sesuai kebutuhan.', 'Tekan Enter atau tombol = untuk melihat hasil.'],
    faq: [
      { q: 'Apakah aman memasukkan rumus?', a: 'Ya, input dibersihkan secara ketat dari karakter yang tidak berbahaya, jadi hanya operasi matematika yang dieksekusi.' },
      { q: 'Bisa pakai kurung?', a: 'Bisa. Contoh: (2+3)*4.' },
      { q: 'Bagaimana dengan desimal?', a: 'Gunakan titik (.) sebagai pemisah desimal.' }
    ],
    module: 'kalkulator-1.js', fn: 'basicCalculator'
  },
  {
    slug: 'kalkulator-persentase',
    name: 'Kalkulator Persentase',
    category: 'kalkulator', icon: 'i-percent',
    desc: 'Hitung berapa persen suatu angka, atau berapa angka dari persentase tertentu.',
    seoTitle: 'Kalkulator Persentase Online — Gratis',
    seoDesc: 'Hitung persentase dengan mudah. X% dari Y, atau X adalah berapa % dari Y.',
    howTo: ['Isi angka pada kotak yang tersedia.', 'Klik Hitung.', 'Hasil akan muncul di bawah.'],
    faq: [
      { q: 'Bagaimana cara hitung diskon?', a: 'Gunakan baris pertama: "Berapa 20% dari 100000" untuk tahu potongannya.' },
      { q: 'Bisa hitung kenaikan?', a: 'Bisa, gunakan baris kedua: "Angka 120 adalah berapa % dari 100" artinya naik 20%.' },
      { q: 'Bisa pakai desimal?', a: 'Ya, misalnya 2.5% dari 500.' }
    ],
    module: 'kalkulator-1.js', fn: 'percentageCalculator'
  },
  {
    slug: 'kalkulator-bmi',
    name: 'Kalkulator BMI',
    category: 'kalkulator', icon: 'i-activity',
    desc: 'Hitung Indeks Massa Tubuh (BMI) dan lihat kategori berat badan Anda.',
    seoTitle: 'Kalkulator BMI Online — Cek Berat Ideal',
    seoDesc: 'Hitung BMI (Body Mass Index) berdasarkan berat dan tinggi badan. Lihat kategorinya.',
    howTo: ['Masukkan berat badan (kg) dan tinggi (cm).', 'Klik Hitung BMI.', 'Lihat nilai BMI dan kategorinya.'],
    faq: [
      { q: 'Apa itu BMI?', a: 'Indeks Massa Tubuh, ukuran kasar untuk menilai apakah berat badan Anda proporsional dengan tinggi.' },
      { q: 'Apakah BMI akurat untuk atlet?', a: 'Tidak. Atlet berotot bisa punya BMI tinggi tapi sehat. BMI hanya panduan umum.' },
      { q: 'Bagaimana kategorinya?', a: 'Kurus (<18.5), Normal (18.5-24.9), Kelebihan (25-29.9), Obesitas (≥30).' }
    ],
    module: 'kalkulator-1.js', fn: 'bmiCalculator'
  },
  {
    slug: 'kalkulator-kalori',
    name: 'Kalkulator Kalori (BMR)',
    category: 'kalkulator', icon: 'i-coffee',
    desc: 'Hitung kebutuhan kalori harian berdasarkan BMR dan level aktivitas.',
    seoTitle: 'Kalkulator Kalori & BMR Online — Gratis',
    seoDesc: 'Hitung BMR dan total kebutuhan kalori harian (TDEE) berdasarkan aktivitas.',
    howTo: ['Isi jenis kelamin, usia, berat, tinggi, dan aktivitas.', 'Klik Hitung Kalori.', 'Lihat kebutuhan kalori untuk defisit, normal, atau surplus.'],
    faq: [
      { q: 'Rumus apa yang dipakai?', a: 'Mifflin-St Jeor, salah satu rumus paling akurat untuk kebanyakan orang.' },
      { q: 'Apa itu BMR?', a: 'Basal Metabolic Rate — kalori yang dibakar saat istirahat total.' },
      { q: 'Apa itu TDEE?', a: 'Total Daily Energy Expenditure — total kalori yang dibakar per hari termasuk aktivitas.' }
    ],
    module: 'kalkulator-1.js', fn: 'calorieCalculator'
  },
  {
    slug: 'kalkulator-cicilan',
    name: 'Kalkulator Cicilan',
    category: 'kalkulator', icon: 'i-home',
    desc: 'Hitung cicilan bulanan pinjaman/KPR dengan metode anuitas.',
    seoTitle: 'Kalkulator Cicilan KPR Online — Gratis',
    seoDesc: 'Hitung cicilan bulanan pinjaman/KPR. Bunga tetap (anuitas).',
    howTo: ['Masukkan jumlah pinjaman.', 'Masukkan bunga per tahun dan tenor (bulan).', 'Klik Hitung Cicilan.'],
    faq: [
      { q: 'Apa metode anuitas?', a: 'Cicilan bulanan tetap, tetapi komposisi bunga dan pokok berubah tiap bulan.' },
      { q: 'Apakah bunga bisa berubah?', a: 'Versi ini mengasumsikan bunga tetap. Untuk bunga mengambang, hasil hanya estimasi awal.' },
      { q: 'Apakah termasuk biaya lain?', a: 'Belum termasuk biaya provisi, asuransi, atau administrasi dari bank.' }
    ],
    module: 'kalkulator-1.js', fn: 'loanCalculator'
  },
  {
    slug: 'kalkulator-bunga-majemuk',
    name: 'Kalkulator Bunga Majemuk',
    category: 'kalkulator', icon: 'i-trending-up',
    desc: 'Hitung pertumbuhan investasi dengan bunga berbunga (compound interest).',
    seoTitle: 'Kalkulator Bunga Majemuk Online — Gratis',
    seoDesc: 'Hitung pertumbuhan investasi dengan compound interest.',
    howTo: ['Masukkan modal awal, bunga, dan lama investasi.', 'Pilih frekuensi penggandaan.', 'Klik Hitung.'],
    faq: [
      { q: 'Apa itu bunga majemuk?', a: 'Bunga yang dihitung dari pokok ditambah bunga sebelumnya, sehingga tumbuh eksponensial.' },
      { q: 'Kenapa frekuensi penggandaan penting?', a: 'Semakin sering (misal bulanan vs tahunan), semakin besar hasil akhirnya.' },
      { q: 'Apakah hasil pasti?', a: 'Ya, murni matematis. Tidak memperhitungkan inflasi atau pajak.' }
    ],
    module: 'kalkulator-2.js', fn: 'compoundInterest'
  },
  {
    slug: 'kalkulator-diskon',
    name: 'Kalkulator Diskon',
    category: 'kalkulator', icon: 'i-tag',
    desc: 'Hitung harga setelah diskon dan pajak.',
    seoTitle: 'Kalkulator Diskon Online — Gratis',
    seoDesc: 'Hitung harga akhir setelah diskon dan PPN dengan cepat.',
    howTo: ['Masukkan harga asli.', 'Masukkan persentase diskon (dan PPN jika ada).', 'Klik Hitung.'],
    faq: [
      { q: 'Bisa hitung diskon ganda?', a: 'Tidak langsung. Hitung diskon pertama, lalu masukkan hasilnya sebagai harga asli untuk diskon kedua.' },
      { q: 'Apakah pajak dihitung sebelum atau sesudah diskon?', a: 'Pajak (PPN) dihitung setelah diskon, sesuai aturan umum di Indonesia.' },
      { q: 'Bisa tanpa pajak?', a: 'Bisa, biarkan kolom Pajak di 0.' }
    ],
    module: 'kalkulator-2.js', fn: 'discountCalculator'
  },
  {
    slug: 'kalkulator-ppn',
    name: 'Kalkulator PPN',
    category: 'kalkulator', icon: 'i-dollar',
    desc: 'Hitung PPN (Pajak Pertambahan Nilai) dari harga sebelum atau sesudah pajak.',
    seoTitle: 'Kalkulator PPN Online — Gratis',
    seoDesc: 'Hitung PPN dari harga. Tambah pajak atau ekstrak pajak dari harga akhir.',
    howTo: ['Pilih mode (tambah atau ekstrak PPN).', 'Masukkan nominal dan tarif PPN.', 'Klik Hitung.'],
    faq: [
      { q: 'Berapa tarif PPN Indonesia?', a: 'Saat ini 11%. Anda bisa mengubahnya jika tarif berubah.' },
      { q: 'Apa beda mode tambah dan ekstrak?', a: 'Tambah: harga belum termasuk PPN. Ekstrak: harga sudah termasuk PPN, kita cari nilai pajaknya.' },
      { q: 'Bisa untuk PPh?', a: 'Tidak langsung; PPh rumusnya berbeda. Tool ini khusus PPN.' }
    ],
    module: 'kalkulator-2.js', fn: 'taxCalculator'
  },
  {
    slug: 'kalkulator-umur',
    name: 'Kalkulator Umur',
    category: 'kalkulator', icon: 'i-calendar',
    desc: 'Hitung umur dalam tahun, bulan, hari, dan total hari hidup.',
    seoTitle: 'Kalkulator Umur Online — Gratis',
    seoDesc: 'Hitung umur dari tanggal lahir dalam tahun, bulan, minggu, dan hari.',
    howTo: ['Pilih tanggal lahir.', 'Klik Hitung Umur.', 'Lihat hasil detail.'],
    faq: [
      { q: 'Bagaimana cara menghitung umur?', a: 'Menggunakan selisih tanggal secara kalender, memperhitungkan tahun kabisat.' },
      { q: 'Bisa untuk tanggal lahir di masa depan?', a: 'Tidak, sistem akan menolak.' },
      { q: 'Apakah termasuk jam?', a: 'Tidak, hanya tanggal penuh.' }
    ],
    module: 'kalkulator-2.js', fn: 'ageCalculator'
  },
  {
    slug: 'selisih-tanggal',
    name: 'Selisih Tanggal',
    category: 'kalkulator', icon: 'i-calendar',
    desc: 'Hitung selisih hari, minggu, bulan, dan tahun antara dua tanggal.',
    seoTitle: 'Selisih Tanggal Online — Gratis',
    seoDesc: 'Hitung berapa hari, minggu, bulan, atau tahun antara dua tanggal.',
    howTo: ['Pilih tanggal awal dan tanggal akhir.', 'Klik Hitung Selisih.', 'Lihat hasil dalam berbagai satuan.'],
    faq: [
      { q: 'Apakah tanggal bisa dibalik?', a: 'Ya, hasil tetap positif (selisih absolut).' },
      { q: 'Bagaimana cara menghitung hari kerja?', a: 'Tool ini menghitung semua hari. Untuk hari kerja, perlu tool khusus.' },
      { q: 'Bisa untuk tanggal jauh?', a: 'Bisa, hingga batas Date JavaScript (sekitar tahun 275760).' }
    ],
    module: 'kalkulator-2.js', fn: 'dateDifference'
  },

  // ============ KONVERTER ============
  {
    slug: 'konverter-panjang',
    name: 'Konverter Panjang',
    category: 'konverter', icon: 'i-ruler',
    desc: 'Konversi satuan panjang: meter, kilometer, inci, kaki, yard, dan mil.',
    seoTitle: 'Konverter Panjang Online — Gratis',
    seoDesc: 'Konversi satuan panjang (m, km, cm, inci, kaki, yard, mil) secara instan.',
    howTo: ['Masukkan nilai.', 'Pilih satuan asal.', 'Klik Konversi untuk melihat semua satuan.'],
    faq: [
      { q: 'Apakah konversi presisi?', a: 'Ya, menggunakan faktor konversi standar internasional.' },
      { q: 'Bisa konversi ke semua satuan sekaligus?', a: 'Bisa. Setelah klik Konversi, semua satuan ditampilkan dalam tabel.' },
      { q: 'Satuan apa yang didukung?', a: 'mm, cm, m, km, inci, kaki, yard, dan mil.' }
    ],
    module: 'konverter-1.js', fn: 'lengthConverter'
  },
  {
    slug: 'konverter-berat',
    name: 'Konverter Berat',
    category: 'konverter', icon: 'i-weight',
    desc: 'Konversi satuan berat: miligram, gram, kilogram, ton, ons, pon, dan ounce.',
    seoTitle: 'Konverter Berat Online — Gratis',
    seoDesc: 'Konversi satuan berat (kg, g, mg, ton, ons, pon) secara instan.',
    howTo: ['Masukkan nilai.', 'Pilih satuan asal.', 'Klik Konversi.'],
    faq: [
      { q: 'Apa beda ons dan ounce?', a: 'Ons (Indonesia) = 100 gram. Ounce (oz) = 28.35 gram.' },
      { q: '1 pon berapa kg?', a: '1 pon (pound) = 0.45359237 kg.' },
      { q: 'Bisa untuk satuan metrik dan imperial?', a: 'Ya, keduanya didukung dalam satu tabel.' }
    ],
    module: 'konverter-1.js', fn: 'weightConverter'
  },
  {
    slug: 'konverter-suhu',
    name: 'Konverter Suhu',
    category: 'konverter', icon: 'i-thermometer',
    desc: 'Konversi Celsius, Fahrenheit, Kelvin, dan Réaumur.',
    seoTitle: 'Konverter Suhu Online — Celsius, Fahrenheit, Kelvin',
    seoDesc: 'Konversi suhu antara Celsius, Fahrenheit, Kelvin, dan Réaumur.',
    howTo: ['Masukkan nilai suhu.', 'Pilih satuan asal.', 'Klik Konversi.'],
    faq: [
      { q: 'Rumus Celsius ke Fahrenheit?', a: '°F = (°C × 9/5) + 32.' },
      { q: 'Berapa titik beku air dalam Kelvin?', a: '273.15 K.' },
      { q: 'Bisa untuk suhu negatif?', a: 'Bisa, selama di atas nol absolut (-273.15 °C).' }
    ],
    module: 'konverter-1.js', fn: 'tempConverter'
  },
  {
    slug: 'konverter-luas',
    name: 'Konverter Luas',
    category: 'konverter', icon: 'i-crop',
    desc: 'Konversi satuan luas: m², km², hektar, are, acre, dan kaki persegi.',
    seoTitle: 'Konverter Luas Online — Gratis',
    seoDesc: 'Konversi satuan luas (m², km², ha, acre, ft²) secara instan.',
    howTo: ['Masukkan nilai.', 'Pilih satuan asal.', 'Klik Konversi.'],
    faq: [
      { q: '1 hektar berapa m²?', a: '1 hektar = 10.000 m².' },
      { q: '1 are berapa m²?', a: '1 are = 100 m².' },
      { q: 'Bisa konversi ke acre?', a: 'Bisa. 1 acre ≈ 4046.86 m².' }
    ],
    module: 'konverter-1.js', fn: 'areaConverter'
  },
  {
    slug: 'konverter-volume',
    name: 'Konverter Volume',
    category: 'konverter', icon: 'i-droplet',
    desc: 'Konversi satuan volume: liter, mililiter, m³, galon, dan cangkir.',
    seoTitle: 'Konverter Volume Online — Liter, Galon, m³',
    seoDesc: 'Konversi satuan volume (L, mL, m³, galon) secara instan.',
    howTo: ['Masukkan nilai.', 'Pilih satuan asal.', 'Klik Konversi.'],
    faq: [
      { q: '1 liter berapa mL?', a: '1 liter = 1.000 mL.' },
      { q: '1 galon US berapa liter?', a: '1 galon US ≈ 3.78541 liter.' },
      { q: 'Bisa konversi ke satuan memasak?', a: 'Bisa, tersedia satuan cangkir (US).' }
    ],
    module: 'konverter-1.js', fn: 'volumeConverter'
  },
  {
    slug: 'konverter-kecepatan',
    name: 'Konverter Kecepatan',
    category: 'konverter', icon: 'i-wind',
    desc: 'Konversi kecepatan: km/jam, m/s, mph, knot, dan ft/s.',
    seoTitle: 'Konverter Kecepatan Online — Gratis',
    seoDesc: 'Konversi kecepatan km/h, m/s, mph, knot, ft/s secara instan.',
    howTo: ['Masukkan nilai.', 'Pilih satuan asal.', 'Klik Konversi.'],
    faq: [
      { q: '1 km/jam berapa m/s?', a: '1 km/jam ≈ 0.277778 m/s.' },
      { q: 'Apa itu knot?', a: 'Satuan kecepatan yang dipakai di dunia maritim dan penerbangan. 1 knot ≈ 0.514 km/jam.' },
      { q: 'Bisa untuk kecepatan kendaraan?', a: 'Ya, cocok untuk konversi kecepatan mobil, sepeda, atau kapal.' }
    ],
    module: 'konverter-2.js', fn: 'speedConverter'
  },
  {
    slug: 'konverter-waktu',
    name: 'Konverter Waktu',
    category: 'konverter', icon: 'i-hourglass',
    desc: 'Konversi satuan waktu: detik, menit, jam, hari, minggu, bulan, tahun.',
    seoTitle: 'Konverter Waktu Online — Gratis',
    seoDesc: 'Konversi satuan waktu (detik, menit, jam, hari, minggu, bulan, tahun).',
    howTo: ['Masukkan nilai.', 'Pilih satuan asal.', 'Klik Konversi.'],
    faq: [
      { q: 'Berapa detik dalam 1 hari?', a: '1 hari = 86.400 detik.' },
      { q: 'Berapa hari dalam 1 bulan?', a: 'Tool ini mengasumsikan 1 bulan = 30 hari. Untuk nilai presisi, gunakan kalkulator selisih tanggal.' },
      { q: 'Berapa minggu dalam 1 tahun?', a: 'Sekitar 52 minggu (tool ini menggunakan 365 hari).' }
    ],
    module: 'konverter-2.js', fn: 'timeConverter'
  },
  {
    slug: 'konverter-data',
    name: 'Konverter Data Digital',
    category: 'konverter', icon: 'i-database',
    desc: 'Konversi satuan data: bit, byte, KB, MB, GB, TB.',
    seoTitle: 'Konverter Data KB MB GB Online — Gratis',
    seoDesc: 'Konversi satuan data digital (bit, byte, KB, MB, GB, TB).',
    howTo: ['Masukkan nilai.', 'Pilih satuan asal.', 'Klik Konversi.'],
    faq: [
      { q: 'Basis desimal atau biner?', a: 'Tool ini menggunakan basis desimal (1 KB = 1000 B). Untuk KiB/MiB (basis 1024), nilai akan berbeda.' },
      { q: '1 Byte berapa bit?', a: '1 Byte = 8 bit.' },
      { q: 'Bisa untuk ukuran file?', a: 'Ya, cocok untuk mengestimasi ukuran file digital.' }
    ],
    module: 'konverter-2.js', fn: 'dataConverter'
  },
  {
    slug: 'angka-romawi',
    name: 'Konverter Angka Romawi',
    category: 'konverter', icon: 'i-hash',
    desc: 'Konversi angka desimal ke Romawi dan sebaliknya.',
    seoTitle: 'Konverter Angka Romawi Online — Gratis',
    seoDesc: 'Ubah angka desimal (1-3999) menjadi angka Romawi dan sebaliknya.',
    howTo: ['Masukkan angka desimal atau Romawi.', 'Klik Konversi.', 'Lihat hasilnya.'],
    faq: [
      { q: 'Berapa batas angka Romawi?', a: 'Format standar mendukung 1 hingga 3999.' },
      { q: 'Bagaimana Romawi untuk 0?', a: 'Tidak ada angka nol dalam sistem Romawi kuno.' },
      { q: 'Bisa untuk huruf besar dan kecil?', a: 'Bisa. Input akan otomatis diubah ke huruf besar.' }
    ],
    module: 'konverter-2.js', fn: 'romanConverter'
  },
  {
    slug: 'konverter-basis-angka',
    name: 'Konverter Basis Angka',
    category: 'konverter', icon: 'i-binary',
    desc: 'Konversi angka antara Biner, Oktal, Desimal, dan Hexadesimal.',
    seoTitle: 'Konverter Biner Hex Desimal Online — Gratis',
    seoDesc: 'Konversi basis angka Biner, Oktal, Desimal, dan Hexadesimal secara instan.',
    howTo: ['Masukkan nilai angka.', 'Pilih basis asal.', 'Klik Konversi untuk melihat semua basis.'],
    faq: [
      { q: 'Apa itu Hexadesimal?', a: 'Sistem angka basis 16 (0-9 dan A-F), umum di warna dan pemrograman.' },
      { q: 'Bisa konversi dari biner ke hex?', a: 'Bisa, langsung tanpa perlu ke desimal.' },
      { q: 'Bagaimana jika input tidak valid?', a: 'Tool akan menampilkan pesan error jika karakter tidak sesuai dengan basis yang dipilih.' }
    ],
    module: 'konverter-2.js', fn: 'baseConverter'
  },

  // ============ KEAMANAN ============
  {
    slug: 'generator-password',
    name: 'Generator Password',
    category: 'keamanan', icon: 'i-lock',
    desc: 'Buat password acak yang kuat dengan pengaturan panjang dan jenis karakter.',
    seoTitle: 'Generator Password Online — Gratis',
    seoDesc: 'Buat password acak kuat secara instan di browser. Atur panjang dan kompleksitas.',
    howTo: ['Atur panjang password.', 'Pilih kombinasi huruf, angka, dan simbol.', 'Klik Generate, lalu salin.'],
    faq: [
      { q: 'Apakah password dikirim ke server?', a: 'Tidak. Dibuat menggunakan crypto.getRandomValues di browser Anda.' },
      { q: 'Berapa panjang yang aman?', a: 'Minimal 12-16 karakter untuk keamanan modern.' },
      { q: 'Apakah password ini disimpan?', a: 'Tidak. Password hanya ditampilkan di layar dan hilang jika Anda menutup halaman.' }
    ],
    module: 'keamanan-1.js', fn: 'passwordGenerator'
  },
  {
    slug: 'cek-password',
    name: 'Cek Kekuatan Password',
    category: 'keamanan', icon: 'i-shield-check',
    desc: 'Analisis kekuatan password dan estimasi waktu yang dibutuhkan untuk menebaknya.',
    seoTitle: 'Cek Kekuatan Password Online — Gratis',
    seoDesc: 'Uji seberapa kuat password Anda dan estimasi waktu tebak. Berjalan di browser.',
    howTo: ['Ketik password.', 'Lihat indikator bar dan estimasi waktu tebak.', 'Perbaiki jika lemah.'],
    faq: [
      { q: 'Apakah password saya dikirim?', a: 'Tidak. Analisis 100% dilakukan di browser.' },
      { q: 'Apa dasar estimasi waktunya?', a: 'Menggunakan perkiraan 10 miliar tebakan per detik (standar komputer modern).' },
      { q: 'Apakah data disimpan?', a: 'Tidak, tidak ada data yang disimpan atau dicatat.' }
    ],
    module: 'keamanan-1.js', fn: 'passwordChecker'
  },
  {
    slug: 'generator-hash',
    name: 'Generator Hash',
    category: 'keamanan', icon: 'i-hash',
    desc: 'Hasilkan hash MD5, SHA-1, dan SHA-256 dari teks.',
    seoTitle: 'Generator Hash MD5 SHA Online — Gratis',
    seoDesc: 'Buat hash MD5, SHA-1, dan SHA-256 dari teks secara instan.',
    howTo: ['Masukkan teks.', 'Klik Generate Hash.', 'Salin hasil MD5, SHA-1, atau SHA-256.'],
    faq: [
      { q: 'Apa itu hash?', a: 'Fungsi satu arah yang mengubah teks menjadi kode unik dengan panjang tetap.' },
      { q: 'Bisa untuk password?', a: 'Bisa, tapi untuk password produksi gunakan bcrypt/Argon2 yang memiliki salt.' },
      { q: 'Apa beda MD5 dan SHA-256?', a: 'SHA-256 lebih aman dan modern. MD5 sudah dianggap tidak aman untuk kriptografi.' }
    ],
    module: 'keamanan-1.js', fn: 'hashGenerator'
  },
  {
    slug: 'enkripsi-aes',
    name: 'Enkripsi AES Teks',
    category: 'keamanan', icon: 'i-key',
    desc: 'Enkripsi dan dekripsi teks menggunakan standar AES (Advanced Encryption Standard).',
    seoTitle: 'Enkripsi AES Online — Gratis',
    seoDesc: 'Enkripsi teks dengan AES password-based. Berjalan di browser.',
    howTo: ['Masukkan teks.', 'Masukkan kunci rahasia.', 'Klik Enkripsi atau Dekripsi.'],
    faq: [
      { q: 'Apakah aman?', a: 'Ya, menggunakan CryptoJS dengan standar AES. Namun ingat: keamanan tergantung pada kekuatan kunci.' },
      { q: 'Bisa mendekripsi tanpa kunci?', a: 'Tidak. Tanpa kunci yang tepat, teks tidak bisa dikembalikan.' },
      { q: 'Apakah data dikirim?', a: 'Tidak. Semua proses enkripsi terjadi di perangkat Anda.' }
    ],
    module: 'keamanan-1.js', fn: 'aesEncrypt'
  },
  {
    slug: 'generator-token',
    name: 'Generator Token Acak',
    category: 'keamanan', icon: 'i-dice',
    desc: 'Buat token acak aman (hex atau base64) untuk API key atau session.',
    seoTitle: 'Generator Token Acak Online — Gratis',
    seoDesc: 'Buat token acak kriptografis untuk API key, session, atau verifikasi.',
    howTo: ['Atur panjang token.', 'Pilih format.', 'Klik Generate, lalu salin.'],
    faq: [
      { q: 'Apakah token ini aman?', a: 'Ya, menggunakan Web Crypto API (crypto.getRandomValues).' },
      { q: 'Apa beda hex dan base64?', a: 'Hex hanya berisi 0-9a-f. Base64 mencakup lebih banyak karakter sehingga lebih padat.' },
      { q: 'Bisa untuk produksi?', a: 'Bisa, asalkan tidak ada kebocoran jaringan.' }
    ],
    module: 'keamanan-1.js', fn: 'tokenGenerator'
  },

  // ============ SEO & MARKETING ============
  {
    slug: 'generator-meta-tag',
    name: 'Generator Meta Tag',
    category: 'seo', icon: 'i-globe',
    desc: 'Buat kode meta tag HTML dasar untuk SEO: title, description, author, robots.',
    seoTitle: 'Generator Meta Tag SEO Online — Gratis',
    seoDesc: 'Buat meta tag SEO (title, description, robots) siap salin untuk HTML.',
    howTo: ['Isi judul dan deskripsi.', 'Klik Generate.', 'Salin kode HTML yang muncul.'],
    faq: [
      { q: 'Berapa panjang judul ideal?', a: 'Sekitar 50-60 karakter agar tidak terpotong di Google.' },
      { q: 'Berapa panjang deskripsi ideal?', a: 'Sekitar 150-160 karakter.' },
      { q: 'Apakah ini menjamin peringkat #1?', a: 'Tidak. Meta tag hanya salah satu faktor SEO.' }
    ],
    module: 'seo-1.js', fn: 'metaTagGenerator'
  },
  {
    slug: 'generator-open-graph',
    name: 'Generator Open Graph',
    category: 'seo', icon: 'i-link',
    desc: 'Buat meta tag Open Graph & Twitter Card untuk tampilan share di media sosial.',
    seoTitle: 'Generator Open Graph & Twitter Card — Gratis',
    seoDesc: 'Buat meta tag Open Graph untuk preview share Facebook, Twitter, WhatsApp.',
    howTo: ['Isi judul, deskripsi, URL, dan URL gambar.', 'Klik Generate.', 'Salin kode HTML.'],
    faq: [
      { q: 'Apa fungsi Open Graph?', a: 'Mengatur tampilan preview saat link dibagikan di medsos.' },
      { q: 'Ukuran gambar ideal?', a: '1200x630 piksel untuk tampilan optimal.' },
      { q: 'Apakah Twitter punya standar sendiri?', a: 'Ya, Twitter Card. Generator ini membuat keduanya sekaligus.' }
    ],
    module: 'seo-1.js', fn: 'openGraphGenerator'
  },
  {
    slug: 'generator-robots-txt',
    name: 'Generator robots.txt',
    category: 'seo', icon: 'i-shield',
    desc: 'Buat file robots.txt untuk mengatur akses crawler mesin pencari.',
    seoTitle: 'Generator robots.txt Online — Gratis',
    seoDesc: 'Buat file robots.txt dengan aturan Allow, Disallow, dan Sitemap.',
    howTo: ['Isi path yang diizinkan dan dilarang.', 'Masukkan URL sitemap.', 'Klik Generate, salin hasilnya.'],
    faq: [
      { q: 'Apa fungsi robots.txt?', a: 'Memberitahu crawler halaman mana yang boleh atau tidak boleh diindeks.' },
      { q: 'Apakah bisa melindungi data rahasia?', a: 'Tidak. robots.txt hanya panduan; halaman tetap bisa diakses jika tahu URL-nya.' },
      { q: 'Disallow: / artinya apa?', a: 'Melarang semua halaman. Ini membuat situs hilang dari hasil pencarian.' }
    ],
    module: 'seo-1.js', fn: 'robotsTxtGenerator'
  },
  {
    slug: 'pembuat-utm',
    name: 'Pembuat UTM Link',
    category: 'seo', icon: 'i-target',
    desc: 'Bangun URL dengan parameter UTM untuk melacak sumber traffic di Google Analytics.',
    seoTitle: 'Pembuat UTM Link Online — Gratis',
    seoDesc: 'Buat URL dengan parameter UTM (source, medium, campaign) untuk tracking analytics.',
    howTo: ['Masukkan URL tujuan.', 'Isi source, medium, dan campaign.', 'Klik Buat Link, salin.'],
    faq: [
      { q: 'Apa itu UTM?', a: 'Urchin Tracking Module — parameter URL untuk melacak sumber kunjungan.' },
      { q: 'Apakah wajib diisi semua?', a: 'Source dan Medium wajib. Sisanya opsional.' },
      { q: 'Apakah berfungsi di semua analytic?', a: 'Google Analytics dan sebagian besar platform analytics mengenali UTM.' }
    ],
    module: 'seo-1.js', fn: 'utmBuilder'
  },
  {
    slug: 'kepadatan-kata-kunci',
    name: 'Cek Kepadatan Kata Kunci',
    category: 'seo', icon: 'i-trending-up',
    desc: 'Analisis frekuensi dan persentase kata kunci dalam artikel.',
    seoTitle: 'Cek Keyword Density Online — Gratis',
    seoDesc: 'Hitung frekuensi dan kepadatan kata kunci dalam artikel untuk optimasi SEO.',
    howTo: ['Tempel artikel.', 'Klik Analisis.', 'Lihat daftar kata terbanyak dan persentasenya.'],
    faq: [
      { q: 'Berapa keyword density ideal?', a: 'Umumnya 1-2%. Hindari di atas 3% agar tidak dianggap keyword stuffing.' },
      { q: 'Apakah stop word dihitung?', a: 'Tool ini memfilter kata kurang dari 3 huruf, tetapi belum memfilter stop word bahasa Indonesia.' },
      { q: 'Bisa untuk bahasa Indonesia?', a: 'Bisa, karena pemisahan kata berdasarkan spasi berlaku universal.' }
    ],
        module: 'seo-1.js', fn: 'keywordDensity'
  },

  // ============ PELAJAR & PRODUKTIVITAS ============
  {
    slug: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    category: 'pelajar', icon: 'i-timer',
    desc: 'Timer fokus 25 menit dan istirahat 5 menit untuk produktivitas.',
    seoTitle: 'Pomodoro Timer Online — Fokus 25 Menit',
    seoDesc: 'Timer Pomodoro 25 menit fokus dan 5 menit istirahat. Meningkatkan produktivitas belajar.',
    howTo: ['Klik Mulai untuk memulai sesi fokus.', 'Saat selesai, akan otomatis beralih ke waktu istirahat.', 'Klik Reset jika ingin mengulang.'],
    faq: [
      { q: 'Apa itu teknik Pomodoro?', a: 'Metode manajemen waktu dengan bekerja fokus selama 25 menit, lalu istirahat 5 menit.' },
      { q: 'Apakah ada suara notifikasi?', a: 'Ya, browser akan membunyikan beep sederhana saat sesi selesai.' },
      { q: 'Bisa diubah waktunya?', a: 'Di versi ini standar 25/5. Fitur kustomisasi akan ditambahkan nanti.' }
    ],
    module: 'pelajar-1.js', fn: 'pomodoroTimer'
  },
  {
    slug: 'todo-list',
    name: 'To-Do List',
    category: 'pelajar', icon: 'i-check-square',
    desc: 'Catat daftar tugas dan centang jika sudah selesai. Tersimpan otomatis.',
    seoTitle: 'To-Do List Online — Gratis',
    seoDesc: 'Buat daftar tugas sederhana yang tersimpan di browser Anda.',
    howTo: ['Ketik tugas di kolom input.', 'Tekan Enter atau klik Tambah.', 'Centang kotak jika tugas selesai.'],
    faq: [
      { q: 'Apakah data hilang jika browser ditutup?', a: 'Tidak. Data disimpan di localStorage browser Anda.' },
      { q: 'Bisa dibuka di perangkat lain?', a: 'Tidak. Data hanya tersimpan di perangkat ini (lokal).' },
      { q: 'Bagaimana cara menghapus yang sudah selesai?', a: 'Klik tombol "Hapus Selesai" di bawah daftar.' }
    ],
    module: 'pelajar-1.js', fn: 'todoList'
  },
  {
    slug: 'catatan-cepat',
    name: 'Catatan Cepat',
    category: 'pelajar', icon: 'i-edit',
    desc: 'Papan tulis sederhana yang menyimpan catatan secara otomatis.',
    seoTitle: 'Catatan Cepat Online — Autosave',
    seoDesc: 'Catatan digital yang menyimpan setiap ketikan secara otomatis di browser.',
    howTo: ['Mulai mengetik.', 'Catatan akan tersimpan otomatis.', 'Klik "Hapus Semua" untuk mengosongkan.'],
    faq: [
      { q: 'Kapan data disimpan?', a: 'Setiap 0.5 detik setelah Anda berhenti mengetik.' },
      { q: 'Apakah aman?', a: 'Sangat aman karena tidak ada data yang dikirim ke server.' },
      { q: 'Bisa menyimpan lebih dari satu catatan?', a: 'Versi ini satu papan tulis utama. Gunakan pemisah teks untuk memisahkan topik.' }
    ],
    module: 'pelajar-1.js', fn: 'quickNotes'
  },
  {
    slug: 'kalkulator-ipk',
    name: 'Kalkulator IPK',
    category: 'pelajar', icon: 'i-award',
    desc: 'Hitung Indeks Prestasi Kumulatif (IPK) berdasarkan SKS dan nilai.',
    seoTitle: 'Kalkulator IPK Online — Gratis',
    seoDesc: 'Hitung IPK dengan mudah. Masukkan SKS dan grade untuk melihat total indeks.',
    howTo: ['Isi nama mata kuliah (opsional).', 'Masukkan jumlah SKS.', 'Pilih grade (A, B+, dll).', 'Klik Hitung IPK.'],
    faq: [
      { q: 'Bagaimana bobot nilainya?', a: 'A=4, A-=3.7, B+=3.3, B=3, B-=2.7, C+=2.3, C=2, C-=1.7, D=1, E=0.' },
      { q: 'Apa itu Cum Laude?', a: 'Predikat untuk IPK ≥ 3.5 (bisa berbeda antar kampus).' },
      { q: 'Bisa untuk semua kampus?', a: 'Ya, asalkan skala penilaian menggunakan standar huruf.' }
    ],
    module: 'pelajar-1.js', fn: 'gpaCalculator'
  },
  {
    slug: 'flashcard',
    name: 'Flashcard Sederhana',
    category: 'pelajar', icon: 'i-cards',
    desc: 'Buat kartu tanya-jawab dan uji hafalan Anda dengan animasi flip.',
    seoTitle: 'Flashcard Online — Gratis',
    seoDesc: 'Buat flashcard digital untuk belajar. Klik untuk membalik kartu.',
    howTo: ['Isi pertanyaan dan jawaban.', 'Klik "Tambah Kartu".', 'Klik kartu untuk melihat jawaban.'],
    faq: [
      { q: 'Apakah kartu tersimpan?', a: 'Ya, kartu disimpan di localStorage perangkat ini.' },
      { q: 'Bisa menambah banyak kartu?', a: 'Bisa, selama masih ada ruang penyimpanan browser.' },
      { q: 'Bagaimana menghapusnya?', a: 'Saat ini belum ada tombol hapus individual. Bersihkan localStorage untuk mereset.' }
    ],
    module: 'pelajar-1.js', fn: 'flashcards'
  },
  {
    slug: 'kanban-sederhana',
    name: 'Kanban Sederhana',
    category: 'pelajar', icon: 'i-kanban',
    desc: 'Papan Kanban dengan kolom To-Do, Proses, dan Selesai untuk manajemen tugas.',
    seoTitle: 'Kanban Board Online — Gratis',
    seoDesc: 'Papan Kanban sederhana untuk melacak progres tugas.',
    howTo: ['Tambah tugas baru.', 'Gunakan panah untuk memindahkan status.', 'Klik X untuk menghapus tugas.'],
    faq: [
      { q: 'Kenapa pakai tombol panah, bukan drag-and-drop?', a: 'Agar lebih nyaman di layar sentuh (tablet/HP).' },
      { q: 'Apakah data hilang saat refresh?', a: 'Tidak, data disimpan di browser.' },
      { q: 'Bisa menambah kolom?', a: 'Di versi ini 3 kolom standar (To-Do, Proses, Selesai).' }
    ],
    module: 'pelajar-2.js', fn: 'kanbanBoard'
  },
  {
    slug: 'kalkulator-rata-rata',
    name: 'Kalkulator Rata-rata',
    category: 'pelajar', icon: 'i-bar-chart',
    desc: 'Hitung rata-rata, median, min, max, dan jumlah dari daftar angka.',
    seoTitle: 'Kalkulator Rata-rata Online — Gratis',
    seoDesc: 'Hitung nilai rata-rata, median, dan statistik dasar dari daftar angka.',
    howTo: ['Masukkan angka dipisah spasi/koma.', 'Klik Hitung.', 'Lihat hasil mean, median, min, max.'],
    faq: [
      { q: 'Bagaimana memisahkan angka?', a: 'Gunakan spasi, koma, atau baris baru.' },
      { q: 'Apa beda mean dan median?', a: 'Mean adalah rata-rata nilai. Median adalah nilai tengah jika diurutkan.' },
      { q: 'Bisa untuk desimal?', a: 'Bisa, gunakan titik sebagai pemisah desimal.' }
    ],
    module: 'pelajar-2.js', fn: 'averageCalculator'
  },
  {
    slug: 'timer-hitung-mundur',
    name: 'Timer Hitung Mundur',
    category: 'pelajar', icon: 'i-hourglass',
    desc: 'Timer hitung mundur fleksibel dengan suara saat waktu habis.',
    seoTitle: 'Timer Hitung Mundur Online — Gratis',
    seoDesc: 'Set timer hitung mundur dengan menit dan detik. Ada notifikasi suara.',
    howTo: ['Atur menit dan detik.', 'Klik Mulai.', 'Timer akan berbunyi saat waktu habis.'],
    faq: [
      { q: 'Bisa dijadikan alarm tidur?', a: 'Bisa, selama tab browser tetap terbuka.' },
      { q: 'Bisa jeda?', a: 'Ya, klik tombol Jeda saat timer berjalan.' },
      { q: 'Apakah suaranya keras?', a: 'Mengandalkan beep sistem browser, volumenya tergantung perangkat Anda.' }
    ],
    module: 'pelajar-2.js', fn: 'countdownTimer'
  },
  {
    slug: 'stopwatch',
    name: 'Stopwatch',
    category: 'pelajar', icon: 'i-clock',
    desc: 'Stopwatch presisi dengan fitur pencatatan waktu (lap).',
    seoTitle: 'Stopwatch Online — Gratis',
    seoDesc: 'Stopwatch online dengan fitur lap dan tampilan presisi milidetik.',
    howTo: ['Klik Mulai.', 'Klik Lap untuk mencatat waktu tanpa menghentikan timer.', 'Klik Reset untuk mengosongkan.'],
    faq: [
      { q: 'Seberapa presisi?', a: 'Presisi hingga 1/100 detik (centisecond).' },
      { q: 'Bisa untuk olahraga?', a: 'Bisa, stopwatch ini cukup akurat untuk latihan lari atau workout.' },
      { q: 'Apakah berjalan di latar belakang?', a: 'Ya, selama tab tidak ditutup.' }
    ],
    module: 'pelajar-2.js', fn: 'stopwatch'
  },
  {
    slug: 'acak-kelompok',
    name: 'Pengacak Kelompok',
    category: 'pelajar', icon: 'i-users',
    desc: 'Bagi daftar nama menjadi beberapa kelompok secara acak.',
    seoTitle: 'Acak Kelompok Online — Gratis',
    seoDesc: 'Bagi siswa atau peserta menjadi kelompok acak secara instan.',
    howTo: ['Masukkan nama (satu per baris).', 'Atur jumlah anggota per kelompok.', 'Klik Bagi Kelompok.'],
    faq: [
      { q: 'Apakah bisa diatur jumlah kelompoknya?', a: 'Tool ini menggunakan jumlah anggota per kelompok (size). Jika ada sisa, masuk ke kelompok terakhir.' },
      { q: 'Apakah hasilnya bisa diulang?', a: 'Ya, klik ulang tombol Bagi Kelompok untuk mengacak ulang.' },
      { q: 'Berapa maksimal nama?', a: 'Tidak ada batas keras, tetapi 100-200 nama adalah rekomendasi maksimal.' }
    ],
        module: 'pelajar-2.js', fn: 'groupRandomizer'
  },

  // ============ HIBURAN & ACAK ============
  {
    slug: 'pemilih-acak',
    name: 'Pemilih Acak',
    category: 'hiburan', icon: 'i-shuffle',
    desc: 'Pilih satu nama atau item secara acak dari daftar.',
    seoTitle: 'Pemilih Acak Online — Gratis',
    seoDesc: 'Pilih pemenang atau item secara acak dari daftar. Adil dan instan.',
    howTo: ['Masukkan daftar pilihan (satu per baris).', 'Klik Pilih Acak.', 'Lihat pemenang di kotak hasil.'],
    faq: [
      { q: 'Apakah benar-benar acak?', a: 'Ya, menggunakan Math.random() yang cukup acak untuk keperluan undian.' },
      { q: 'Bisa untuk undian berhadiah?', a: 'Bisa, dan hasilnya tidak bisa dimanipulasi oleh pengguna.' },
      { q: 'Berapa maksimal pilihan?', a: 'Tidak ada batas keras, tetapi 1000 nama sudah sangat banyak.' }
    ],
    module: 'hiburan-1.js', fn: 'randomPicker'
  },
  {
    slug: 'lempar-koin',
    name: 'Lempar Koin',
    category: 'hiburan', icon: 'i-circle',
    desc: 'Lempar koin digital untuk memutuskan antara dua pilihan.',
    seoTitle: 'Lempar Koin Online — Angka atau Gambar',
    seoDesc: 'Lempar koin digital secara acak. Hasil instan dengan animasi.',
    howTo: ['Klik Lempar Koin.', 'Tunggu animasi sebentar.', 'Lihat hasilnya (Angka/Gambar).'],
    faq: [
      { q: 'Apakah koin ini adil?', a: 'Ya, peluang 50:50 untuk Angka dan Gambar.' },
      { q: 'Bisa dipakai berkali-kali?', a: 'Bisa, klik tombolnya sebanyak yang Anda mau.' },
      { q: 'Apakah ada suara?', a: 'Tidak ada efek suara untuk menjaga pengalaman yang tenang.' }
    ],
    module: 'hiburan-1.js', fn: 'coinFlip'
  },
  {
    slug: 'lempar-dadu',
    name: 'Lempar Dadu',
    category: 'hiburan', icon: 'i-dice',
    desc: 'Lempar 1 hingga 5 dadu sekaligus dan lihat totalnya.',
    seoTitle: 'Lempar Dadu Online — Gratis',
    seoDesc: 'Lempar dadu digital 1-5 buah. Hasil acak instan dengan total.',
    howTo: ['Atur jumlah dadu.', 'Klik Lempar Dadu.', 'Lihat hasil tiap dadu dan totalnya.'],
    faq: [
      { q: 'Berapa maksimal dadu?', a: '5 dadu per lemparan.' },
      { q: 'Apakah hasilnya bisa diulang?', a: 'Ya, klik Lempar Dadu lagi untuk hasil baru.' },
      { q: 'Bisa untuk permainan papan?', a: 'Bisa, dadu ini cocok untuk menemani permainan ular tangga atau monopoli.' }
    ],
    module: 'hiburan-1.js', fn: 'diceRoll'
  },
  {
    slug: 'generator-angka-acak',
    name: 'Generator Angka Acak',
    category: 'hiburan', icon: 'i-hash',
    desc: 'Hasilkan angka acak dalam rentang minimum dan maksimum tertentu.',
    seoTitle: 'Generator Angka Acak Online — Gratis',
    seoDesc: 'Buat angka acak dalam rentang tertentu. Bisa banyak angka sekaligus.',
    howTo: ['Atur nilai minimal dan maksimal.', 'Tentukan jumlah angka.', 'Klik Generate.'],
    faq: [
      { q: 'Apakah angka bisa berulang?', a: 'Ya, tool ini menghasilkan angka acak independen (bisa berulang).' },
      { q: 'Bisa untuk angka negatif?', a: 'Bisa, masukkan angka negatif di kolom min/max.' },
      { q: 'Bisa untuk nomor undian?', a: 'Bisa, tetapi angka bisa berulang. Untuk undian unik, gunakan Pemilih Acak.' }
    ],
    module: 'hiburan-1.js', fn: 'numberGenerator'
  },
  {
    slug: 'quote-acak',
    name: 'Quote Acak',
    category: 'hiburan', icon: 'i-message-square',
    desc: 'Dapatkan kata-kata mutiara dan quote penyemangat secara acak.',
    seoTitle: 'Quote Acak — Kata Mutiara Penyemangat',
    seoDesc: 'Kumpulan quote dan kata mutiara acak untuk penyemangat harian.',
    howTo: ['Klik Quote Baru.', 'Baca quote yang muncul.', 'Klik lagi untuk quote berbeda.'],
    faq: [
      { q: 'Dari mana quote-nya?', a: 'Dikurasi secara manual dari pepatah, tokoh terkenal, dan ayat suci.' },
      { q: 'Bisa dijadikan gambar?', a: 'Belum, versi ini hanya teks.' },
      { q: 'Berapa jumlah quote?', a: 'Saat ini ada 10 quote, akan ditambah seiring waktu.' }
    ],
    module: 'hiburan-1.js', fn: 'randomQuote'
  },
  {
    slug: 'roda-undian',
    name: 'Roda Undian',
    category: 'hiburan', icon: 'i-target',
    desc: 'Putar roda undian visual untuk memilih dari beberapa opsi.',
    seoTitle: 'Roda Undian Online — Spin the Wheel',
    seoDesc: 'Putar roda undian untuk memilih nama atau opsi secara acak.',
    howTo: ['Masukkan pilihan (satu per baris, maks 8).', 'Klik Putar Roda.', 'Tunggu roda berhenti untuk melihat pemenang.'],
    faq: [
      { q: 'Kenapa maksimal 8 pilihan?', a: 'Agar teks tetap terbaca jelas di roda.' },
      { q: 'Apakah bisa diubah warnanya?', a: 'Warna dipilih otomatis dari palet kategori.' },
      { q: 'Bisa dipakai di HP?', a: 'Bisa, roda akan menyesuaikan ukuran layar.' }
    ],
    module: 'hiburan-2.js', fn: 'spinWheel'
  },
  {
    slug: 'generator-nama',
    name: 'Generator Nama Acak',
    category: 'hiburan', icon: 'i-users',
    desc: 'Buat nama fiktif acak (nama depan + nama belakang) untuk karakter.',
    seoTitle: 'Generator Nama Acak Online — Gratis',
    seoDesc: 'Buat nama fiktif acak Indonesia untuk karakter novel atau game.',
    howTo: ['Pilih jenis kelamin.', 'Atur jumlah nama.', 'Klik Generate Nama.'],
    faq: [
      { q: 'Bisa untuk nama asli?', a: 'Tool ini membuat nama fiktif. Jangan gunakan untuk pemalsuan identitas.' },
      { q: 'Apakah ada nama marga?', a: 'Ya, nama belakang umum Indonesia seperti Santoso, Wijaya, dll.' },
      { q: 'Bisa dicampur?', a: 'Generate beberapa kali untuk variasi.' }
    ],
    module: 'hiburan-2.js', fn: 'nameGenerator'
  },
  {
    slug: 'suit-online',
    name: 'Suit (Batu Gunting Kertas)',
    category: 'hiburan', icon: 'i-smile',
    desc: 'Main suit melawan komputer. Pilih batu, gunting, atau kertas.',
    seoTitle: 'Suit Online — Batu Gunting Kertas',
    seoDesc: 'Mainkan Batu Gunting Kertas melawan komputer secara online.',
    howTo: ['Pilih Batu, Gunting, atau Kertas.', 'Komputer akan memilih secara acak.', 'Lihat siapa yang menang.'],
    faq: [
      { q: 'Bagaimana aturan menangnya?', a: 'Batu mengalahkan Gunting, Gunting mengalahkan Kertas, Kertas mengalahkan Batu.' },
      { q: 'Apakah ada skor?', a: 'Belum, versi ini hanya per-ronde.' },
      { q: 'Apakah komputer curang?', a: 'Tidak, pilihan komputer 100% acak.' }
    ],
    module: 'hiburan-2.js', fn: 'rockPaperScissors'
  },
  {
    slug: 'lempar-banyak-koin',
    name: 'Lempar Banyak Koin',
    category: 'hiburan', icon: 'i-circle',
    desc: 'Lempar puluhan hingga ratusan koin sekaligus dan lihat statistiknya.',
    seoTitle: 'Lempar Banyak Koin Online — Statistik',
    seoDesc: 'Simulasikan lemparan banyak koin sekaligus. Lihat distribusi Angka vs Gambar.',
    howTo: ['Atur jumlah koin.', 'Klik Lempar.', 'Lihat total Angka dan Gambar.'],
    faq: [
      { q: 'Berapa maksimal koin?', a: '100 koin per lemparan.' },
      { q: 'Apakah hasilnya selalu mendekati 50:50?', a: 'Semakin banyak koin, semakin dekat ke 50:50 (Hukum Bilangan Besar).' },
      { q: 'Bisa dijadikan edukasi probabilitas?', a: 'Bisa, cocok untuk mendemonstrasikan konsep distribusi binomial.' }
    ],
    module: 'hiburan-2.js', fn: 'multiCoinFlip'
  },
  {
    slug: 'undian-hadiah',
    name: 'Undian Hadiah',
    category: 'hiburan', icon: 'i-gift',
    desc: 'Tarik nama pemenang undian dengan animasi yang menegangkan.',
    seoTitle: 'Undian Hadiah Online — Tarik Pemenang',
    seoDesc: 'Tarik pemenang undian secara acak dari daftar peserta dengan animasi.',
    howTo: ['Masukkan daftar peserta.', 'Isi nama hadiah.', 'Klik Tarik Undian dan tunggu pemenang muncul.'],
    faq: [
      { q: 'Apakah adil?', a: 'Ya, menggunakan Math.random() yang tidak bisa dimanipulasi.' },
      { q: 'Bisa untuk live streaming?', a: 'Bisa, tampilan animasi cocok untuk sesi live giveaway.' },
      { q: 'Bisa diulang?', a: 'Bisa, klik Tarik Undian lagi untuk mengundi ulang.' }
    ],
        module: 'hiburan-2.js', fn: 'giftDraw'
  },

  // ============ ISLAMI & LOKAL ============
  {
    slug: 'waktu-salat',
    name: 'Waktu Salat',
    category: 'islami', icon: 'i-mosque',
    desc: 'Hitung jadwal waktu salat untuk 10 kota besar Indonesia atau lokasi GPS Anda.',
    seoTitle: 'Jadwal Waktu Salat Online — Gratis',
    seoDesc: 'Jadwal waktu salat hari ini untuk Jakarta, Bandung, Surabaya, dan kota lain.',
    howTo: ['Pilih kota atau gunakan GPS.', 'Pilih tanggal.', 'Klik Hitung untuk melihat jadwal.'],
    faq: [
      { q: 'Metode perhitungan apa yang dipakai?', a: 'Sudut -18° untuk Fajr dan Isha (standar mayoritas ulama), Asr Syafi\'i.' },
      { q: 'Apakah akurat?', a: 'Perhitungan astronomi standar, bisa berbeda 1-3 menit dari jadwal Kemenag. Untuk kepastian rujuk jadwal resmi.' },
      { q: 'Bisa untuk kota lain?', a: 'Ya, gunakan opsi GPS untuk lokasi Anda saat ini.' }
    ],
    module: 'islami-1.js', fn: 'waktuSalat'
  },
  {
    slug: 'arah-kiblat',
    name: 'Arah Kiblat',
    category: 'islami', icon: 'i-compass',
    desc: 'Hitung arah kiblat dari kota Anda menuju Kabah di Makkah.',
    seoTitle: 'Arah Kiblat Online — Gratis',
    seoDesc: 'Hitung arah kiblat berdasarkan koordinat kota. Visualisasi kompas.',
    howTo: ['Pilih kota.', 'Klik Hitung Arah Kiblat.', 'Lihat derajat dan arah mata angin.'],
    faq: [
      { q: 'Dasar perhitungannya?', a: 'Great circle bearing dari koordinat kota ke Kabah (21.4225°N, 39.8262°E).' },
      { q: 'Bisa dipakai langsung tanpa kompas?', a: 'Hasil derajat bisa dipakai bersama kompas fisik. Arahkan kompas ke Utara, lalu putar badan sebesar derajat yang ditampilkan.' },
      { q: 'Mengapa berbeda dengan masjid setempat?', a: 'Bisa karena kompas fisik yang tidak terkalibrasi. Hasil tool ini murni matematis.' }
    ],
    module: 'islami-1.js', fn: 'arahKiblat'
  },
  {
    slug: 'konversi-hijriah',
    name: 'Konversi Hijriah',
    category: 'islami', icon: 'i-moonstar',
    desc: 'Konversi tanggal Masehi ke Hijriah dan sebaliknya.',
    seoTitle: 'Konversi Tanggal Hijriah Online — Gratis',
    seoDesc: 'Konversi Masehi ke Hijriah dan Hijriah ke Masehi secara instan.',
    howTo: ['Pilih arah konversi.', 'Masukkan tanggal.', 'Klik Konversi.'],
    faq: [
      { q: 'Mengapa bisa berbeda 1 hari?', a: 'Kalender Hijriah aritmatika bisa berbeda 1-2 hari dari kalender resmi (rukyat/hisab).' },
      { q: 'Rentang tahun yang didukung?', a: 'Umumnya tahun 1300-1600 H (1882-2174 M).' },
      { q: 'Bisa untuk zakat?', a: 'Bisa untuk penentuan haul zakat, tapi untuk ibadah seperti puasa rujuk jadwal resmi.' }
    ],
    module: 'islami-1.js', fn: 'konversiHijriah'
  },
  {
    slug: 'zakat-maal',
    name: 'Kalkulator Zakat Maal',
    category: 'islami', icon: 'i-coins',
    desc: 'Hitung zakat harta (maal) 2,5% berdasarkan nisab 85 gram emas.',
    seoTitle: 'Kalkulator Zakat Maal Online — Gratis',
    seoDesc: 'Hitung zakat harta 2,5% jika sudah mencapai nisab 85 gram emas.',
    howTo: ['Masukkan harga emas hari ini.', 'Isi total harta (tabungan, emas, aset) dan hutang.', 'Klik Hitung Zakat.'],
    faq: [
      { q: 'Apa itu nisab?', a: 'Batas minimal harta yang wajib dizakati. Untuk zakat maal = 85 gram emas.' },
      { q: 'Hutang dikurangkan?', a: 'Ya, hutang jatuh tempo dikurangkan dari total harta.' },
      { q: 'Haul (1 tahun) diperhitungkan?', a: 'Idealnya harta sudah dimiliki selama 1 tahun hijriah. Tool ini hanya menghitung nominal, bukan haul.' }
    ],
    module: 'islami-1.js', fn: 'zakatMaal'
  },
  {
    slug: 'zakat-fitrah',
    name: 'Kalkulator Zakat Fitrah',
    category: 'islami', icon: 'i-coins',
    desc: 'Hitung zakat fitrah (2,5 kg beras atau uang setara) per jiwa.',
    seoTitle: 'Kalkulator Zakat Fitrah Online — Gratis',
    seoDesc: 'Hitung zakat fitrah untuk satu keluarga. Beras atau uang.',
    howTo: ['Masukkan jumlah jiwa.', 'Pilih bentuk (beras atau uang).', 'Klik Hitung.'],
    faq: [
      { q: 'Berapa kg per jiwa?', a: '2,5 kg atau setara 3,5 liter beras (mayoritas ulama Indonesia).' },
      { q: 'Bisa dibayar dengan uang?', a: 'Boleh, dengan nilai setara harga beras yang biasa dikonsumsi.' },
      { q: 'Kapan waktu pembayaran?', a: 'Sebelum salat Idul Fitri, boleh sejak awal Ramadhan.' }
    ],
    module: 'islami-1.js', fn: 'zakatFitrah'
  },
  {
    slug: 'kalkulator-thr',
    name: 'Kalkulator THR',
    category: 'islami', icon: 'i-gift',
    desc: 'Hitung Tunjangan Hari Raya (THR) berdasarkan masa kerja dan gaji.',
    seoTitle: 'Kalkulator THR Online — Sesuai Permenaker',
    seoDesc: 'Hitung THR prorata atau 1× gaji sesuai Permenaker No. 6/2016.',
    howTo: ['Masukkan gaji bulanan.', 'Isi tanggal mulai bekerja dan tanggal pembayaran THR.', 'Klik Hitung.'],
    faq: [
      { q: 'Apa aturan THR?', a: 'Permenaker No. 6/2016: masa kerja ≥12 bulan = 1× gaji. 1-11 bulan = prorata.' },
      { q: 'Apakah THR wajib?', a: 'Ya, pengusaha wajib membayar THR paling lambat 7 hari sebelum hari raya.' },
      { q: 'Bagaimana jika masa kerja <1 bulan?', a: 'Menurut aturan, masa kerja ≥1 bulan berhak. Jika <1 bulan tidak wajib, tapi banyak perusahaan memberikannya proporsional.' }
    ],
    module: 'islami-2.js', fn: 'kalkulatorTHR'
  },
  {
    slug: 'hari-libur-nasional',
    name: 'Hari Libur Nasional',
    category: 'islami', icon: 'i-calendar',
    desc: 'Daftar hari libur nasional Indonesia tahun 2026.',
    seoTitle: 'Hari Libur Nasional 2026 — Daftar Lengkap',
    seoDesc: 'Daftar hari libur nasional dan cuti bersama Indonesia tahun 2026.',
    howTo: ['Pilih tahun.', 'Klik Tampilkan.', 'Lihat daftar tanggal libur dan namanya.'],
    faq: [
      { q: 'Apakah data resmi?', a: 'Perkiraan berdasarkan SKB 3 Menteri. Tanggal keagamaan bisa berbeda setelah sidang isbat.' },
      { q: 'Bisa untuk tahun lain?', a: 'Saat ini hanya 2026. Tahun berikutnya ditambahkan saat datanya tersedia.' },
      { q: 'Ada cuti bersama?', a: 'Versi ini hanya hari libur nasional. Cuti bersama menyesuaikan SKB terbaru.' }
    ],
    module: 'islami-2.js', fn: 'hariLibur'
  },
  {
    slug: 'tasbih-digital',
    name: 'Tasbih Digital',
    category: 'islami', icon: 'i-circle',
    desc: 'Penghitung dzikir digital dengan target dan getaran.',
    seoTitle: 'Tasbih Digital Online — Hitung Dzikir',
    seoDesc: 'Tasbih digital untuk menghitung dzikir. Ada getaran saat tap.',
    howTo: ['Ketuk tombol TAP untuk menambah hitungan.', 'Atur target dzikir.', 'Klik Reset untuk memulai dari 0.'],
    faq: [
      { q: 'Apakah hitungan tersimpan?', a: 'Ya, tersimpan di browser. Refresh tidak menghilangkan hitungan.' },
      { q: 'Ada getaran?', a: 'Ya, pada perangkat yang mendukung (ponsel/tablet dengan vibrate API).' },
      { q: 'Bisa untuk dzikir apa saja?', a: 'Bisa untuk Subhanallah, Alhamdulillah, Allahu Akbar, atau dzikir apa pun.' }
    ],
    module: 'islami-2.js', fn: 'tasbihDigital'
  },
  {
    slug: 'doa-harian',
    name: 'Doa Harian',
    category: 'islami', icon: 'i-hands',
    desc: 'Kumpulan doa harian pendek dalam bahasa Arab latin beserta artinya.',
    seoTitle: 'Doa Harian Islam — Lengkap & Gratis',
    seoDesc: 'Kumpulan doa harian: sebelum makan, tidur, belajar, untuk orang tua, dan lainnya.',
    howTo: ['Lihat daftar doa.', 'Ketuk judul untuk melihat teks dan artinya.', 'Gunakan pencarian untuk mencari doa tertentu.'],
    faq: [
      { q: 'Berapa jumlah doa?', a: 'Ada 15 doa harian populer. Akan ditambah bertahap.' },
      { q: 'Teks Arab-nya ada?', a: 'Versi ini latin transliterasi + arti. Teks Arab akan ditambahkan di update berikutnya.' },
      { q: 'Sumber doa-nya dari mana?', a: 'Dari hadits dan Al-Quran yang populer dikutip di buku-buku doa.' }
    ],
    module: 'islami-2.js', fn: 'doaHarian'
  },
  {
    slug: 'asmaul-husna',
    name: 'Asmaul Husna',
    category: 'islami', icon: 'i-quran',
    desc: 'Daftar 99 nama Allah (Asmaul Husna) beserta artinya.',
    seoTitle: 'Asmaul Husna 99 Nama Allah — Lengkap',
    seoDesc: '99 nama Allah beserta artinya. Cari dengan mudah.',
    howTo: ['Lihat daftar 99 nama.', 'Gunakan pencarian untuk menemukan nama tertentu.', 'Atau cari berdasarkan arti.'],
    faq: [
      { q: 'Ada berapa nama?', a: '99 nama (Asmaul Husna) sesuai hadits riwayat Bukhari-Muslim.' },
      { q: 'Apakah disertai teks Arab?', a: 'Versi ini hanya transliterasi Latin + arti.' },
      { q: 'Bisa untuk hafalan?', a: 'Bisa, daftar bisa dicari berdasarkan nama atau arti.' }
    ],
    module: 'islami-2.js', fn: 'asmaulHusna'
  }
];