var express = require('express');
var router = express.Router();
const User = require('../models/user.js');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');


router.post('/signup', function (req, res, next) {

  const data = { email, password, displayed_name } = req.body;

  User.create(data).then(() => {

    res.json('success');

  }).catch((error) => {
    res.status(500);
    res.json('error on creation: ' + error);
  });

});


router.post('/login', function (req, res, next) {

  const email = req.body.email;
  const password = req.body.password;

  User.findOne(
    {
      where: {
        email: email
      }
    }
  ).then(user => {

    if (!user) {
      res.json('false');
    } else {

      const secret = process.env.JWT_SECRET;

      bcrypt.compare(password, user.password).then(isOk => {
        if (!isOk) {
          res.json('false');
        } else {
          res.json({
            "token": JWT.sign({ id: user.id }, secret, { expiresIn: '1d' }),
          });
        }
      })
    }

  }).catch((error) => {
    res.status(500);
    res.json('error on login: ' + error);
  });
});

module.exports = router;
