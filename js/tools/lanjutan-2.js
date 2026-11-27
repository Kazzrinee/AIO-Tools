// lanjutan-2.js — Webcam, Face Blur, P2P
import { setResult, setError, toast } from './util.js';

export function webcamBooth(el) {
  el.innerHTML = `
    <div class="field" style="text-align:center;">
      <video id="cam-video" autoplay playsinline style="max-width:100%; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); display:none;"></video>
      <canvas id="cam-canvas" style="display:none;"></canvas>
      <img id="cam-photo" style="max-width:100%; border:var(--bw-strong) solid var(--border); border-radius:var(--r-md); display:none;">
    </div>
    <div class="tool-actions" style="justify-content:center;">
      <button type="button" class="btn btn-primary" id="cam-start">Nyalakan Kamera</button>
      <button type="button" class="btn" id="cam-snap" style="display:none;">Ambil Foto</button>
      <button type="button" class="btn btn-ghost" id="cam-dl" style="display:none;">Unduh Foto</button>
    </div>
    <div class="field mt-4"><label for="cam-filter">Filter</label><select id="cam-filter"><option value="none">Normal</option><option value="grayscale(1)">Hitam Putih</option><option value="sepia(1)">Sepia</option></select></div>
  `;
  const video = el.querySelector('#cam-video'); const canvas = el.querySelector('#cam-canvas'); const photo = el.querySelector('#cam-photo');
  const btnStart = el.querySelector('#cam-start'); const btnSnap = el.querySelector('#cam-snap'); const btnDl = el.querySelector('#cam-dl');
  let stream = null;
  btnStart.addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream; video.style.display = 'block'; photo.style.display = 'none';
      btnStart.style.display = 'none'; btnSnap.style.display = 'inline-flex'; btnDl.style.display = 'none';
    } catch (e) { toast('Akses kamera ditolak.'); }
  });
  btnSnap.addEventListener('click', () => {
    if (!stream) return;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d'); ctx.filter = el.querySelector('#cam-filter').value; ctx.drawImage(video, 0, 0);
    photo.src = canvas.toDataURL('image/png');
    video.style.display = 'none'; photo.style.display = 'block'; btnSnap.style.display = 'none'; btnDl.style.display = 'inline-flex';
    btnStart.textContent = 'Ulangi'; btnStart.style.display = 'inline-flex';
    stream.getTracks().forEach(t => t.stop()); stream = null;
  });
  btnDl.addEventListener('click', () => { const a = document.createElement('a'); a.href = photo.src; a.download = 'photo.png'; a.click(); });
}

export function faceBlur(el) {
  el.innerHTML = `
    <div class="field"><label for="fb-file" class="btn" style="cursor:pointer;">Pilih Gambar</label><input type="file" id="fb-file" accept="image/*" style="position:absolute;left:-9999px;"></div>
    <div class="tool-actions"><button type="button" class="btn btn-primary" id="fb-go">Sensor Wajah (AI)</button></div>
    <div class="field mt-4" id="fb-result" style="display:none; text-align:center;"><img id="fb-img" style="max-width:100%; border-radius:var(--r-md);"><br><br><a id="fb-dl" class="btn btn-primary">Unduh Gambar</a></div>
    <div class="field mt-4"><div class="result is-empty" id="fb-out">Menunggu gambar.</div></div>
  `;
  el.querySelector('#fb-go').addEventListener('click', async () => {
    const file = el.querySelector('#fb-file').files[0]; const out = el.querySelector('#fb-out');
    if (!file) return setError(out, 'Pilih gambar dulu.');
    try {
      setResult(out, 'Memuat AI (mohon tunggu 3-5 detik)...');
      if (!window.faceapi) {
        await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights');
      }
      setResult(out, 'Mendeteksi wajah...');
      const img = new Image(); img.src = URL.createObjectURL(file); await new Promise(r => img.onload = r);
      const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
      const dets = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());
      if (dets.length === 0) throw new Error('Tidak ada wajah terdeteksi.');
      dets.forEach(det => {
        const { x, y, width, height } = det.box;
        const fc = document.createElement('canvas'); fc.width = width; fc.height = height;
        fc.getContext('2d').drawImage(canvas, x, y, width, height, 0, 0, width, height);
        ctx.save(); ctx.filter = 'blur(15px)'; ctx.drawImage(fc, x, y); ctx.restore();
      });
      el.querySelector('#fb-img').src = canvas.toDataURL('image/png');
      el.querySelector('#fb-dl').href = el.querySelector('#fb-img').src;
      el.querySelector('#fb-result').style.display = 'block';
      setResult(out, `Selesai. ${dets.length} wajah disensor.`);
    } catch (e) { setError(out, e.message || 'Gagal memuat AI.'); }
  });
}

