const blessed = require('blessed');
const program = blessed.program();

const directions = {
  right: { x:  1, y:  0 },
  up:    { x:  0, y: -1 },
  left:  { x: -1, y:  0 },
  down:  { x:  0, y:  1 }
};

const width = 40;
const height = 40;
const delay = 100;

let snake, apple, board;

function reset() {
  apple = {x: 20, y: 10};
  board = Array.from({length: height}, () => Array.from({length: width}, () => false));
  snake = {
    positions: [{x: 20, y: 30}, {x: 20, y: 31}, {x: 20, y: 32}],
    direction: directions.up
  };

  snake.positions.forEach((position) => {
    board[position.y][position.x] = true;
  });

  board[apple.y][apple.x] = true;
}

function moveSnake() {
  const oldPosition = snake.positions.pop();
  board[oldPosition.y][oldPosition.x] = false;

  const newPosition = {
    x: snake.positions[0].x + snake.direction.x,
    y: snake.positions[0].y + snake.direction.y
  };

  if (newPosition.x < 0 || newPosition.x >= width
    || newPosition.y < 0 || newPosition.y >= height) {
    reset();
    return;
  }

  const isApple = (newPosition.y == apple.y && newPosition.x == apple.x);
  if (board[newPosition.y][newPosition.x] && !isApple) {
    reset();
    return;
  }

  board[newPosition.y][newPosition.x] = true;
  snake.positions.unshift(newPosition);

  if (isApple) {
    if (snake.positions.length === width * height) {
      reset();
    } else {
      snake.positions.push(oldPosition);
      randomApple();
    }
  }
}

function randomApple() {
  outer: do {
    apple = {
      x: Math.floor(width * Math.random()),
      y: Math.floor(height * Math.random())
    };
    for (let position of snake.positions) {
      if (position.x == snake.x && position.y == snake.y) {
        continue outer;
      }
    }
    board[apple.y][apple.x] = true;
  } while (false);
}

function getBoardString() {
  return board.reduce((str, row) => {
    return str + '█' + row.map((inhabited) => inhabited ? ' █' : '  ').join('') + ' █\n';
  }, '');
}

function loop() {
  moveSnake();

  render();

  setTimeout(loop, delay);
}

function start() {
  program.alternateBuffer();
  program.enableMouse();
  program.hideCursor();
  program.clear();
  program.on('mouse', (data) => {});

  reset();
  loop();
}

function render() {
  program.clear();
  program.move(0, 0);
  program.write(getBoardString());
}

function end() {
  program.clear();
  program.disableMouse();
  program.showCursor();
  program.normalBuffer();
  process.exit(0);
}


// If our box is clicked, change the content.
program.key(Object.keys(directions), (ch, key) => {
  const newDirection = directions[key.name];
  if (!(Math.abs(snake.direction.x) == Math.abs(newDirection.x)
     && Math.abs(snake.direction.y) == Math.abs(newDirection.y))) {
    snake.direction = newDirection;
  }
});

// Quit on Escape, q, or Control-C.
program.key(['escape', 'q', 'C-c'], (ch, key) => {
  end();
});


start();
