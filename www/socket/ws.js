const poolSocket = require('../../src/websockets/chessSocket');
const socketio = require('socket.io');
const appConfig = require('../../config/appConfig');


let startSocket = (server) => {
    let io = socketio(server,{
        cors: {
          origin: '*',
        }
      });
    let gameIO = io.of(`/${appConfig.socketNameSpace}`);
    poolSocket.setNSP(gameIO);
}

module.exports = {
    startSocket:startSocket
}