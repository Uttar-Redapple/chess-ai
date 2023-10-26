'use strict';

// Imports
const Vector = require('../physics/Vector');
let { eventEmitter } = require('../../../config/appConfig');
const gameConfig = require('../gameConfig');

// Initialise physics object
const events = {};

// Ball potted method
events.ballPotted = function (game, ball, pocket) {

    console.log(`Potted Ball : ${ball.colour} ${ball.number}`)
    // Switch case ball colour
    switch (ball.colour) {

        // solid ball
        case 'solid':

            // If the colours have been selected
            if (game.colourSelected) {

                // If the solid player potted the solid ball, set potted to true
                if (game.turn == game.solidPlayer) {
                    game.potted = true;
                // If the striped player potted the solid ball, set foul to true
                } else {
                    game.foul = true;
                    game.foulState = {
                       x: game.cueBall.position.x,
                       z: game.cueBall.position.y,
                       cueballFoul:game.cueballFoul
                    }
                    eventEmitter.emit('foul',game);
                }

            // If the colours have not been selected
            } else {

                // Set the current player to solid
                game.solidPlayer = game.turn;
                game.solidPlayer.colour = 'solid';
                // Set the other player to striped
                game.stripedPlayer = game.nextTurn;
                game.stripedPlayer.colour = 'striped';
                // Set colour selected to true and potted to true
                game.colourSelected = true;
                game.potted = true;
                eventEmitter.emit('set-colour',game);
            }

            // Increment the solid player's score
            game.solidPlayer.score++;
            game.pottedBalls.push({ 
                x:parseFloat( ball.position.x), 
                z:parseFloat( ball.position.y), 
                colour: ball.colour,
                number: ball.number,
                velocityx:parseFloat( ball.velocity.x ) * gameConfig.TICKRATE,
                velocityz:parseFloat( ball.velocity.y ) * gameConfig.TICKRATE,
                pocketx : parseFloat( pocket.position.x ),
                pocketz : parseFloat( pocket.position.y )
            });
            eventEmitter.emit('ball-potted',game);
            // Remove the potted ball from the game
            game.balls.splice(game.balls.indexOf(ball), 1);

            break;

        // striped ball
        case 'striped':

            // If the colours have been selected
            if (game.colourSelected) {

                // If the striped player potted the striped ball, set potted to true
                if (game.turn == game.stripedPlayer) {
                    game.potted = true;
                // If the solid player potted the striped ball, set foul to true
                } else {
                    game.foul = true;
                    game.foulState = {
                        x: game.cueBall.position.x,
                        z: game.cueBall.position.y,
                        cueballFoul:game.cueballFoul
                     }
                     eventEmitter.emit('foul',game);
                }

            // If the colours have not been selected
            } else {

                // Set the current player to striped
                game.stripedPlayer = game.turn;
                game.stripedPlayer.colour = 'striped';
                // Set the other player to solid
                game.solidPlayer = game.nextTurn;
                game.solidPlayer.colour = 'solid';
                // Set colour selected to true and potted to true
                game.colourSelected = true;
                game.potted = true;
                eventEmitter.emit('set-colour',game);
                
            }

            // Increment the striped player's score
            game.stripedPlayer.score++;
            game.pottedBalls.push({ 
                x:parseFloat( ball.position.x), 
                z:parseFloat( ball.position.y), 
                colour: ball.colour,
                number: ball.number,
                velocityx:parseFloat( ball.velocity.x ) * gameConfig.TICKRATE,
                velocityz:parseFloat( ball.velocity.y ) * gameConfig.TICKRATE,
                pocketx : parseFloat( pocket.position.x ),
                pocketz : parseFloat( pocket.position.y )
            });
            eventEmitter.emit('ball-potted',game);
            // Remove the potted ball from the game
            game.balls.splice(game.balls.indexOf(ball), 1);

            break;

        // White ball
        case 'white':

            // Set foul to true
            game.foul = true;
            game.cueballFoul = true;
            game.pottedBalls.push({ 
                x:parseFloat( ball.position.x), 
                z:parseFloat( ball.position.y), 
                colour: ball.colour,
                number: ball.number,
                velocityx:parseFloat( ball.velocity.x ) * gameConfig.TICKRATE,
                velocityz:parseFloat( ball.velocity.y ) * gameConfig.TICKRATE,
                pocketx : parseFloat( pocket.position.x ),
                pocketz : parseFloat( pocket.position.y )
            });
            game.foulState = {
                x:parseFloat( ball.position.x), 
                z:parseFloat( ball.position.y), 
                colour: ball.colour,
                number: ball.number,
                velocityx:parseFloat( ball.velocity.x ) * gameConfig.TICKRATE,
                velocityz:parseFloat( ball.velocity.y ) * gameConfig.TICKRATE,
                pocketx : parseFloat( pocket.position.x ),
                pocketz : parseFloat( pocket.position.y ),
                cueballFoul:game.cueballFoul
            }
            //eventEmitter.emit('ball-potted',game);
            eventEmitter.emit('foul',game);
            // Reset position of the white ball
            ball.position = new Vector(0, 0);
            ball.velocity = new Vector(0, 0);
            ball.acceleration = new Vector(0, 0);

            break;

        // Black ball
        case 'black':
            game.blackPotted = true;
            game.pottedBalls.push({ 
                x:parseFloat( ball.position.x), 
                z:parseFloat( ball.position.y), 
                colour: ball.colour,
                number: ball.number,
                velocityx:parseFloat( ball.velocity.x ) * gameConfig.TICKRATE,
                velocityz:parseFloat( ball.velocity.y ) * gameConfig.TICKRATE,
                pocketx : parseFloat( pocket.position.x ),
                pocketz : parseFloat( pocket.position.y )
            });
            eventEmitter.emit('ball-potted',game);
            // If the current player has potted all of their balls, set their score to 8
            if (game.turn.score >= 7) {
                game.turn.score = 8;
            // If the current player has not potted all of their balls, set the opponent's score to 8
            } else {
                game.nextTurn.score = 8;
            }
            //eventEmitter.emit('foul',game);
            // Remove the potted ball from the game
            game.balls.splice(game.balls.indexOf(ball), 1);

            break;

    }

};

// Export events module 
module.exports = events;