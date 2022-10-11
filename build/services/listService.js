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
exports.getAllLists = exports.findById = exports.deleteList = exports.shareList = exports.createList = void 0;
const fastest_validator_1 = __importDefault(require("fastest-validator"));
const Lists = require("../models/List");
const UserService = __importStar(require("../services/userService"));
const checkOwner_1 = require("./checkOwner");
const connection_1 = require("../database/connection");
const sequelize_1 = require("sequelize");
const validator = new fastest_validator_1.default();
const createList = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {title, userId} = body;
    const schema = {
        title: {type: "string", empty: false, min: 1},
    };
    const checkInput = validator.compile(schema);
    const result = checkInput({
        title: title.trim()
    });
    if (result !== true) {
        throw new Error("incorrect_parameters");
    }
    const user = yield UserService.findById(userId);
    if (user === null) {
        throw new Error("invalid_userId");
    }
    const list = yield Lists.List.create({title}).catch((e) => {
        console.error(e);
    });
    yield list.addUser(user).catch((e) => {
        console.error(e);
    });
    return list;
});
exports.createList = createList;
const getAllLists = () => __awaiter(void 0, void 0, void 0, function* () {
    const allList = [];
    const lists = yield Lists.List.findAll({raw: true});
    console.log(lists);
    for (let [index, list] of lists.entries()) {
        allList[index] = list;
        allList[index].tasks = yield connection_1.sequelize.query(`SELECT t.id, t.name, t.description, 
                                             DATE_FORMAT(t.deadline, '%Y-%d-%m %h:%i:%s') as deadline FROM Task t
                                             WHERE t.listId= ?`, {
            replacements: [list.id],
            type: sequelize_1.QueryTypes.SELECT
        });
    }
    return allList;
});
exports.getAllLists = getAllLists;
const shareList = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {listId, addId, userId} = body;
    let schema = {
        listId: {type: "number", empty: false, min: 1},
        addId: {type: "number", empty: false, min: 1},
        userId: {type: "number", empty: false, min: 1}
    };
    const checkInput = validator.compile(schema);
    const result = checkInput({listId, addId, userId});
    if (result === true) {
        const list = yield findById(listId);
        if (list === null) {
            throw new Error("invalid_listId");
        }
        const user = yield UserService.findById(addId);
        if (user === null) {
            throw new Error("invalid_userId");
        }
        const canShare = yield (0, checkOwner_1.checkOwner)(userId, listId);
        if (canShare) {
            yield list.addUser(user);
        } else {
            throw new Error("unauthorized");
        }
    } else {
        throw new Error("wrong_input");
    }
});
exports.shareList = shareList;
const deleteList = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {listId, userId} = body;
    if (!(yield findById(listId))) {
        throw new Error("invalid_listId");
    }
    const canDelete = yield (0, checkOwner_1.checkOwner)(userId, listId);
    if (canDelete) {
        yield Lists.List.destroy({
            where: {
                id: listId
            }
        });
        yield Lists.UserLists.destroy({
            where: {
                list_id: listId
            }
        });
    } else {
        throw new Error("unauthorized");
    }
});
exports.deleteList = deleteList;
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Lists.List.findOne({
        where: {
            id: id
        }
    });
});
exports.findById = findById;
