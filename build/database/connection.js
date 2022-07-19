"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.sequelize = void 0;
const Sequelize = require("sequelize");
const sequelize = new Sequelize("ToDoApp", "root", "root", {
    host: "localhost",
    dialect: "mysql",
    operatorsAliases: false,
    timezone: "+2:00",
    dialectOptions: {
        timezone: "local",
    }
});
exports.sequelize = sequelize;
