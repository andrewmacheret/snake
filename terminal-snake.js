const blessed = require('blessed');
const program = blessed.program();

const Snake = require('./snake');

class TerminalSnake extends Snake {

  constructor({width, height, delay}) {
    super({width, height});

    this.delay = delay;
  }

  render() {
    const newBoardStrings = this.board.reduce((array, row) => {
      const rowString = row.map((inhabited) => inhabited ? ' █' : '  ').join('');
      array.push('█' + rowString + ' █');
      return array;
    }, []);
    newBoardStrings.unshift('█' + ' █'.repeat(this.width) + ' █');
    newBoardStrings.push( '█' + ' █'.repeat(this.width) + ' █');

    if (this.lastBoardStrings === undefined) {
      program.clear();
      program.move(0, 0);
      program.write(newBoardStrings.join('\n'));
    } else {
      newBoardStrings.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          const ch = row[x];
          if (this.lastBoardStrings[y][x] !== ch) {
            program.move(x, y);
            program.write(ch);
          }
        }
      });
    }


    this.lastBoardStrings = newBoardStrings;
  }

  loop() {
    try {
      this.moveSnake();

      this.render();
    } catch(ex) {
      this.end(ex);
    }

    setTimeout(this.loop.bind(this), this.delay);
  }

  start() {
    try {
      // Set up basics
      program.alternateBuffer();
      program.enableMouse();
      program.hideCursor();
      program.clear();

      // BUG: We need to define a dummy mouse event to get the keys working properly
      program.on('mouse', (data) => {});

      // On arrow key, change direction
      program.key(Object.keys(this.directions), (ch, key) => {
        this.changeDirection(key.name);
      });

      // Quit on Escape, q, or Control-C.
      program.key(['escape', 'q', 'C-c'], (ch, key) => {
        this.end();
      });

      this.reset();
      this.loop();
    } catch(ex) {
      this.end(ex);
    }
  }

  end(ex) {
    program.clear();
    program.disableMouse();
    program.showCursor();
    program.normalBuffer();
    if (ex) console.error(ex);
    process.exit(ex ? 1 : 0);
  }
}

new TerminalSnake({width: 8, height: 8, delay: 250}).start();
