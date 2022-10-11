const {Model, Sequelize} = require("sequelize");
import {sequelize} from "../database/connection";

import User = require('./User');
import Lists = require('./List');

class Task extends Model {
}

Task.init({
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: Sequelize.STRING(120),
    description: Sequelize.STRING(500),
    deadline: Sequelize.DATE,
    done: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    listId: {
        type: Sequelize.INTEGER(11)
    },
    userId: {
        type: Sequelize.INTEGER(11)
    }
}, {
    sequelize,
    modelName: 'Task',
    timestamps: false,
    tableName: 'Task'
});

User.hasMany(Task, {foreignKey: "userId"})
Task.belongsTo(User);
Task.belongsTo(Lists.List);


export = Task;