const responseLib = require('../libs/responseLib');
const token = require('../libs/tokenLib');
const check = require('../libs/checkLib');
const appConfig = require('../../config/appConfig');
const api_service = appConfig.api_service;

let isAuthorized = async (req, res, next) => {
  try{
    if (req.header('token') && !check.isEmpty(req.header('token'))) {
      let decoded = await token.verifyClaimWithoutSecret(req.header('token'));
      req.user = decoded.data;
      next();
    } else {
      let apiResponse = responseLib.generate(true,'AuthorizationToken Is Missing In Request',null);
      res.status(403)
      res.send(apiResponse)
    }
  }catch(err){
    let apiResponse = responseLib.generate(true,err.message,null);
    res.status(403)
    res.send(apiResponse)
  }
}

let firebaseAuth = async (req,res,next) => {
  if (req.header('token') && !check.isEmpty(req.header('token'))) {
    try{
      let checkAuth = await appConfig.admin.auth().verifyIdToken(req.header('token'));
      next();
    }catch(err){
      let apiResponse = responseLib.generate(0, `${err.message}`, null)
      res.status(401).send(apiResponse)
    }
  } else {
    let apiResponse = responseLib.generate(0, 'AuthorizationToken Is Missing In Request', null)
    res.status(401).send(apiResponse)
  }
}

let isAuthorizedSocket = async (socket,next) => {
  try {
    // console.log("Headers : ",socket.handshake.headers);
    // console.log("Query : ",socket.handshake.query);
    let socketToken;
    if (socket.handshake.headers.auth_token || socket.handshake.query.auth_token) {
        socketToken = socket.handshake.headers.auth_token || socket.handshake.query.auth_token;
    }

    // socket.user = decoded.data
    console.log('Game Token :',socketToken);
    if(check.isEmpty(socketToken)){
      throw new Error('Empty Token Received');
    }
    // const decoded = await api_service.verifyGameToken(socketToken);
    let decoded = await token.verifyClaimWithoutSecret(socketToken);
    if(check.isEmpty(decoded)){
      throw new Error('Invalid Token');
    }else{
      socket.user = decoded;
    }

    next();
} catch (err) {
    console.log('ERROR => ' + err);
}
}

module.exports = {
  isAuthorized: isAuthorized,
  firebaseAuth:firebaseAuth,
  isAuthorizedSocket:isAuthorizedSocket
}
