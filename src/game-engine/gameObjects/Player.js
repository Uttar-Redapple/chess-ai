'use strict';
//const shortid = require('shortid');

// Player class constructor
const Player = function (socket,life) {

    // Socket
    this.socket = socket;
    socket.player = this;

    // Properties
    this.id = socket.user.user_id;
    this.user_name = socket.user.user_name;
    this.inQueue = false;
    this.inGame = false;
    this.isOnline = true;
    this.life = life;
};

// Export Player class
module.exports = Player;