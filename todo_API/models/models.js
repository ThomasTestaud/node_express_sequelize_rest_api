const sequelizeInstance = require('../sql/sequelize.js');
const User = require('./user.js');
const Task = require('./task.js');

//Relations
User.hasMany(Task);
Task.belongsTo(User);

//Sync
sequelizeInstance.sync(/*{alter: true}*/);

module.exports = {
    User,
    Task
};
