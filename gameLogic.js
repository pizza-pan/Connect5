/*jslint devel: true, indent: 2 */
/*jslint white: false */
/*global console */
//I have implemented a simple HTML UI in the test.html and you can test the game logic by actually play the game thru the UI
//The following code was tested and confirmed functionality by pasting and running in google chrome console
'use strict';
angular.module('myApp').service('gameLogic', function() {
function isEqual(object1, object2) {
return angular.equals(object1, object2);
}
function copyObject(object) {
return angular.copy(object);
}
//this method creates an empty board
function createNewBoard(){
	var newBoard = [];
	var i;
	for(i = 0; i < 15; i++) {
		newBoard[newBoard.length] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
	}
	return newBoard;
}
//The following four method take the board, row, col and a coloy(X or O) as input
//Check all four possible directions from a position with a specific color and
//return the longest connecting sequence passing thru the given position for the given color
function checkHorizontal(board, row, col, color){
	var sameColors = [[row, col]];
	var i;
	for(i = 1; i < 15; i++){
		if (col + i <15 && board[row][col + i] === color){
			sameColors[sameColors.length] = [row, col + i];
		}
		else{
			break;
		}
	}
	for(i = 1; i < 15; i++){
		if(col - i >= 0 && board[row][col - i] === color){
			sameColors[sameColors.length] = [row, col - i];
		}
		else{
			break;
		}
	}
	return sameColors;
}
function checkBackSlash(board, row, col, color){
	var sameColors = [[row, col]];
	var i;
	for(i = 1; i < 15; i++){
		if (col + i <15 && row + i < 15 && board[row + i][col + i] === color){
			sameColors[sameColors.length] = [row + i, col + i];
		}
		else{
			break;
		}
	}
	for(i = 1; i < 15; i++){
		if(col - i >= 0 && row - i >= 0 && board[row - i][col - i] === color){
			sameColors[sameColors.length] = [row - i, col - i];
		}
		else{
			break;
		}
	}
	return sameColors;
}
function checkForwardSlash(board, row, col, color){
	var sameColors = [[row, col]];
	var i;
	for(i = 1; i < 15; i++){
		if (col - i >= 0 && row + i < 15 && board[row + i][col - i] === color){
			sameColors[sameColors.length] = [row + i, col - i];
		}
		else{
			break;
		}
	}
	for(i = 1; i < 15; i++){
		if(col + i < 15  && row - i >= 0 && board[row - i][col + i] === color){
			sameColors[sameColors.length] = [row - i, col + i];
		}
		else{
			break;
		}
	}
	return sameColors;
}
function checkVertical(board, row, col, color){
	var sameColors = [[row, col]];
	var i;
	for(i = 1; i < 15; i++){
		if (row + i <15 && board[row + i][col] === color){
			sameColors[sameColors.length] = [row + i, col];
		}
		else{
			break;
		}
	}
	for(i = 1; i < 15; i++){
		if(row - i >= 0 && board[row - i][col] === color){
			sameColors[sameColors.length] = [row - i, col];
		}
		else{
			break;
		}
	}
	return sameColors;
}


/** Return the winner (either 'X' or 'O') or '' if there is no winner. */
function getWinner(winningSequence){
	if(winningSequence.length > 0){
		return winningSequence[0];
	}
	else{
		return '';
	}
}
//This method check the four directions to see if any has a connecting sequence that has a length
//exactly equal to five, if yes, return the winning color and sequence
function getWinningSequence(board, row, col, color) {
	var winningSeuqnece = [];
if(checkHorizontal(board, row, col, color).length === 5)
{
	winningSeuqnece =[color, checkHorizontal(board, row, col, color)];
	return winningSeuqnece;
}
if(checkVertical(board, row, col, color).length === 5)
{
	winningSeuqnece =[color, checkHorizontal(board, row, col, color)];
	return winningSeuqnece;
}
if(checkBackSlash(board, row, col, color).length === 5)
{
	winningSeuqnece =[color, checkHorizontal(board, row, col, color)];
	return winningSeuqnece;
}
if(checkForwardSlash(board, row, col, color).length === 5)
{
	winningSeuqnece =[color, checkHorizontal(board, row, col, color)];
	return winningSeuqnece;
}
return winningSeuqnece;
}
/** Returns true if the game ended in a tie because there are no empty cells. */
function isTie(board) {
var i, j;
for (i = 0; i < 15; i++) {
for (j = 0; j < 15; j++) {
if (board[i][j] === '') {
// If there is an empty cell then we do not have a tie.
return false;
}
}
}
// No empty cells --> tie!
return true;
}
//The following two method:createMove and isMoveOk reused large portion of the code
//from the Professor's TicTacToe sample
/** 
   * Returns the move that should be performed when player 
   * with index turnIndexBeforeMove makes a move in cell row X col. 
   */
function createMove(board, row, col, turnIndexBeforeMove) {
	if (board === undefined) {
	      // Initially (at the beginning of the match), the board in state is undefined.
	      board = createNewBoard();
	    }
	if (board[row][col] !== '') {
	      throw new Error("One can only make a move in an empty position!");
	    }
var boardAfterMove = copyObject(board);
var turnColor = turnIndexBeforeMove === 0 ? 'X' : 'O';
boardAfterMove[row][col] = turnColor;
var winner = getWinner(getWinningSequence(boardAfterMove, row, col, turnColor));
var firstOperation;
if (winner !== '' || isTie(boardAfterMove)) {
// Game over.
firstOperation = {endMatch: {endMatchScores: 
(winner === 'X' ? [1, 0] : (winner === 'O' ? [0, 1] : [0, 0]))}};
} else {
// Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
}
return [firstOperation,
{set: {key: 'board', value: boardAfterMove}},
{set: {key: 'delta', value: {row: row, col: col}}}];
}
function isMoveOk(params) {
var move = params.move; 
var turnIndexBeforeMove = params.turnIndexBeforeMove; 
var stateBeforeMove = params.stateBeforeMove; 
// The state and turn after move are not needed in TicTacToe (or in any game where all state is public).
//var turnIndexAfterMove = params.turnIndexAfterMove; 
//var stateAfterMove = params.stateAfterMove; 
// We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
// to verify that move is legal.
try {
// Example move:
// [{setTurn: {turnIndex : 1},
//  {set: {key: 'board', value: [['X', '', ''], ['', '', ''], ['', '', '']]}},
//  {set: {key: 'delta', value: {row: 0, col: 0}}}]
var deltaValue = move[2].set.value;
var row = deltaValue.row;
var col = deltaValue.col;
var board = stateBeforeMove.board;
var expectedMove = createMove(board, row, col, turnIndexBeforeMove);
if (!isEqual(move, expectedMove)) {
return false;
}
} catch (e) {
// if there are any exceptions then the move is illegal
return false;
}
return true;
}
function getExampleMoves(initialTurnIndex, initialState, arrayOfRowColComment) {
    var exampleMoves = [];
    var state = initialState;
    var turnIndex = initialTurnIndex;
    for (var i = 0; i < arrayOfRowColComment.length; i++) {
      var rowColComment = arrayOfRowColComment[i];
      var move = createMove(state.board, rowColComment.row, rowColComment.col, turnIndex);
      var stateAfterMove = {board : move[1].set.value, delta: move[2].set.value};
      exampleMoves.push({
        stateBeforeMove: state,
        stateAfterMove: stateAfterMove,
        turnIndexBeforeMove: turnIndex,
        turnIndexAfterMove: 1 - turnIndex,
        move: move,
        comment: {en: rowColComment.comment}});
        
      state = stateAfterMove;
      turnIndex = 1 - turnIndex;
    }
    return exampleMoves;
  }
function getRiddles() {
    return [
      getExampleMoves(0,
    	{board:
		    	  [['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', 'X', 'X', 'X', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', 'O', 'O', 'O', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']], delta: {row: 3, col: 4}},
        [
        {row: 2, col: 5, comment: "Find the position for X where he could win in his next turn by having 5 connected Xs in one direction"},
        {row: 2, col: 1, comment: "O played to try to block X"},
        {row: 2, col: 6, comment: "X wins by having five Xs in one direction."}
      ]),
      getExampleMoves(1,
    		  {board:
		    	  [['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', 'X', 'X', 'X', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', 'O', 'O', 'O', 'X', '', '', '', '', '', '', '', ''],
		           ['', '', '', 'O', '', 'X', 'X', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', 'O', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']], delta: {row: 3, col: 4}},
        [
        {row: 3, col: 2, comment: "O places here will lead to winning in 2 more rounds"},
        {row: 3, col: 1, comment: "X places here to avoid O from winning"},
        {row: 2, col: 1, comment: "O will win next round."},
        {row: 1, col: 2, comment: "X played to try to block O"},
        {row: 6, col: 5, comment: "O wins by having five Os in one direction."}
      ])
    ];
  }

  function getExampleGame() {
    return getExampleMoves(0, {}, [
      {row: 6, col: 6, comment: "X starts the game by placing near the middle of the board"},
      {row: 7, col: 6, comment: "O places next to the X's first move"},
      {row: 6, col: 7, comment: "X plces next to its first move"},
      {row: 7, col: 7, comment: "O places next to its original move"},
      {row: 8, col: 9, comment: "X places on 8, 9"},
      {row: 7, col: 8, comment: "O forms an open three on 7, 8"},
      {row: 7, col: 9, comment: "X blocks O by putting on 7, 9"},
      {row: 8, col: 6, comment: "O places on 8, 6"},
      {row: 6, col: 9, comment: "X places on 6,9 and forming two open threes, X will win"},
      {row: 6, col: 8, comment: "O trying to block X by placing on 6,8"},
      {row: 5, col: 9, comment: "X places on 5,9, forming an open four"},
      {row: 4, col: 9, comment: "O tring to block X by putting on 4, 9"},
      {row: 9, col: 9, comment: "X wins by placing at 9, 9"}
    ]);
  }
  this.createMove = createMove;
  this.isMoveOk = isMoveOk;
  this.getExampleGame = getExampleGame;
  this.getRiddles = getRiddles;
});
