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
const ListModel = require('../models/List');
const UserService = require('../services/userService');
const checkOwner = require('./checkOwner');
const createList = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {title, userId} = body;
    if (title.trim().length === 0) {
        throw new Error("empty_title");
    }
    const user = yield UserService.findById(userId);
    if (user === null) {
        throw new Error("invalid_userId");
    }
    const list = yield ListModel.List.create({title}).catch((e) => {
        console.error(e);
    });
    yield list.addUser(user).catch((e) => {
        console.error(e);
    });
    return list;
});
const getAllLists = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield ListModel.List.findAll({raw: true});
});
const shareList = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {listId, addId, userId} = body;
    const list = yield findById(listId);
    const canShare = yield check(userId, listId);
    if (list === null) {
        throw new Error("invalid_listId");
    }
    const user = yield UserService.findById(addId);
    if (user === null) {
        throw new Error("invalid_userId");
    }
    if (canShare) {
        yield list.addUser(user);
    } else {
        throw new Error("unauthorized");
    }
});
const deleteList = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {listId, userId} = body;
    if (!(yield findById(listId))) {
        throw new Error("invalid_listId");
    }
    const canDelete = yield check(userId, listId);
    if (canDelete) {
        yield ListModel.List.destroy({
            where: {
                id: listId
            }
        });
        yield ListModel.UserLists.destroy({
            where: {
                list_id: listId
            }
        });
    }
});
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ListModel.List.findOne({
        where: {
            id: id
        }
    });
});
function check(userId, listId) {
    return __awaiter(this, void 0, void 0, function* () {
        const lists = yield ListModel.UserLists.findAll({
            where: {
                user_id: userId
            }, raw: true
        });
        let canShare = false;
        lists.forEach((l) => {
            if (l.list_id === listId) {
                canShare = true;
            }
        });
        return canShare;
    });
}

module.exports = {
    createList,
    shareList,
    deleteList,
    findById,
    getAllLists
};
