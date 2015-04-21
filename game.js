'use strict';

angular.module('myApp', ['ngTouch'])
  .controller('Ctrl', function (
       $window, $scope, $log, $timeout,
      aiService, gameService, scaleBodyService, gameLogic) {
       var moveAudio = new Audio('audio/move.wav');
    moveAudio.load();
    function updateUI(params) {
      $scope.board = params.stateAfterMove.board;
      $scope.delta = params.stateAfterMove.delta;
      if (params.stateAfterMove.delta){
      	$scope.newMove = [params.stateAfterMove.delta.row, params.stateAfterMove.delta.col]
      	}
      if ($scope.board === undefined) {
      	$scope.numOfMoves = 0;
      	$scope.isAiWorking = false;
        $scope.board = [['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
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
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']];
      } else {
        // Only play a sound if there was a move (i.e., state is not empty).
        $log.info(["sound played on Board:", $scope.board]);
        moveAudio.play();
      }
    	$scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
        $scope.turnIndex = params.turnIndexAfterMove;
    	updateAIStatues();
        if ($scope.isYourTurn && params.playersInfo[params.yourPlayerIndex].playerId === '') {
        // Wait 500 milliseconds until animation ends.
        	$log.info("computer turn");
        	$scope.isAiWorking = true;
        	$timeout(sendComputerMove, 600);
      	}
    }

    function sendComputerMove() {
    	$log.info("computer moved");
        var aimove = [];
        if($scope.numOfMoves < 2){
        	aimove = firstAIMoveGenerator();
        }
        else{
        	aimove = aiServiceMakeMove();
        }
        $scope.newMove = aimove;
        gameService.makeMove(gameLogic.createMove($scope.board, aimove[0], aimove[1], $scope.turnIndex));
        aiService.informingComputer(aimove[0], aimove[1], 'white');
        $timeout(updateAIStatues, 500);
        $scope.numOfMoves++;
    }
    function updateAIStatues(){
        $scope.isAiWorking = false;
    }
    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});
    function iniAiService(){
    	aiService.iniComputer();
    }
    iniAiService();
    function aiServiceMakeMove(){
    	return aiService.getMove();
    }
    function firstAIMoveGenerator(){
    	var moves=[
            [6,6],
            [6,7],
            [6,8],
            [7,6],
            [7,7],
            [7,8],
            [8,6],
            [8,7],
            [8,8]
        ];
        while(true){
            var ind=Math.floor(Math.random()*moves.length);
            if($scope.board[moves[ind][0]][moves[ind][1]] === ''){
                return [(moves[ind][0]),(moves[ind][1])];
            }else{
                moves.splice(ind,1);
            }
        }
    }
    $scope.placeDot  = function(str, row, col){
    if(str ===''){
    	return 'img/empty.png';
    	//return 0;
    }
    if(str === 'X'){
    	if(row === $scope.newMove[0] && col === $scope.newMove[1]){
    		return 'img/newblackStone.png';
    	}
    	return 'img/blackStone.png';
    }
    if(str === 'O'){
    	if(row === $scope.newMove[0] && col === $scope.newMove[1]){
    		return 'img/newwhiteStone.png';
    	}
    	return 'img/whiteStone.png'
    }
    }
    $scope.shouldSlowlyAppear = function (row, col) {
      return $scope.delta !== undefined
          && $scope.delta.row === row && $scope.delta.col === col;
    }
    $scope.cellClicked = function (row, col) {
      $log.info(["Clicked on cell:", row, col]);
      if (!$scope.isYourTurn) {
        return;
      }
      try {
        if(!$scope.isAiWorking){
        $scope.isAiWorking = true;
        var move = gameLogic.createMove($scope.board, row, col, $scope.turnIndex);
        $scope.newMove = [row, col];
        $scope.isYourTurn = false; // to prevent making another move
        gameService.makeMove(move);
        $scope.numOfMoves++;
        aiService.informingComputer(row, col, 'black');
        }
        else{
        	return false;
        }
      } catch (e) {
        $log.info(["Cell is already full in position:", row, col]);
        return;
      }
    };
    $scope.onStartCallback = function () {
        $log.info("onStart happened!", arguments);
      };
	scaleBodyService.scaleBody({width: 1200, height: 1200});
    gameService.setGame({
      gameDeveloperEmail: "punk0706@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      //exampleGame: gameLogic.getExampleGame(),
      //riddles: gameLogic.getRiddles(),
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  });