export function p2pTransfer(el) {
  el.innerHTML = `
    <div class="tool-grid-2">
      <div><h3 style="font-size:1rem;">1. Pengirim (Host)</h3><button type="button" class="btn btn-primary" id="p2p-host" style="width:100%; margin-bottom:8px;">Buat Koneksi</button><div class="field"><label>Kode Offer:</label><textarea id="p2p-offer" rows="3" readonly></textarea></div><div class="field"><label>Tempel Answer:</label><textarea id="p2p-answer" rows="3"></textarea></div><button type="button" class="btn" id="p2p-connect" style="width:100%;">Hubungkan & Kirim</button><input type="file" id="p2p-file" style="display:none;"></div>
      <div><h3 style="font-size:1rem;">2. Penerima</h3><div class="field"><label>Tempel Offer:</label><textarea id="p2p-recv-offer" rows="3"></textarea></div><button type="button" class="btn" id="p2p-accept" style="width:100%; margin-bottom:8px;">Terima Koneksi</button><div class="field"><label>Kode Answer:</label><textarea id="p2p-recv-answer" rows="3" readonly></textarea></div></div>
    </div>
    <div class="field mt-4"><div class="result is-empty" id="p2p-out">Menunggu aksi...</div></div>
    <div id="p2p-dl-area" class="mt-4" style="text-align:center;"></div>
  `;
  const out = el.querySelector('#p2p-out');
  const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  const waitIce = () => new Promise(res => { if(pc.iceGatheringState==='complete') return res(); pc.addEventListener('icegatheringstatechange', () => { if(pc.iceGatheringState==='complete') res(); }); setTimeout(res, 2000); });
  
  pc.onconnectionstatechange = () => { setResult(out, `Status: ${pc.connectionState}`); if (pc.connectionState === 'connected') toast('Terhubung!'); };

  el.querySelector('#p2p-host').addEventListener('click', async () => {
    const dc = pc.createDataChannel('file'); dc.onopen = () => el.querySelector('#p2p-file').click(); dc.binaryType = 'arraybuffer';
    el.querySelector('#p2p-file').onchange = (e) => {
      const f = e.target.files[0]; if(!f) return;
      const r = new FileReader(); r.onload = () => { dc.send(JSON.stringify({ name: f.name, type: f.type })); setTimeout(() => dc.send(r.result), 500); }; r.readAsArrayBuffer(f);
    };
    await pc.setLocalDescription(await pc.createOffer()); await waitIce(); el.querySelector('#p2p-offer').value = JSON.stringify(pc.localDescription);
  });
  el.querySelector('#p2p-connect').addEventListener('click', async () => { await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(el.querySelector('#p2p-answer').value))); });

  el.querySelector('#p2p-accept').addEventListener('click', async () => {
    pc.ondatachannel = (e) => {
      const dc = e.channel; let meta = null, chunks = [];
      dc.onmessage = (ev) => {
        if (typeof ev.data === 'string') meta = JSON.parse(ev.data);
        else { chunks.push(ev.data); const url = URL.createObjectURL(new Blob(chunks, { type: meta.type })); const a = document.createElement('a'); a.href = url; a.download = meta.name; a.textContent = 'Unduh File'; a.className = 'btn btn-primary'; el.querySelector('#p2p-dl-area').innerHTML = ''; el.querySelector('#p2p-dl-area').appendChild(a); }
      };
    };
    await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(el.querySelector('#p2p-recv-offer').value)));
    await pc.setLocalDescription(await pc.createAnswer()); await waitIce(); el.querySelector('#p2p-recv-answer').value = JSON.stringify(pc.localDescription);
  });
}