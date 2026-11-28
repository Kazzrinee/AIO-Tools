// catur.js — Game Catur (AI, Lokal, P2P) + Asisten Stockfish
import { setResult, toast } from './util.js';

const CHESS_JS = 'https://cdn.jsdelivr.net/npm/chess.js@0.10.3/chess.min.js';
const STOCKFISH_JS = 'https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js';

export async function caturGame(el) {
  el.innerHTML = `<div class="result">Memuat library Catur...</div>`;
  
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
      .chess-board { display: grid; grid-template-columns: repeat(8, 1fr); width: 100%; max-width: 400px; margin: 0 auto; border: 2px solid var(--border); border-radius: 4px; overflow: hidden; }
      .chess-sq { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 32px; cursor: pointer; user-select: none; transition: background 0.1s; }
      .chess-sq.light { background: #EBE4D4; color: #14110C; }
      .chess-sq.dark { background: #9A4A28; color: #EBE4D4; }
      .chess-sq.selected { background: var(--accent) !important; color: var(--accent-ink) !important; }
      .chess-sq.valid { position: relative; }
      .chess-sq.valid::after { content: ''; position: absolute; width: 10px; height: 10px; background: rgba(0,0,0,0.3); border-radius: 50%; }
      .chess-controls { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 16px; }
    </style>
    <div id="app-container">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <button class="btn btn-sm" id="btn-mode-ai">Lawan AI</button>
        <button class="btn btn-sm" id="btn-mode-p2p">Mabar P2P</button>
        <button class="btn btn-sm" id="btn-hint" style="background:var(--cat-ai); color:#fff;">Tanya AI (Cheat)</button>
      </div>
      <div id="p2p-setup" style="display:none; background:var(--surface-2); padding:12px; border-radius:4px; margin-bottom:12px;">
        <div style="display:flex; gap:8px;">
          <button class="btn btn-sm" id="p2p-host">Host</button>
          <input type="text" id="p2p-offer" placeholder="Offer..." readonly style="flex:1; font-size:10px;">
          <button class="btn btn-sm" id="p2p-join">Join</button>
        </div>
        <input type="text" id="p2p-answer" placeholder="Paste Answer disini..." style="width:100%; margin-top:8px; font-size:10px;">
      </div>
      <div class="chess-board" id="board"></div>
      <div id="status" style="text-align:center; font-weight:bold; margin-top:12px;">Giliran: Putih</div>
    </div>
  `;

  const game = new Chess();
  const boardEl = el.querySelector('#board');
  const statusEl = el.querySelector('#status');
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
      statusEl.textContent = `Giliran: ${game.turn() === 'w' ? 'Putih' : 'Hitam'}`;
    };
  };

  // UI P2P Logic
  el.querySelector('#btn-mode-p2p').onclick = () => el.querySelector('#p2p-setup').style.display = 'block';
  el.querySelector('#btn-mode-ai').onclick = () => { mode = 'ai'; toast('Mode Lawan AI Aktif (Putih = Anda)'); };
  
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

  // Fungsi Render Papan
  const renderBoard = () => {
    boardEl.innerHTML = '';
    const board = game.board(); // 2D array
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        const sq = document.createElement('div');
        const isLight = (r + c) % 2 === 0;
        sq.className = `chess-sq ${isLight ? 'light' : 'dark'}`;
        const coord = String.fromCharCode(97 + c) + (8 - r); // e.g. "e4"
        sq.dataset.sq = coord;
        
        if (piece) {
          const unicode = {
            p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
            P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
          };
          sq.textContent = unicode[piece.color === 'w' ? piece.type.toUpperCase() : piece.type];
        }

        if (selectedSq === coord) sq.classList.add('selected');
        if (selectedSq && game.moves({ square: selectedSq, verbose: true }).some(m => m.to === coord)) {
          sq.classList.add('valid');
        }

        sq.onclick = () => handleSquareClick(coord);
        boardEl.appendChild(sq);
      }
    }
  };

  // Handle Klik
  const handleSquareClick = (coord) => {
    if (game.game_over()) return toast('Permainan Selesai!');
    
    if (selectedSq) {
      const move = game.move({ from: selectedSq, to: coord, promotion: 'q' });
      if (move) {
        if (mode === 'p2p' && dc && dc.readyState === 'open') dc.send(JSON.stringify({ from: move.from, to: move.to, promotion: 'q' }));
        selectedSq = null;
        renderBoard();
        statusEl.textContent = `Giliran: ${game.turn() === 'w' ? 'Putih' : 'Hitam'}`;
        
        if (game.in_checkmate()) statusEl.textContent = `SKAKMAT! ${game.turn() === 'w' ? 'Hitam' : 'Putih'} Menang!`;
        else if (game.in_check()) statusEl.textContent += ' (SKAK)';

        if (mode === 'ai' && game.turn() === 'b') {
          setTimeout(makeAIMove, 500);
        }
        return;
      }
    }
    
    // Pilih bidak
    const piece = game.get(coord);
    if (piece && piece.color === game.turn()) {
      selectedSq = coord;
      renderBoard();
    } else {
      selectedSq = null;
      renderBoard();
    }
  };

  // AI Stockfish (Cheat & Lawan)
  const initStockfish = async () => {
    if (stockfish) return;
    toast('Memuat Mesin Catur AI...');
    stockfish = new Worker(STOCKFISH_JS);
    stockfish.postMessage('uci');
  };

  el.querySelector('#btn-hint').onclick = async () => {
    if (!stockfish) await initStockfish();
    toast('Menghitung langkah terbaik...');
    stockfish.onmessage = (e) => {
      if (e.data.startsWith('bestmove')) {
        const best = e.data.split(' ')[1];
        const from = best.slice(0, 2);
        const to = best.slice(2, 4);
        selectedSq = from;
        renderBoard();
        toast(`Saran AI: Pindahkan dari ${from} ke ${to}`);
        stockfish.onmessage = null; // Reset
      }
    };
    stockfish.postMessage(`position fen ${game.fen()}`);
    stockfish.postMessage('go depth 10');
  };

  const makeAIMove = () => {
    if (!stockfish) { initStockfish().then(makeAIMove); return; }
    stockfish.onmessage = (e) => {
      if (e.data.startsWith('bestmove')) {
        const best = e.data.split(' ')[1];
        game.move({ from: best.slice(0, 2), to: best.slice(2, 4), promotion: 'q' });
        renderBoard();
        statusEl.textContent = 'Giliran: Putih';
        stockfish.onmessage = null;
      }
    };
    stockfish.postMessage(`position fen ${game.fen()}`);
    stockfish.postMessage('go depth 10');
  };

  renderBoard();
}