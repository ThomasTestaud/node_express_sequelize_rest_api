var express = require('express');
var router = express.Router();
const SQLquery = require('../sql/sql.js');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const tokenVerify = require('../utils/tokenVerify.js');
const middleware = require('../middleware.js');


router.post('/signup', function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const displayedNameame = req.body.displayed_name;

  bcrypt.hash(password,12).then(hashedPassword => {
    
    const query = "INSERT INTO `users`(`email`, `password`, `displayed_name`) VALUES ('"+email+"','"+hashedPassword+"','"+displayedNameame+"')";
  
    try {
      SQLquery(query, (results) => {
        res.json("success");
        res.status(201);
      })
    } catch (error) {
      res.status(500);
      res.send('Error on create: '+error); 
    }
  })
});

router.post('/login', function(req, res, next) {

  const email = req.body.email;
  const password = req.body.password;

  const query = "SELECT `id`, `email`, `password` FROM `users` WHERE email = '"+email+"'";

  try {
    SQLquery(query, (results) => {

      if(results.length > 0) {

        const secret = process.env.JWT_SECRET;

        const user = results[0];

        bcrypt.compare(password, user.password).then(isOk => {
          if (!isOk) {
            res.json('false');
          } else {
            delete user.password;
            res.json({
              "token": JWT.sign({id: user.id}, secret, {expiresIn: 360000000000}),
              "user": user,
            });
          }
          
        })


      } else {
        res.json("access denied");
      }

    })
  } catch (error) {
    res.status(500);
    res.send('Error on create: '+error); 
  }

});

//router.use(middleware.authenticationMiddleware);

router.get('/test', function(req, res, next) {

  let token = req.header('Authorization');

  token = token.split(" ");
  token = token[1];

  tokenVerify(token, res, (payload) => {
    const id = payload.id;

    const query = "SELECT `displayed_name` FROM `users` WHERE id = "+id;
  
    try {
      SQLquery(query, (results) => {
        res.json(results[0]['displayed_name']);
        res.status(201);
      })
    } catch (error) {
      res.status(500);
      res.send('Error on getting resource: '+error); 
    }
    
  })

});

module.exports = router;
