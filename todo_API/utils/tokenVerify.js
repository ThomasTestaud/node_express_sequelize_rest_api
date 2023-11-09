const JWT = require('jsonwebtoken');

function returnPayloadFromToken(token, res, callback) {
    
    JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
      
      if (err !== null) {
        res.status(401);
        res.json("Access denied");
        process.exit(1);
      }
  
      callback(payload);
    })
}

module.exports = returnPayloadFromToken;