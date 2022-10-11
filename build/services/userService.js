"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true, get: function () {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.getAllUserLists = exports.findById = exports.login = exports.findByUsername = exports.findAll = exports.registration = void 0;
const dotenv = __importStar(require("dotenv"));
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const fastest_validator_1 = __importDefault(require("fastest-validator"));
const connection_1 = require("../database/connection");
const sequelize_1 = require("sequelize");
const User = require("../models/User");
dotenv.config();
const validator = new fastest_validator_1.default();
const schema = {
    username: {type: "string", min: 3, max: 25},
    password: {type: "string", min: 5}
};
const checkInput = validator.compile(schema);
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findAll();
});
exports.findAll = findAll;
const findByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findOne({
        where: {
            username: username
        }, attributes: ['id', 'username']
    });
});
exports.findByUsername = findByUsername;
const registration = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {username, password} = body;
    const result = checkInput({
        username: username,
        password: password
    });
    if (result === true) {
        const user = yield findByUsername(username);
        if (user) {
            throw new Error('duplicated_username');
        }
        try {
            const salt = yield bcrypt.genSalt();
            const hashedPassword = yield bcrypt.hash(password, salt);
            yield User.create({username, password: hashedPassword});
            return findByUsername(username);
        } catch (e) {
            console.log(e);
        }
    } else {
        throw new Error("wrong_username_or_password");
    }
});
exports.registration = registration;
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {username, password} = body;
    const result = checkInput({
        username: username,
        password: password
    });
    if (result === true) {
        const user = yield User.findOne({
            where: {
                username: username
            }
        });
        if (user === null) {
            throw new Error("username_doesnt_exist");
        }
        try {
            const logged = yield bcrypt.compare(password, user.password);
            if (logged) {
                return jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
            }
        } catch (e) {
            console.error(e);
        }
    }
});
exports.login = login;
const getAllUserLists = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userLists = yield connection_1.sequelize.query(`SELECT l.id, l.title FROM UserLists ul
                                             JOIN User u ON ul.user_id= ?
                                             JOIN List l ON l.id = ul.list_id
                                             GROUP BY l.id
                                             `, {
        replacements: [userId],
        type: sequelize_1.QueryTypes.SELECT
    });
    for (let [index, list] of userLists.entries()) {
        userLists[index].tasks = yield connection_1.sequelize.query(`SELECT t.id, t.name, t.description, 
                                             DATE_FORMAT(t.deadline, '%Y-%d-%m %h:%i:%s') as deadline FROM Task t
                                             WHERE t.listId= ?`, {
            replacements: [list.id],
            type: sequelize_1.QueryTypes.SELECT
        });
    }
    return userLists;
});
exports.getAllUserLists = getAllUserLists;
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findOne({
        where: {
            id: id
        }
    });
});
exports.findById = findById;
