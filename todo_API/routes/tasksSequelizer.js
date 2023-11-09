var express = require('express');
var router = express.Router();
const fs = require('fs');
const Task = require('../models/task.js');
const middleware = require('../middlewareSequelize.js');

router.use(middleware.authenticationMiddleware);

router.get('/', async function(req, res, next) {

    try {
        const task = await Task.findAll(
            {
                where: {
                    user_id: req.user.id
                }
            }

            // WHERE EXAMPLE
            /*{ 
                where: {
                    [Op.or]: [
                        {
                            user: {
                                [Op.like]: searchElement+'%',
            
                            },
                        },
                        {
                            user: {
                                [Op.like]: searchElement+'%',
            
                            },
                        }
                    ],
                }
            }*/
        );
        res.json(task);  
    } catch (error) {
        res.status(500);
        res.send('Error: '+error); 
    }

});

router.get('/:id',async function(req, res, next) {
    const id = Number(req.params.id);
    
    try {
        const task = await Task.findByPk(id, 
             {
                where: {
                    user_id: req.user.id
                },
             }
            );
        res.json(task);  
    } catch (error) {
        res.status(500);
        res.send('Error: '+error); 
    }
});


router.post('/', function(req, res, next) {
    
    const data = {title, description, due_date} = req.body;
    data.user_id = req.user.id;
    data.user = req.user.displayed_name;
    data.done = 0;

    const newTask = Task.build(data);
    
    try {
        newTask.save();
        //Task.create(req.body);
        res.json('success');
    } catch (error) {
        res.status(500);
        res.json('error on creation');
    }

});

router.patch('/:id', function(req, res, next) {
    const id = Number(req.params.id);
    const data = {title, description, due_date, done} = req.body;
    
    data.user_id = req.user.id;
    data.user = req.user.displayed_name;

    try {

        Task.update(data, {
            where: {
                id: id,
                user_id: req.user.id
            }
        });

        res.json('success');
    } catch (error) {
        res.status(500);
        res.json('error on creation');
    }
});


router.delete('/:id', function(req, res, next) {
    const taskId = Number(req.params.id);
    
    try {
        Task.destroy({
            //where id = taskId and user_id = req.user.id
            where: {
                id: taskId,
                user_id: req.user.id
            }
        });
        res.json('success');
    } catch (error) {
        res.status(500);
        res.json('error on creation');
    }
});

module.exports = router;
