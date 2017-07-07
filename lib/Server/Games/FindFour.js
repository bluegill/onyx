'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(manager) {
    _classCallCheck(this, _class);

    this.manager = manager;

    this.currentPlayer = 1;

    this.boardMap = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
  }

  _createClass(_class, [{
    key: 'toString',
    value: function toString() {
      var boardMap = '';

      for (var i = 0; i < 7; i++) {
        for (var x = 0; x < 6; x++) {
          boardMap += this.boardMap[x][i] + ',';
        }
      }

      return boardMap.slice(0, -1);
    }
  }, {
    key: 'switchPlayer',
    value: function switchPlayer() {
      if (this.currentPlayer === 1) {
        this.currentPlayer = 2;
      } else {
        this.currentPlayer = 1;
      }
    }
  }, {
    key: 'validPlacement',
    value: function validPlacement(column, row) {
      if (this.boardMap[row][column] !== 0) return false;

      return true;
    }
  }, {
    key: 'isFull',
    value: function isFull() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.boardMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var row = _step.value;

          if (row.includes(0)) return false;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return true;
    }
  }, {
    key: 'determineColumnWin',
    value: function determineColumnWin(column) {
      var streak = 0;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.boardMap[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var row = _step2.value;

          if (row[column] === this.currentPlayer) {
            streak++;

            if (streak === 4) return 1;
          } else {
            streak = 0;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return 3;
    }
  }, {
    key: 'determineVerticalWin',
    value: function determineVerticalWin() {
      var rows = this.boardMap.length;

      for (var column = 0; column < rows; column++) {
        var result = this.determineColumnWin(column);

        if (result === 1) return result;
      }

      return 3;
    }
  }, {
    key: 'determineHorizontalWin',
    value: function determineHorizontalWin() {
      var rows = this.boardMap.length;

      var streak = 0;

      for (var row = 0; row < rows; row++) {
        var columns = this.boardMap[row].length;

        for (var column = 0; column < columns; column++) {
          if (this.boardMap[row][column] === this.currentPlayer) {
            streak++;

            if (streak === 4) return 1;
          } else {
            streak = 0;
          }
        }
      }

      return 3;
    }
  }, {
    key: 'determineDiagonalWin',
    value: function determineDiagonalWin() {
      var rows = this.boardMap.length;

      var streak = 0;

      for (var row = 0; row < rows; row++) {
        var columns = this.boardMap[row].length;

        for (var column = 0; column < columns; column++) {
          if (this.boardMap[row][column] === this.currentPlayer) {
            if (this.boardMap[row + 1] && this.boardMap[row + 1][column + 1] === this.currentPlayer && this.boardMap[row + 2] && this.boardMap[row + 2][column + 2] === this.currentPlayer && this.boardMap[row + 3] && this.boardMap[row + 3][column + 3] === this.currentPlayer) {
              return 1;
            }

            if (this.boardMap[row - 1] && this.boardMap[row - 1][column - 1] === this.currentPlayer && this.boardMap[row - 2] && this.boardMap[row - 2][column - 2] === this.currentPlayer && this.boardMap[row - 3] && this.boardMap[row - 3][column - 3] === this.currentPlayer) {
              return 1;
            }

            if (this.boardMap[row - 1] && this.boardMap[row - 1][column + 1] === this.currentPlayer && this.boardMap[row - 2] && this.boardMap[row - 2][column + 2] === this.currentPlayer && this.boardMap[row - 3] && this.boardMap[row - 3][column + 3] === this.currentPlayer) {
              return 1;
            }
          }
        }
      }

      return 3;
    }
  }, {
    key: 'processBoard',
    value: function processBoard() {
      if (this.isFull()) return 2;

      var horizontalWin = this.determineHorizontalWin();

      if (horizontalWin === 1) return horizontalWin;

      var verticalWin = this.determineVerticalWin();

      if (verticalWin === 1) return verticalWin;

      var diagonalWin = this.determineDiagonalWin();

      if (diagonalWin === 1) return diagonalWin;

      return 0;
    }
  }, {
    key: 'placeChip',
    value: function placeChip(column, row) {
      if (this.validPlacement(column, row)) {
        this.boardMap[row][column] = this.currentPlayer;

        var gameStatus = this.processBoard();

        if (gameStatus === 0) this.switchPlayer();

        return gameStatus;
      } else {
        return -1;
      }
    }
  }]);

  return _class;
}();

exports.default = _class;