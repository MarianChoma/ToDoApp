"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {value: true});
require('dotenv').config();
const User = require('../models/User');
const List = require('../models/List');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emptyInputValidation_1 = require("./emptyInputValidation");
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findAll();
});
const findByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findOne({where: {username: username}, attributes: ['id', 'username']});
});
const registration = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {username, password} = body;
    (0, emptyInputValidation_1.checkInput)(username, password);
    const user = yield findByUsername(username);
    if (user) {
        throw new Error('duplicated_email');
    }
    try {
        const salt = yield bcrypt.genSalt();
        const hashedPassword = yield bcrypt.hash(password, salt);
        yield User.create({username, password: hashedPassword});
        return findByUsername(username);
    } catch (e) {
        console.log(e);
    }
});
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {username, password} = body;
    (0, emptyInputValidation_1.checkInput)(username, password);
    const user = yield User.findOne({where: {username: username}});
    if (user === null) {
        throw new Error("username_doesnt_exist");
    }
    try {
        const logged = yield bcrypt.compare(password, user.password);
        if (logged) {
            return yield jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
        }
    } catch (e) {
        console.error(e);
    }
});
const getAllLists = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield List.UserLists.findAll({
        where: {
            user_id: userId
        },
        attributes: ['list_id']
    });
});
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findOne({
        where: {
            id: id
        }
    });
});
module.exports = {
    registration,
    findAll,
    findByUsername,
    login,
    findById,
    getAllLists
};
