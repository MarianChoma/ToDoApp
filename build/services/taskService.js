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
exports.findTaskById = exports.deleteTask = exports.updateTask = exports.createTask = void 0;
const checkOwner_1 = require("./checkOwner");
const Task = require("../models/Task");
const ListService = __importStar(require("./listService"));
const UserService = __importStar(require("./userService"));
const fastest_validator_1 = __importDefault(require("fastest-validator"));
const validator = new fastest_validator_1.default();
const schema = {
    name: {type: "string", empty: false, min: 1},
    description: {type: "string", empty: false, min: 1},
    deadline: {type: "string", empty: false, min: 8, max: 19},
    listId: {type: "number", empty: false, min: 1},
    userId: {type: "number", empty: false, min: 1},
};
const checkInput = validator.compile(schema);
const createTask = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {name, description, deadline, listId, userId} = body;
    const result = checkInput({
        name: name.trim(),
        description: description.trim(),
        deadline: deadline,
        listId: listId,
        userId: userId
    });
    if (result === true) {
        if (!(yield UserService.findById(userId))) {
            throw new Error("invalid_userId");
        }
        if (!(yield ListService.findById(listId))) {
            throw new Error("invalid_listId");
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
    } else {
        throw new Error("wrong_inputs");
    }
});
exports.createTask = createTask;
const updateTask = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const {name, description, deadline, taskId, listId, userId, done} = body;
    const result = checkInput({
        name: name.trim(),
        description: description.trim(),
        deadline: deadline,
        listId: listId,
        userId: userId
    });
    if (result === true) {
        const task = yield findTaskById(taskId);
        if (task === null) {
            throw new Error("invalid_taskId");
        }
        const canUpdate = yield (0, checkOwner_1.checkOwner)(userId, task.listId);
        if (canUpdate) {
            yield task.update({name, description, deadline, done}).catch((e) => console.log(e));
        } else {
            throw new Error();
        }
    } else {
        throw new Error();
    }
});
exports.updateTask = updateTask;
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
exports.deleteTask = deleteTask;
const findTaskById = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Task.findOne({
        where: {
            id: taskId
        }, attributes: [`id`, `name`, `description`, `deadline`, `done`, `listId`, `userId`]
    });
});
exports.findTaskById = findTaskById;
