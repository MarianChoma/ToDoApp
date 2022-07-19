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
const checkOwner_1 = require("./checkOwner");
const Task = require('../models/Task');
const ListService = require('./listService');
const OwnerService = require('./userService');
const createTask = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {name, description, deadline, listId, userId} = body;
    if (!(yield OwnerService.findById(userId))) {
        throw new Error("invalid_userId");
    }
    if (!(yield ListService.findById(listId))) {
        throw new Error("invalid_listId");
    }
    if (name.trim().length === 0) {
        throw new Error("empty_name");
    }
    if (description.trim().length === 0) {
        throw new Error("empty_description");
    }
    if (deadline === null) {
        throw new Error("empty_date");
    }
    const canCreate = yield (0, checkOwner_1.checkOwner)(userId, listId);
    if (canCreate) {
        const task = yield Task.create({name, description, deadline, listId, userId}).catch((e) => {
            console.error(e);
        });
        return yield findTaskById(task.id);
    } else {
        throw new Error();
    }
});
const updateTask = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {name, description, deadline, taskId, userId, done} = body;
    const task = yield findTaskById(taskId);
    if (task === null) {
        throw new Error("invalid_taskId");
    }
    const canUpdate = yield (0, checkOwner_1.checkOwner)(userId, task.listId);
    if (canUpdate) {
        yield task.update({name, description, deadline}).catch((e) => console.log(e));
    } else {
        throw new Error();
    }
});
const deleteTask = (taskId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield findTaskById(taskId);
    if (!task) {
        throw new Error("invalid_listId");
    }
    const canDelete = yield (0, checkOwner_1.checkOwner)(userId, task.listId);
    if (canDelete) {
        yield Task.destroy({
            where: {
                id: taskId
            }
        });
    } else {
        throw new Error();
    }
});
const findTaskById = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Task.findOne({
        where: {
            id: taskId
        }
    });
});
module.exports = {
    createTask,
    updateTask,
    deleteTask
};
