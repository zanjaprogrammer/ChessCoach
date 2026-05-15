// Stockfish Worker Wrapper
// Using Stockfish.js from CDN
importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');

const stockfish = STOCKFISH();

stockfish.onmessage = function(message) {
  self.postMessage(message);
};

self.onmessage = function(e) {
  stockfish.postMessage(e.data);
};
