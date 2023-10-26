'use strict';

// Components
const gameConfig = require('../gameConfig');
const check = require('../../libs/checkLib');


// Constants

// Game counter
let num = 0;

// Game class constructor
const Game = function (player1, player2) {

    // Game id
    this.id = ++num;

    // Add player reference and set game properties
    this.player1 = player1;
    this.player2 = player2;
    this.player1.game = this;
    this.player2.game = this;
    this.player1.inGame = true;
    this.player2.inGame = true;

    // Game status properties
    this.active = false;
    this.ended = false;

    // Game turn properties
    this.turn = this.player1;
    this.nextTurn = this.player2;
    this.turnTracker = {};
    // Game score
    this.player1.score = 0;
    this.player2.score = 0;

    // Game player colour properties
    this.colourSelected = false;
    this.player1.colour = 'white';
    this.player2.colour = 'black';
    this.turnTracker[this.turn.id] == true;
    this.turnTracker[this.nextTurn.id] == false

};

// Update class method

//Check Turn Timer Tracker Status
Game.prototype.turnTackerStatus = function (id){
    return this.turnTracker[id];
}

// Game end method
Game.prototype.end = function (winner) {
    console.log('Ending Game!')
    // Set winner's score to 8
    winner.score = 8;
    // Get loser
    let loser = (winner == this.player1 ? this.player2 : this.player1);

    // Create new game in the database
    // Set ending game properties
    this.active = false;
    this.ended = true;
    
    // Set player properties
    this.player1.inGame = false;
    this.player2.inGame = false;
    delete this.player1.game;
    delete this.player2.game;
    delete this.player1.colour;
    delete this.player2.colour;

};

// Data that is sent to the players when the game starts
Game.prototype.startData = function (player) {
    let opponent = (player == this.player1 ? this.player2 : this.player1);
    return {
        player: { id: player.id, user_name: player.user_name, score: player.score, colour: player.colour },
        opponent: { id: opponent.id, user_name: opponent.user_name, score: opponent.score, colour: opponent.colour },
        active: this.active,
        turn: (player == this.turn),
        turn_time:gameConfig.TURNTIME
    };
};


// Data that is sent to the palyers when the turn changes
Game.prototype.turnData = function (player) {
    let opponent = (player == this.player1 ? this.player2 : this.player1);
    return {
        player: {id: player.id, score: player.score, colour: player.colour },
        opponent: { id: opponent.id, score: opponent.score, colour: opponent.colour },
        turn: (player == this.turn),
        turn_time:gameConfig.TURNTIME,
    };
};

// Data that is sent to the players when the game ends
Game.prototype.endData = function (player) {
    this.turnTracker[this.turn.id] == false;
    this.turnTracker[this.nextTurn.id] == false
    let opponent = (player == this.player1 ? this.player2 : this.player1);
    // return { winner: player.score > opponent.score };
    return {
        player: {id: player.id, score: player.score, colour: player.colour },
        opponent: {id: opponent.id, score: opponent.score, colour: opponent.colour },
        winner: player.score > opponent.score
    }
};

// Export game class
module.exports = Game;