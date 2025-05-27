const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let players = {};
let currentTurn = 'X';
let board = Array(9).fill(null);

io.on('connection', (socket) => {
  console.log(`Jugador conectado: ${socket.id}`);

  // Asignar símbolo
  const symbol = Object.values(players).includes('X') ? 'O' : 'X';
  players[socket.id] = symbol;
  socket.emit('symbol', symbol);
  socket.emit('boardUpdate', { board, currentTurn });

  socket.on('makeMove', (index) => {
    if (board[index] === null && players[socket.id] === currentTurn) {
      board[index] = currentTurn;
      currentTurn = currentTurn === 'X' ? 'O' : 'X';
      io.emit('boardUpdate', { board, currentTurn });
    }
  });

  socket.on('reset', () => {
    board = Array(9).fill(null);
    currentTurn = 'X';
    io.emit('boardUpdate', { board, currentTurn });
  });

  socket.on('disconnect', () => {
    console.log(`Jugador desconectado: ${socket.id}`);
    delete players[socket.id];
    board = Array(9).fill(null);
    currentTurn = 'X';
    io.emit('boardUpdate', { board, currentTurn });
  });
});

server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
