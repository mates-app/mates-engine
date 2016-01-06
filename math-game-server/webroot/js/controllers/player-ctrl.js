define(["angular", 
        "js/controllers", 
        'js/services/game-services', 
        'js/services/game-timer',
        'js/services/game-levels',
        'js/services/game-tooltips',        
        'js/services/game-scoring',
        'js/services/game-instance'],
		function(angular, controllers){
	
	controllers.controller('playerCtrl', 
        ['$scope', 'game','$location', '$interval', '$log','$rootScope', '$timeout', '$sce', 
        'gameTimer', 'gameLevels', 'gameTooltips', 'gameInstance', 'gameScoring',
        function(
            $scope, game, $location, $interval, $log, $rootScope, $timeout, $sce, 
            gameTimer, gameLevels, gameTooltips, gameInstance, gameScoring){

        $log.info("playerCtrl");

        $scope.gameTimer = gameTimer;
        $scope.gameLevels = gameLevels;
        $scope.gameInstance = gameInstance;

    	$scope.instances = [];
    	$scope.player = { name: ""};
        $scope.problemStatus = gameInstance.status.problemStatus;

        $scope.$watch('gameInstance.instance.status', function(newValue, oldValue) {
            if(newValue == 'GAME_OVER' || newValue == 'NOT_SELECTED'){
                $rootScope.showNav = true;
            }else{
                $rootScope.showNav = false;
            }
        });
        

        $scope.timeCallback = function(gameTime, problemTime){
            if(gameTime <= 0){
                $log.info("GAME OVER");
                gameTimer.pause(0);
                gameInstance.instance.status = "GAME_OVER";
            }
        }

        $scope.onPauseCallback = function(answer){               
            gameTooltips.showHideTooltips(true);
            var problemStatus = gameLevels.checkAnswer(answer);

            if(problemStatus.isCorrect && problemStatus.isProblemEnds){
                gameTooltips.setResponseLevel(gameScoring.update(true));
            }else if(!problemStatus.isCorrect){
                gameTooltips.setResponseLevel(gameScoring.update(false));
            }

            $scope.sendScoring();
            gameInstance.status.problemStatus = "SHOW_SOLUTION";

            $timeout(function(){
                gameLevels.next();
                gameTimer.problemTime.reset();
                gameTooltips.showHideTooltips(false);
                gameInstance.status.problemStatus = "SHOW_PROBLEM";    
            }, 1500);

        }

    	$scope.response = function(answer){
            gameTimer.pause(1700, $scope.onPauseCallback(answer));    		 
    	};

        $scope.sendScoring = function(){
            $log.info("sending scoring . . .");
            game.player.one.put(gameInstance.status).then(function(response){
                $log.info("scoring sended");
                $log.info(response);
            });
        };

        $scope.joinGame = function(name, instance){
            
            $log.info("join game . . ." );
            $log.info(name);
            $log.info(instance);

            gameInstance.join(name, instance, function(){
                gameLevels.order.reset();
                gameLevels.next();
                gameTimer.start($scope.timeCallback);
            });
        }

        game.instance.all.get().then(function(response){
            console.log(response);
            $scope.instances = response;
        });

		
    }]);
	
});
