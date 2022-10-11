'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.createTable("UserLists", {
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            list_id: {
                type: Sequelize.INTEGER(11),
            },
            user_id: {
                type: Sequelize.INTEGER(11),
            }

        });
    },

    async down(queryInterface, Sequelize) {
        return await queryInterface.dropTable("UserLists");
    }
};
