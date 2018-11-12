/**
 ** Chess piece.
 **/

class ChessPiece {
  constructor(root, mesh, type, colour, square) {
    this.root = root;
    this.mesh = mesh;
    this.type = type;
    this.colour = colour;
    this.dir = this.colour == 'white' ? 1 : -1;
    this.startingSquare = square;
    this.square = square;
    this.position = new THREE.Vector3();
    this.moves = 0;
    this.adjust = 1;
    this.bbox = new THREE.Box3().setFromObject(this.mesh);
    this.reset();
  }

  reset() {
    this.moves = 0;
    this.mesh.visible = true;
    this.square = this.startingSquare;
    this.setPosition();
    this.mesh.position.x = this.position.x;
    this.mesh.position.z = this.position.z;
    this.mesh.position.y = (this.bbox.max.y - this.bbox.min.y) / 2;
  }

  setPosition() {
    // square to world position
    this.column = this.square % 8;
    this.row = (this.square - this.column) / 8;
    this.position.z = (this.column - 3.5) * -2;
    this.position.x = -((this.row - 3.5) * 2);
  }

  hide() {
    this.mesh.visible = false;
  }

  move() {
    const square = this.potentialMoves[Math.floor(Math.random() * this.potentialMoves.length)];

    // capture piece
    if (this.root.board[square] != undefined) {
      const piece = this.root.board[square];
      piece.hide();
      this.root.captured.push(piece);
      this.root.board[square] = undefined;
    }

    // move to new square
    this.root.board[square] = this;
    this.root.board[this.square] = undefined;
    this.square = square;
    this.setPosition();

    // increment moves
    this.moves += 1;
  }

  pawnMoves() {
    // forward moves
    const s1 = this.getSquare(this.row + this.dir, this.column);
    if (this.isValidSquare(s1) && this.isSquareEmpty(s1)) {
      this.potentialMoves.push(s1);
      if (this.moves == 0) {
        const s2 = this.getSquare(this.row + this.dir * 2, this.column);
        if (this.isValidSquare(s2) && this.isSquareEmpty(s2)) {
          this.potentialMoves.push(s2);
        }
      }
    }

    // captures
    const caps = [this.getSquare(this.row + this.dir, this.column + 1), this.getSquare(this.row + this.dir, this.column - 1)];
    caps.forEach(s => {
      if (this.isValidSquare(s) && !this.isSquareEmpty(s) && this.isSquareEnemy(s)) {
        this.potentialMoves.push(s);
      }
    });
  }

  knightMoves() {
    const hops = [[2, 1], [2, -1], [1, 2], [1, -2], [-2, 1], [-2, -1], [-1, 2], [-1, -2]];
    hops.forEach(hop => {
      const s = this.getSquare(this.row + hop[0], this.column + hop[1]);
      if (this.isValidSquare(s) && (this.isSquareEmpty(s) || this.isSquareEnemy(s))) {
        this.potentialMoves.push(s);
      }
    });
  }

  straightMoves() {
    const rook = [[0, 1], [0, -1], [-1, 0], [1, 0]];
    const bishop = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
    const dir = this.type == 'bishop' ? bishop : this.type == 'rook' ? rook : rook.concat(bishop);
    const max = this.type == 'king' ? 1 : 8;

    dir.forEach(d => {
      let r = this.row + d[0];
      let c = this.column + d[1];
      let s = this.getSquare(r, c);
      let m = 0;

      // check lines
      while (this.isValidSquare(s) && this.isSquareEmpty(s) && m < max) {
        this.potentialMoves.push(s);
        r += d[0];
        c += d[1];
        s = this.getSquare(r, c);
        m += 1;
      }

      // check for enemy blocking
      if (this.isValidSquare(s) && !this.isSquareEmpty(s) && this.isSquareEnemy(s)) {
        this.potentialMoves.push(s);
      }
    });
  }

  canMove() {
    this.potentialMoves = [];
    if (this.type == 'pawn') {
      this.pawnMoves();
    } else if (this.type == 'knight') {
      this.knightMoves();
    } else {
      this.straightMoves();
    }
    return this.potentialMoves.length != 0;
  }

  getSquare(row, column) {
    if (row < 0 || row > 7 || column < 0 || column > 7) {
      return -1;
    } else {
      return row * 8 + column;
    }
  }

  isSquareEnemy(square) {
    return this.root.board[square].colour != this.colour;
  }

  isSquareEmpty(square) {
    return this.root.board[square] === undefined;
  }

  isValidSquare(s) {
    return s >= 0 && s < 64;
  }

  update(delta) {
    // tween
    this.mesh.position.x += (this.position.x - this.mesh.position.x) * this.adjust;
    this.mesh.position.z += (this.position.z - this.mesh.position.z) * this.adjust;
  }
}

export { ChessPiece };
