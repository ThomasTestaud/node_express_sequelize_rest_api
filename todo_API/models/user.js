const { DataTypes } = require('sequelize');
const sequelizeInstance = require('../sql/sequelize.js');
const bcrypt = require('bcrypt');


const User = sequelizeInstance.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 12));
        },
    },
    displayed_name: {
        type: DataTypes.STRING,
    }
}, {
    indexes: [
        {unique: true, fields: ['email']},
        {unique: true, fields: ['displayed_name']},
    ]
});


module.exports = User;
