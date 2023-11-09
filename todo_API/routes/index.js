var express = require('express');
var router = express.Router();
const fs = require('fs');
const SQLquery = require('../sql/sql.js');
const middleware = require('../middleware.js');

//router.use(middleware.authenticationMiddleware);

router.get('/', function(req, res, next) {
  const defaultPage = 1;
  const defaultAmount = 3;

  const page = Number(req.query.page) || defaultPage;
  const amount = Number(req.query.amount) || defaultAmount;
  const filter = req.query.filter || null;
  const value = req.query.value || null;

  let subquery = 'SELECT COUNT(title) FROM `tasks`;';
  let query = 'SELECT title, due_date, done, user FROM `tasks`';
  
  switch (filter) {
    case 'done':
      query += ' WHERE done = 1';
      break;
    case 'undone':
      query += ' WHERE done = 0';
      break;
    case 'user':
      if (value !== null) {
        query += ' WHERE user LIKE "%'+ value + '"% ';
      }
      break;
    case 'search':
      if (value !== null) {
        query += ' WHERE title LIKE "%' + value + '%" ';
      }
      break;
  }
  query += "WHERE user_id = "+req.user.id;
  query += ' LIMIT '+amount+' OFFSET '+(page * amount - amount)
 
  try {
    SQLquery(query, (results) => {
      SQLquery(subquery, (subresults) => {
        subquery = subresults;

        let pageNumber = Math.floor(subresults[0]['COUNT(title)']/amount)+1;

        res.json([results, pageNumber]);
        res.status(201);
      })
    })
  } catch (error) {
    res.status(500);
    res.send('Error: '+error);
  }
});

router.get('/:id', function(req, res, next) {
  const id = Number(req.params.id);
  
  const query = `SELECT * FROM tasks WHERE id = ${id}`;
  try {
    SQLquery(query, (results) => {
      res.json(results);
      res.status(201);
    })
  } catch (error) {
    res.status(500);
    res.send('Error: '+error); 
  }
});

router.post('/', function(req, res, next) {
  const title = req.body.title;
  const description = req.body.description;
  const due_date = req.body.due_date;
  const user = req.body.user;

  try {
    const inputDate = new Date(due_date);
    const year = inputDate.getFullYear();
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); 
    const day = inputDate.getDate().toString().padStart(2, '0');
    const sqlDateStr = `${year}-${month}-${day}`;
  } catch (error) {
    res.status(500);
    res.send('Invalid date format: '+error);
  }

  const query = "INSERT INTO `tasks`(`title`, `due_date`, `description`, `user`) VALUES ('"+title +"', '"+sqlDateStr+"', '"+description+"', '"+user+ "')";

  try {
    SQLquery(query, (results) => {
      res.json("success");
      res.status(201);
    })
  } catch (error) {
    res.status(500);
    res.send('Error on create: '+error); 
  }

});

router.patch('/:id', function(req, res, next) {
  const id = Number(req.params.id);
  const title = req.body.title;
  const description = req.body.description;
  const due_date = req.body.due_date;
  const user = req.body.user;
  const done = req.body.done;

  const inputDate = new Date(due_date);

  const year = inputDate.getFullYear();
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); 
  const day = inputDate.getDate().toString().padStart(2, '0');

  const sqlDateStr = `${year}-${month}-${day}`;

  // faire une query à la database pour récupérer l'élément à affichier, puis faire
  // object = { ...object, ...req.body};
  // comme ça, seul champ peut être replis dans le body et ce champ sera modifié sur l'object sortis de la DDB
  // puis faire un Update dans la DDB
  
  const query = `UPDATE tasks SET title = "${title}", due_date = "${sqlDateStr}", done = ${done}, description = "${description}", user = "${user}" WHERE id = ${id}`;

  try {
    SQLquery(query, (results) => {
      res.json("success");
      res.status(201);
    })
  } catch (error) {
    res.status(500);
    res.send('Error on update: '+error);  
  }
});

router.delete('/:id', function(req, res, next) {
  const taskId = Number(req.params.id);
  
  const query = `DELETE FROM tasks WHERE id = ${taskId}`;

  try {
    SQLquery(query, (results) => {
      res.json("success");
      res.status(201);
    })
  } catch (error) {
    res.status(500);
    res.send('Error : '+error);   
  }
});

module.exports = router;
