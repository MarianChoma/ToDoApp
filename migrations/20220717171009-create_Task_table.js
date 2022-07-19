'use strict';

const {Sequelize} = require("sequelize");
module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.createTable("Task", {
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
        });
    },

    async down(queryInterface, Sequelize) {
        return await queryInterface.dropTable("Task");
    }
};
