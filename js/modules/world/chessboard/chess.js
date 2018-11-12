/**
 ** Automated chess board.
 **/

import { ChessPiece } from './chess_piece';

class Chess {
  constructor(root) {
    this.root = root;
    this.moves = 0;
    this.movesToReset = 128;
    this.turn = 'white';
    this.board = new Array(64);
    this.pieces = [];
    this.captured = [];
    this.age = 0;
    this.threshold = 0.0;
    this.group = new THREE.Group();
  }

  init(obj) {
    obj.children.forEach(child => {
      if (child.name.indexOf('Cube') != -1) {
        // board
        const board = child.clone();
        this.group.add(board);
      } else {
        // piece
        const colour = child.name.indexOf('white') != -1 ? 'white' : 'black';
        const index = colour == 'white' ? 0 : 63;
        const dir = colour == 'white' ? 1 : -1;
        const type = child.name.replace('white_', '').replace('black_', '');

        // clone pieces and place on board
        if (type == 'pawn') {
          for (var i=0; i<8; ++i) {
            const mesh = child.clone();
            const square = index + 8 * dir + i * dir;
            this.board[square] = new ChessPiece(this, mesh, type, colour, square);
            this.group.add(mesh);
          }
        } else if (type == 'rook' || type == 'knight' || type == 'bishop') {
          const mesh1 = child.clone();
          const mesh2 = child.clone();
          const offset = type == 'rook' ? 0 : type == 'knight' ? 1 : 2;
          const square1 = index + offset * dir;
          const square2 = index + (7 - offset) * dir;
          this.board[square1] = new ChessPiece(this, mesh1, type, colour, square1);
          this.board[square2] = new ChessPiece(this, mesh2, type, colour, square2);
          this.group.add(mesh1, mesh2);
        } else if (type == 'queen' || type == 'king') {
          const mesh = child.clone();
          const square = index + (type == 'queen' ? 3 : 4) * dir;
          this.board[square] = new ChessPiece(this, mesh, type, colour, square);
          this.group.add(mesh);
        }
      }
    });

    this.board.forEach(piece => {
      this.pieces.push(piece);
    });

    this.root.scene.add(this.group);
  }

  reset(rotation) {
    this.moves = 0;
    this.turn = 'white';

    // cache all remaining pieces
    this.board.forEach(p => {
      if (p) {
        this.captured.push(p);
        this.board[p.square] = undefined;
      }
    });

    // replace piece on board
    this.captured.forEach(piece => {
      piece.reset();
      this.board[piece.square] = piece;
    });

    // clear cache
    this.captured = [];

    if (rotation) {
      this.group.rotation.y = 0;
    }
  }

  update(delta) {
    this.age += delta;

    if (this.age > this.threshold) {
      const canMove = [];
      this.board.forEach(p => {
        if (p != undefined && p.colour == this.turn && p.canMove()) {
          canMove.push(p);
        }
      });

      // move random piece
      if (canMove.length) {
        const index = Math.floor(Math.random() * canMove.length);
        canMove[index].move();
      }

      // toggle
      this.turn = this.turn == 'white' ? 'black' : 'white';
      this.age -= this.threshold;

      // reset
      this.moves += 1;
      if (this.moves > this.movesToReset) {
        this.reset();
      }
    }

    // animate pieces
    this.pieces.forEach(piece => { piece.update(delta); });

    // animate board
    this.group.rotation.y += delta * Math.PI / 8;
  }
}

export { Chess };
