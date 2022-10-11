"use strict";
const {Model, Sequelize} = require("sequelize");
const User = require("./User");
const connection_1 = require("../database/connection");

class List extends Model {
}

List.init({
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    title: Sequelize.STRING(100)
}, {
    sequelize: connection_1.sequelize,
    modelName: 'List',
    timestamps: false,
    tableName: 'List'
});
const UserLists = connection_1.sequelize.define("UserLists", {}, {timestamps: false,});
List.belongsToMany(User, {
    through: "UserLists",
    foreignKey: "list_id"
});
User.belongsToMany(List, {
    through: "UserLists",
    foreignKey: "user_id"
});
const Lists = {List, UserLists};
module.exports = Lists;
