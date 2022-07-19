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

export {sequelize};

