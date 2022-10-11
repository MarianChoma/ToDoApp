import * as dotenv from "dotenv";
import * as  bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import Validator from "fastest-validator";
import {sequelize} from "../database/connection";
import {QueryTypes} from "sequelize";
import User = require("../models/User");

dotenv.config();

const validator = new Validator();
const schema = {
    username: {type: "string", min: 3, max: 25},
    password: {type: "string", min: 5}
}
const checkInput = validator.compile(schema);

const findAll = async () => {
    return await User.findAll();
}

const findByUsername = async (username: String) => {
    return await User.findOne({
        where: {
            username: username
        }, attributes: ['id', 'username']
    });
}

const registration = async (body: any) => {
    const {username, password} = body;

    const result = checkInput({
        username: username,
        password: password
    });
    if (result === true) {
        const user = await findByUsername(username);
        if (user) {
            throw new Error('duplicated_username');
        }
        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            await User.create({username, password: hashedPassword})
            return findByUsername(username)
        } catch (e) {
            console.log(e);
        }
    } else {
        throw new Error("wrong_username_or_password");
    }
}

const login = async (body: any) => {
    const {username, password} = body;
    const result = checkInput({
        username: username,
        password: password
    });
    if (result === true) {
        const user = await User.findOne({
            where: {
                username: username
            }
        });
        if (user === null) {
            throw new Error("username_doesnt_exist")
        }
        try {
            const logged = await bcrypt.compare(password, user.password);
            if (logged) {
                return jwt.sign(user.toJSON(), <jwt.Secret>process.env.ACCESS_TOKEN_SECRET);
            }
        } catch (e) {
            console.error(e);
        }
    }
}
const getAllUserLists = async (userId: number) => {
    const userLists = await sequelize.query(`SELECT l.id, l.title FROM UserLists ul
                                             JOIN User u ON ul.user_id= ?
                                             JOIN List l ON l.id = ul.list_id
                                             GROUP BY l.id
                                             `,
        {
            replacements: [userId],
            type: QueryTypes.SELECT
        });

    for (let [index, list] of userLists.entries()) {
        userLists[index].tasks = await sequelize.query(`SELECT t.id, t.name, t.description, 
                                             DATE_FORMAT(t.deadline, '%Y-%d-%m %h:%i:%s') as deadline FROM Task t
                                             WHERE t.listId= ?`,
            {
                replacements: [list.id],
                type: QueryTypes.SELECT
            })
    }
    return userLists
}

const findById = async (id: number) => {
    return await User.findOne({
        where: {
            id: id
        }
    })
}


export {
    registration,
    findAll,
    findByUsername,
    login,
    findById,
    getAllUserLists
}