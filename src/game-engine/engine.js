    // Main game loop
    const gameLoop = (players,games,queue)=>{
        const gameConfig = require('./gameConfig');
        const {eventEmitter} = require('../../config/appConfig');
        // Log function
        const chalk = require("chalk");
        const log = (string) =>
        console.log(
                    `${chalk.bold.underline.red(
                    `GAME [${players.size}][${queue.size}][${games.size}]`
                    )} ${chalk.yellow("»")} ${chalk.yellow(string)}`
            );
        const Game = require('./gameControllers/Game');
        // Constants
        const TICKRATE = gameConfig.TICKRATE;
        setInterval(() => {
            // If the queue has more than two players
            if (queue.size >= 2) {
            // Remove two players from the front of the queue
            const player1 = queue.dequeue();
            const player2 = queue.dequeue();
            // player1.socket.emit('opponent-data', player2.socket.user);
            // player2.socket.emit('opponent-data', player1.socket.user);
            // Create a new game with the two players and add to games
            const game = new Game(player1, player2);
            games.set(game.id, game);
            setTimeout(()=>{
                log(`game#${game.id} has started - ${games.size} games(s) in progress`);
                // Send starting data to the two players
                //eventEmitter.emit('start-timer',game);
                player1.socket.emit('game-start', game.startData(player1));
                player2.socket.emit('game-start', game.startData(player2));
            },3000)

            }
        
            // Iterate throuh every game in games
            games.forEach((game, game_id) => {        
            // Check if the game is active
            // if (game.active) {
            //     // Update the game and store the returned turn boolean
            //     let turn = game.update();
            //     // Send update data to the players
            //     let gamestate = game.updateData();
            //     //console.log("Game State : ",gamestate);
            //     game.player1.socket.emit("game-update", gamestate);
            //     game.player2.socket.emit("game-update", gamestate);
        
            //     // If the turn has changed, send turn data to the players
            //     if (turn) {
            //         eventEmitter.emit('start-timer',game);
            //         game.player1.socket.emit(
            //             "game-updateTurn",
            //             game.turnData(game.player1)
            //         );
            //         game.player2.socket.emit(
            //             "game-updateTurn",
            //             game.turnData(game.player2)
            //         );
            //     }
            // }
        
            // Check if the game has ended
            if (game.ended) {
                // Send ending data to the players
                
                game.player1.socket.emit("game-end", game.endData(game.player1));
                game.player2.socket.emit("game-end", game.endData(game.player2));
        
                // Remove the game from games
                games.delete(game_id);
                log(`game#${game_id} has ended with result: ${JSON.stringify(game.endData(game.player1))} - ${games.size} games(s) in progress`);
            }
            });
        
            // Tickrate of the game loop in ms
        }, 1000 / TICKRATE);
    }

    module.exports = {
        gameLoop : gameLoop
    }