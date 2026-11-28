// catur.js — Game Catur (AI, Lokal, P2P) + Asisten Stockfish + History + Fullscreen
import { toast } from './util.js';

const CHESS_JS = 'https://cdn.jsdelivr.net/npm/chess.js@0.10.3/chess.min.js';
const STOCKFISH_JS = 'https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js';

export async function caturGame(el) {
  el.innerHTML = `<div class="result" style="text-align:center; padding:20px;">Memuat library Catur...</div>`;
  try {
    if (!window.Chess) await loadScript(CHESS_JS);
    renderApp(el);
  } catch (e) {
    el.innerHTML = `<div class="error-state">Gagal memuat library: ${e.message}</div>`;
  }
}

function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });
}

function renderApp(el) {
  el.innerHTML = `
    <style>
      .chess-wrapper { display: flex; gap: 16px; justify-content: center; align-items: flex-start; flex-wrap: wrap; margin-top: 16px; }
      .chess-main { flex: 1; min-width: 280px; max-width: 400px; }
      .chess-sidebar { flex: 0 0 140px; background: var(--surface-2); border: var(--bw) solid var(--border); border-radius: var(--r-md); padding: 8px; height: 400px; overflow-y: auto; }
      .chess-board { display: grid; grid-template-columns: repeat(8, 1fr); width: 100%; aspect-ratio: 1; border: 2px solid var(--border); border-radius: 4px; overflow: hidden; }
      .chess-sq { display: flex; align-items: center; justify-content: center; font-size: 8vw; max-font-size: 32px; cursor: pointer; user-select: none; transition: background 0.1s; }
      @media (min-width: 400px) { .chess-sq { font-size: 32px; } }
      .chess-sq.light { background: #EBE4D4; color: #14110C; }
      .chess-sq.dark { background: #9A4A28; color: #EBE4D4; }
      .chess-sq.selected { background: var(--accent) !important; color: var(--accent-ink) !important; }
      .chess-sq.valid { position: relative; }
      .chess-sq.valid::after { content: ''; position: absolute; width: 25%; height: 25%; background: rgba(0,0,0,0.3); border-radius: 50%; }
      .chess-controls { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
      .move-list { font-family: var(--font-mono); font-size: 13px; }
      .move-row { display: flex; padding: 2px 4px; border-bottom: 1px solid var(--border-muted); }
      .move-row:nth-child(even) { background: var(--surface); }
      .move-num { width: 25px; color: var(--ink-muted); }
      .move-w, .move-b { width: 50%; }
      .fullscreen-active { position: fixed !important; inset: 0 !important; z-index: 9999 !important; background: var(--bg) !important; display: flex !important; flex-direction: column !important; align-items: center !important; padding: 16px !important; overflow-y: auto !important; }
    </style>
    <div id="chess-app">
      <div class="chess-controls">
        <button class="btn btn-sm" id="btn-mode-ai">Lawan AI</button>
        <button class="btn btn-sm" id="btn-mode-p2p">Mabar P2P</button>
        <button class="btn btn-sm" id="btn-hint" style="background:var(--cat-ai); color:#fff;">Cheat (Tanya AI)</button>
        <button class="btn btn-sm" id="btn-fullscreen">Fullscreen</button>
      </div>
      <div id="p2p-setup" style="display:none; background:var(--surface-2); padding:12px; border-radius:4px; margin-bottom:12px;">
        <div style="display:flex; gap:8px; margin-bottom:8px;">
          <button class="btn btn-sm" id="p2p-host">Buat Koneksi (Host)</button>
          <button class="btn btn-sm" id="p2p-join">Terima Koneksi (Join)</button>
        </div>
        <input type="text" id="p2p-offer" placeholder="Kode Offer (dari Host)..." readonly style="width:100%; font-size:11px; margin-bottom:4px;">
        <input type="text" id="p2p-answer" placeholder="Kode Answer (dari Join)..." style="width:100%; font-size:11px;">
      </div>
      <div class="chess-wrapper">
        <div class="chess-main">
          <div class="chess-board" id="board"></div>
          <div id="status" style="text-align:center; font-weight:bold; margin-top:12px;">Giliran: Putih</div>
        </div>
        <div class="chess-sidebar">
          <h4 style="margin-top:0; font-size:12px; text-transform:uppercase; margin-bottom:8px;">Riwayat</h4>
          <div class="move-list" id="move-list"></div>
        </div>
      </div>
    </div>
  `;

  const app = el.querySelector('#chess-app');
  const game = new Chess();
  const boardEl = el.querySelector('#board');
  const statusEl = el.querySelector('#status');
  const historyEl = el.querySelector('#move-list');
  let selectedSq = null;
  let mode = 'local'; // 'local', 'ai', 'p2p'
  let stockfish = null;
  
  // Setup WebRTC
  const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  let dc = null;

  pc.ondatachannel = (e) => { dc = e.channel; setupDC(); };

  const setupDC = () => {
    dc.onmessage = (e) => {
      const move = JSON.parse(e.data);
      game.move(move);
      renderBoard();
      updateStatus();
    };
  };

  const updateStatus = () => {
    if (game.in_checkmate()) {
      statusEl.textContent = `SKAKMAT! ${game.turn() === 'w' ? 'Hitam' : 'Putih'} Menang!`;
    } else if (game.in_draw()) {
      statusEl.textContent = `SERI!`;
    } else {
      statusEl.textContent = `Giliran: ${game.turn() === 'w' ? 'Putih' : 'Hitam'}${game.in_check() ? ' (SKAK)' : ''}`;
    }
  };

  const updateHistory = () => {
    const history = game.history();
    let html = '';
    for (let i = 0; i < history.length; i += 2) {
      html += `<div class="move-row">
        <div class="move-num">${Math.floor(i/2) + 1}.</div>
        <div class="move-w">${history[i]}</div>
        <div class="move-b">${history[i+1] || ''}</div>
      </div>`;
    }
    historyEl.innerHTML = html;
    historyEl.scrollTop = historyEl.scrollHeight;
  };

  // UI Controls
  el.querySelector('#btn-mode-ai').onclick = () => { mode = 'ai'; toast('Mode Lawan AI Aktif (Anda = Putih)'); };
  el.querySelector('#btn-mode-p2p').onclick = () => el.querySelector('#p2p-setup').style.display = 'block';
  el.querySelector('#btn-fullscreen').onclick = () => {
    app.classList.toggle('fullscreen-active');
    if (app.classList.contains('fullscreen-active')) {
      el.querySelector('#btn-fullscreen').textContent = 'Keluar Fullscreen';
      // Force re-render board for new size
      setTimeout(renderBoard, 50);
    } else {
      el.querySelector('#btn-fullscreen').textContent = 'Fullscreen';
    }
  };

  el.querySelector('#p2p-host').onclick = async () => {
    mode = 'p2p';
    dc = pc.createDataChannel('move'); setupDC();
    const offer = await pc.createOffer(); await pc.setLocalDescription(offer);
    setTimeout(() => el.querySelector('#p2p-offer').value = JSON.stringify(pc.localDescription), 1000);
  };

  el.querySelector('#p2p-join').onclick = async () => {
    mode = 'p2p';
    const offerStr = el.querySelector('#p2p-offer').value;
    if (!offerStr) return toast('Minta kode Offer dari Host dulu!');
    await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offerStr)));
    const answer = await pc.createAnswer(); await pc.setLocalDescription(answer);
    setTimeout(() => el.querySelector('#p2p-answer').value = JSON.stringify(pc.localDescription), 1000);
  };

  const renderBoard = () => {
    boardEl.innerHTML = '';
    const board = game.board();
    const unicode = { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔' };

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        const sq = document.createElement('div');
        const isLight = (r + c) % 2 === 0;
        sq.className = `chess-sq ${isLight ? 'light' : 'dark'}`;
        const coord = String.fromCharCode(97 + c) + (8 - r);
        sq.dataset.sq = coord;
        
        if (piece) sq.textContent = unicode[piece.color === 'w' ? piece.type.toUpperCase() : piece.type];
        if (selectedSq === coord) sq.classList.add('selected');
        if (selectedSq && game.moves({ square: selectedSq, verbose: true }).some(m => m.to === coord)) {
          sq.classList.add('valid');
        }
        sq.onclick = () => handleSquareClick(coord);
        boardEl.appendChild(sq);
      }
    }
  };

  const handleSquareClick = (coord) => {
    if (game.game_over()) return toast('Permainan Selesai!');
    
    if (selectedSq) {
      const move = game.move({ from: selectedSq, to: coord, promotion: 'q' });
      if (move) {
        if (mode === 'p2p' && dc && dc.readyState === 'open') dc.send(JSON.stringify({ from: move.from, to: move.to, promotion: 'q' }));
        selectedSq = null;
        renderBoard();
        updateStatus();
        updateHistory();
        
        if (mode === 'ai' && game.turn() === 'b' && !game.game_over()) {
          setTimeout(makeAIMove, 500);
        }
        return;
      }
    }
    
    const piece = game.get(coord);
    if (piece && piece.color === game.turn()) {
      selectedSq = coord;
      renderBoard();
    } else {
      selectedSq = null;
      renderBoard();
    }
  };

  // Perbaikan Bug AI: Load Stockfish via Blob untuk menghindari CORS
  const initStockfish = async () => {
    if (stockfish) return;
    toast('Memuat Mesin Catur AI (± 2MB)...');
    try {
      const response = await fetch(STOCKFISH_JS);
      const text = await response.text();
      const blob = new Blob([text], { type: 'application/javascript' });
      stockfish = new Worker(URL.createObjectURL(blob));
      stockfish.postMessage('uci');
    } catch (e) {
      toast('Gagal memuat AI: ' + e.message);
    }
  };

  el.querySelector('#btn-hint').onclick = async () => {
    if (game.game_over()) return;
    if (!stockfish) await initStockfish();
    toast('AI sedang menghitung langkah terbaik...');
    stockfish.onmessage = (e) => {
      const msg = e.data;
      if (typeof msg === 'string' && msg.startsWith('bestmove')) {
        const best = msg.split(' ')[1];
        if (best && best !== '(none)') {
          const from = best.slice(0, 2);
          const to = best.slice(2, 4);
          selectedSq = from;
          renderBoard();
          toast(`Saran AI: Pindahkan dari ${from} ke ${to}`);
        }
        stockfish.onmessage = null;
      }
    };
    stockfish.postMessage('position fen ' + game.fen());
    stockfish.postMessage('go depth 10');
  };

  const makeAIMove = () => {
    if (!stockfish) { initStockfish().then(() => makeAIMove()); return; }
    statusEl.textContent = 'AI sedang berpikir...';
    stockfish.onmessage = (e) => {
      const msg = e.data;
      if (typeof msg === 'string' && msg.startsWith('bestmove')) {
        const best = msg.split(' ')[1];
        if (best && best !== '(none)') {
          game.move({ from: best.slice(0, 2), to: best.slice(2, 4), promotion: 'q' });
          selectedSq = null;
          renderBoard();
          updateStatus();
          updateHistory();
        }
        stockfish.onmessage = null;
      }
    };
    stockfish.postMessage('position fen ' + game.fen());
    stockfish.postMessage('go depth 10');
  };

  renderBoard();
  updateHistory();
}