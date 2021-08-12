const gameboard = (function() {
  let board = [...document.querySelectorAll('[data-value]')];
  let msg = document.querySelector('#msg');
  let combos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], 
                [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  let moveX = true;

  const spots = function() {
    return board.filter(sq => !sq.dataset.value);
  };

  const clear = function() {
    board.forEach(sq => {
      sq.dataset.value = ''
      sq.removeEventListener('click', playerAI);
      sq.removeEventListener('click', player2);
    });
    msg.textContent = '';
    moveX = true;
  };

  const win = function(sign) {
    let values = [];
    board.forEach(sq => values.push(sq.dataset.value));
    return combos.some(combo => {
      return combo.every(i => {
        return values[i] === sign;
      });
    });
  };

  const tie = function() {
    return gameboard.spots().length === 0;
  };

  const check = function() {
    if (win('x')) {
      msg.textContent = 'X Wins!';
      return true;
    } else if (win('o')) {
      msg.textContent = 'O Wins!';
      return true;
    } else if (tie()) {
      msg.textContent = 'Draw!';
      return true;
    } else {
      return false;
    }
  };
  
  const playerAI = function(e) {
    if (!e.target.dataset.value && !check()) {
      player('x').mark(e.target);
      player('o').random();
    }
  };

  const player2 = function(e) {
    if (!check()) {
      if (moveX) {
        player('x').mark(e.target);
      } else {
        player('o').mark(e.target);
      }
      moveX = !moveX;
    }
  };

  const play = function(handler) {
    board.forEach(sq => {
      if (!check()) {
        sq.addEventListener('click', handler, { once: true });
      } 
    });
  };

  const start = function(ai) {
    clear();
    if (ai) {
      play(playerAI);
    } else {
      play(player2);
    }
  };

  return { spots, check, start }
})();

const player = function(sign) {
  const mark = function(sq) {
    if (sq && !gameboard.check()) sq.dataset.value = sign;
    gameboard.check();
  };

  const random = function() {
    let board = gameboard.spots();
    let num = Math.floor(Math.random() * board.length);
    mark(board[num]);
  };

  return { mark, random }
};

const select = (function() {
  let ai = document.querySelector('#ai-btn');
  let p2 = document.querySelector('#p2-btn');

  ai.addEventListener('click', () => {
    gameboard.start(true);
  });

  p2.addEventListener('click', () => {
    gameboard.start(false);
  });
})();