const {Model, Sequelize} = require("sequelize");
//require("../database/connection");

import {sequelize} from "../database/connection";

class User extends Model {
}

User.init({
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(25),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    timestamps: false,
    tableName: 'User'
});

export = User;