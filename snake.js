class Snake {
  constructor({width, height}) {
    if (height < 8 || width < 8) {
      throw new Error(`Dimensions too small (width=${width}, height=${height})! Need more width and height!`);
    }

    this.width = width;
    this.height = height;
    
    this.directions = {
      right: { x:  1, y:  0 },
      up:    { x:  0, y: -1 },
      left:  { x: -1, y:  0 },
      down:  { x:  0, y:  1 }
    };
  }

  reset() {
    this.apple = {x: Math.floor(this.width/2), y: Math.floor(this.height / 4) - 1};
    this.board = Array.from({length: this.height}, () => Array.from({length: this.width}, () => false));
    this.snake = {
      positions: [
        {x: Math.floor(this.width/2), y: Math.floor(3 * this.height / 4) - 1},
        {x: Math.floor(this.width/2), y: Math.floor(3 * this.height / 4) + 0},
        {x: Math.floor(this.width/2), y: Math.floor(3 * this.height / 4) + 1}
      ],
      direction: this.directions.up
    };

    this.snake.positions.forEach((position) => {
      this.board[position.y][position.x] = true;
    });

    this.board[this.apple.y][this.apple.x] = true;
  }

  moveSnake() {
    const oldPosition = this.snake.positions.pop();
    this.board[oldPosition.y][oldPosition.x] = false;

    const newPosition = {
      x: this.snake.positions[0].x + this.snake.direction.x,
      y: this.snake.positions[0].y + this.snake.direction.y
    };

    if (newPosition.x < 0 || newPosition.x >= this.width
      || newPosition.y < 0 || newPosition.y >= this.height) {
      this.reset();
      return;
    }

    const isApple = (newPosition.y == this.apple.y && newPosition.x == this.apple.x);
    if (this.board[newPosition.y][newPosition.x] && !isApple) {
      this.reset();
      return;
    }

    this.board[newPosition.y][newPosition.x] = true;
    this.snake.positions.unshift(newPosition);

    if (isApple) {
      if (this.snake.positions.length === this.width * this.height) {
        this.reset();
      } else {
        this.snake.positions.push(oldPosition);
        this.randomApple();
      }
    }
  }

  randomApple() {
    outer: do {
      this.apple = {
        x: Math.floor(this.width * Math.random()),
        y: Math.floor(this.height * Math.random())
      };
      for (let position of this.snake.positions) {
        if (position.x == this.snake.direction.x && position.y == this.snake.direction.y) {
          continue outer;
        }
      }
      this.board[this.apple.y][this.apple.x] = true;
    } while (false);
  }

  changeDirection(directionName) {
    const newDirection = this.directions[directionName];
    
    /*    
    if (Math.abs(this.snake.direction.x) == Math.abs(newDirection.x) &&
        Math.abs(this.snake.direction.y) == Math.abs(newDirection.y)) {
      return;
    }
    */

    const newPosition = {
      x: this.snake.positions[0].x + newDirection.x,
      y: this.snake.positions[0].y + newDirection.y
    };
    if (newPosition.x === this.snake.positions[1].x &&
        newPosition.y === this.snake.positions[1].y) {
      return;
    }

    this.snake.direction = newDirection;
  }
}

module.exports = Snake;
