'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.createTable("List", {
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            title: Sequelize.STRING(100)
        });
    },

    async down(queryInterface, Sequelize) {
        return await queryInterface.dropTable("List");
    }
};
