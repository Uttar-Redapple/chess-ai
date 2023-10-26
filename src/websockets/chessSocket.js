let setNSP = (gameIo) => {
    let auth = require('../middlewares/auth');
    let { eventEmitter } = require('../../config/appConfig');
    let gameConfig = require('../game-engine/gameConfig');

    

    // Imports
    const Player = require("../game-engine/gameObjects/Player");
    const Queue = require("../game-engine/gameControllers/Queue");

    // Data structures
    const players = new Map();
    const games = new Map();
    const queue = new Queue();
    let turnCountdown = {};

    // Log function
    const chalk = require("chalk");
    const log = (string) =>
    console.log(
        `${chalk.bold.underline.red(
        `Players : [${players.size}] Queue : [${queue.size}] Games : [${games.size}]`
        )} ${chalk.yellow("»")} ${chalk.yellow(string)}`
    );

    console.log(`socket server listening on NameSpace : ${gameIo.name}`);
    const mainGameLoop = require('../game-engine/engine').gameLoop;
    mainGameLoop(players,games,queue);
    gameIo.use(auth.isAuthorizedSocket).on('connection',async (socket) => {

        /**
         * Connection Handler.
        **/
        console.log(`one socket connected:${socket.id} with user_id:${socket.user.user_id} user_name:${socket.user.user_name}`);
        socket.emit('user-data',socket.user);
        let player = null;
        if(!players.has(socket.user.user_id)){
            // Create new player and add to players
            player = new Player(socket,gameConfig.PLAYER_LIFE);
            players.set(player.id, player);
        }else{
            player = players.get(socket.user.user_id);
            player.socket = socket;
        }
        log(
          `${player.user_name}#${player.id} has connected - ${players.size} player(s) online`
        );

        /**
         * Socket Events For Application Logic.
        **/
                   // On socket joining the queue
                   socket.on("queue-join", () => {
                    console.log("queue-join hit")
                     // Check if the player is not in queue or in game and enqueue them
                     if (!player.inQueue && !player.inGame) {
                       queue.enqueue(player);
                       log(
                         `${player.user_name}#${player.id} has joined the queue - ${queue.size} player(s) in queue`
                       );
                     }
                   });

                   /** Main Gameplay Subject to change in future to backend driven chess engine */
                   socket.on("update-move",(data) => {
                    if (typeof data == 'string') {
                      data = JSON.parse(data);
                    }
                    if(player.inGame){
                      let {opponent} = player.game.getOpponent(player);
                      console.log('opponent ',opponent);
                      opponent.socket.emit('update-details',data);
                    }
                   });
         
                   // On socket leaving the queue
                   socket.on("queue-leave", () => {
                     // Check that the player is in the queue and remove them
                     if (player.inQueue) {
                       queue.remove(player);
                       log(
                         `${player.user_name}#${player.id} has left the queue - ${queue.size} player(s) in queue`
                       );
                     }
                   });

                   //On player moving a piece
        /**
         * Disconnection Handler.
        **/
        socket.on("disconnect", () => {
            player.isOnline = false;
            clearInterval(turnCountdown);
            // If player in queue, remove them from the queue
            if (player.inQueue) queue.remove(player);
            // If player in game, end the game with the opponent as the winner
            if (player.inGame){
              player.life-=1;
              if((player.life == 0) || !(player.game.player1.isOnline || player.game.player2.isOnline)){
                player.game.end(
                  player == player.game.player1? player.game.player2: player.game.player1
               );
              }
            }else{
                //Remove the player from players
                players.delete(player.id);
            }
            log(
              `${player.user_name}#${player.id} has disconnected life:${player.life} - ${players.size} player(s) online`
            );
          });
    });
}

module.exports = {
    setNSP:setNSP
}