module.exports = class FindFour {
  constructor(manager){
    this.manager = manager;

    this.currentPlayer = 1;

    this.boardMap = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];
  }

  toString(){
    let boardMap = '';

    for(let i = 0; i < 7; i++){
      for(let x = 0; x < 6; x++){
        boardMap += this.boardMap[x][i] + ',';
      }
    }

    return boardMap.slice(0, -1);
    /// TODO: fix board map for spectators
  }

  switchPlayer(){
    if(this.currentPlayer == 1){
      return this.currentPlayer = 2;
    }
    this.currentPlayer = 1;
  }

  validPlacement(column, row){
    if(this.boardMap[row][column] !== 0){
      return false;
    }

    return true;
  }

  isFull(){
    for(const row of this.boardMap){
      if(row.includes(0)) return false;
    }
    return true;
  }

  determineColumnWin(column){
    let streak = 0;

    for(const row of this.boardMap){
      if(row[column] == this.currentPlayer){
        streak ++;

        if(streak === 4){
          return 1;
        }
      } else {
        streak = 0;
      }
    }

    return 3;
  }

  determineVerticalWin(){
    const rows = this.boardMap.length;

    for(let column = 0; column < rows; column++){
      const result = this.determineColumnWin(column);

      if(result === 1){
        return result;
      }
    }

    return 3;
  }

  determineHorizontalWin(){
    const rows = this.boardMap.length;

    let streak = 0;

    for(let row = 0; row < rows; row++){
      const columns = this.boardMap[row].length;

      for(let column = 0; column < columns; column++){
        if(this.boardMap[row][column] === this.currentPlayer){
          streak ++;

          if(streak === 4){
            return 1;
          }
        } else {
          streak = 0;
        }
      }
    }

    return 3;
  }

  determineDiagonalWin(){
    const rows = this.boardMap.length;

    let streak = 0;

    for(let row = 0; row < rows; row++){
      const columns = this.boardMap[row].length;

      for(let column = 0; column < columns; column++){
        if(this.boardMap[row][column] === this.currentPlayer){
          if(this.boardMap[row + 1] && this.boardMap[row + 1][column + 1] === this.currentPlayer &&
             this.boardMap[row + 2] && this.boardMap[row + 2][column + 2] === this.currentPlayer &&
             this.boardMap[row + 3] && this.boardMap[row + 3][column + 3] === this.currentPlayer){
            return 1;
          }

          if(this.boardMap[row - 1] && this.boardMap[row - 1][column - 1] === this.currentPlayer &&
             this.boardMap[row - 2] && this.boardMap[row - 2][column - 2] === this.currentPlayer &&
             this.boardMap[row - 3] && this.boardMap[row - 3][column - 3] === this.currentPlayer){
            return 1;
          }

          if(this.boardMap[row - 1] && this.boardMap[row - 1][column + 1] === this.currentPlayer &&
             this.boardMap[row - 2] && this.boardMap[row - 2][column + 2] === this.currentPlayer &&
             this.boardMap[row - 3] && this.boardMap[row - 3][column + 3] === this.currentPlayer){
            return 1;
          }
        }
      }
    }

    return 3;
  }

  processBoard(){
    if(this.isFull()) return 2;

    const horizontalWin = this.determineHorizontalWin();

    if(horizontalWin === 1){
      return horizontalWin;
    }

    const verticalWin = this.determineVerticalWin();

    if(verticalWin === 1){
      return verticalWin;
    }

    const diagonalWin = this.determineDiagonalWin();

    if(diagonalWin === 1){
      return diagonalWin;
    }

    return 0;
  }

  placeChip(column, row){
    if(this.validPlacement(column, row)){
      this.boardMap[row][column] = this.currentPlayer;

      const gameStatus = this.processBoard();
      if(gameStatus === 0) this.switchPlayer();

      return gameStatus;
    } else {
      return -1;
    }
  }
}