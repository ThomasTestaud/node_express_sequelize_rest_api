const SQLquery = require('./sql/sql.js');
const JWT = require('jsonwebtoken');

function authenticationMiddleware(req, res, next) {

    let token = req.header('Authorization');

    if (!token) {
      return res.status(401).json("Access denied");
    }
    token = token.split(" ");

    if (token.length !== 2) {
      return res.status(401).json("Access denied");
    }
    
    token = token[1];

    JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {

        if (err !== null) {
            res.status(401);
            res.json("Access denied");
            process.exit(1);
        }

        const id = Number(payload.id);
        
        const query = "SELECT * FROM `users` WHERE id = " + id;
        
        try {
            SQLquery(query, (results) => {
                if (results.length > 0) {

                    delete results[0].password;

                    req.user = results[0];
                    console.log(req.user);
                    next();
                }
            })
        } catch (error) {
            res.status(500);
            res.send('Error on getting resource: ' + error);
        }
          
    })
}

module.exports = {
    'authenticationMiddleware': authenticationMiddleware
};