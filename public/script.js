const socket = io();
const boardDiv = document.getElementById('board');
const status = document.getElementById('status');
const resetBtn = document.getElementById('reset');

let symbol = '';
let currentTurn = '';

function renderBoard(board) {
  boardDiv.innerHTML = '';
  board.forEach((cell, index) => {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.textContent = cell || '';
    div.addEventListener('click', () => {
      if (!cell && symbol === currentTurn) {
        socket.emit('makeMove', index);
      }
    });
    boardDiv.appendChild(div);
  });
}

socket.on('symbol', (s) => {
  symbol = s;
  status.textContent = `Eres el jugador ${s}`;
});

socket.on('boardUpdate', ({ board, currentTurn: turn }) => {
  currentTurn = turn;
  renderBoard(board);
  status.textContent = `Turno de ${turn}`;
});

resetBtn.addEventListener('click', () => {
  socket.emit('reset');
});
