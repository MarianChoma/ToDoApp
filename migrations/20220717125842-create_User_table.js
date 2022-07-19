'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.createTable("User", {
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
                type: Sequelize.STRING(70),
                allowNull: false
            }
        });
    },

    async down(queryInterface, Sequelize) {
        return await queryInterface.dropTable("User");
    }
};
