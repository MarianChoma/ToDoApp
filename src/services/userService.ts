require('dotenv').config();
const User = require('../models/User')
const List = require('../models/List')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import {checkInput} from './emptyInputValidation';


const findAll = async () => {
    return await User.findAll();
}
const findByUsername = async (username: String) => {
    return await User.findOne({where: {username: username}, attributes: ['id', 'username']});
}
const registration = async (body: any) => {
    const {username, password} = body;
    checkInput(username, password);
    const user = await findByUsername(username);
    if (user) {
        throw new Error('duplicated_email');
    }

    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({username, password: hashedPassword})
        return findByUsername(username)
    } catch (e) {
        console.log(e);
    }
}

const login = async (body: any) => {
    const {username, password} = body;
    checkInput(username, password);

    const user = await User.findOne({where: {username: username}});
    if (user === null) {
        throw new Error("username_doesnt_exist")
    }
    try {
        const logged = await bcrypt.compare(password, user.password);
        if (logged) {
            return await jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
        }
    } catch (e) {
        console.error(e);
    }
}
const getAllLists = async (userId: number) => {
    return await List.UserLists.findAll({
        where: {
            user_id: userId
        },
        attributes: ['list_id']
    });
}

const findById = async (id: number) => {
    return await User.findOne({
        where: {
            id: id
        }
    })
}


module.exports = {
    registration,
    findAll,
    findByUsername,
    login,
    findById,
    getAllLists
}