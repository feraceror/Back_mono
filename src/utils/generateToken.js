const jwt = require('jsonwebtoken');
const config = require('../config/config');

function generateToken(data) {
    
    const jwtConfig = {
      expiresIn: '15m',
    };
    const payload = {
      data: data
    }
    
    const token = jwt.sign(payload, config.secret, jwtConfig);

    return token;
}

function verifyToken(token) {
  try {
    if(!!token && token.includes('Bearer ')) {
      token = token.split(' ')[1];
      if(jwt.verify(token, config.secret)){
        return jwt.decode(token);
      }
    } 
    
  } catch (error) {
    console.error('[LOG-ERROR] ' + error);
  }
  return null;
}

module.exports = {
    generateToken,
    verifyToken
};