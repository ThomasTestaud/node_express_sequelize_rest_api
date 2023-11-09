const { DataTypes } = require('sequelize');
const sequelizeInstance = require('../sql/sequelize.js');
const User = require('./user.js');

const Task = sequelizeInstance.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    due_date: {
        type: DataTypes.DATE
    },
    done: {
        type: DataTypes.INTEGER
    },
    description: {
        type: DataTypes.STRING
    },
    user: {
        type: DataTypes.STRING
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id', 
        },
    }
}, {});


module.exports = Task;