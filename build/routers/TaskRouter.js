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
Object.defineProperty(exports, "__esModule", {value: true});
exports.taskRouter = void 0;
const express = __importStar(require("express"));
const authentication_1 = require("../services/authentication");
const TaskService = __importStar(require("../services/taskService"));
const taskRouter = express.Router();
exports.taskRouter = taskRouter;
/**
 * CREATE task
 */
taskRouter.post('/task', authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const createdTask = yield TaskService.createTask(body);
        const newTask = yield TaskService.findTaskById(createdTask.id);
        return res.status(201).send({
            newTask
        });
    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
}));
/**
 * UPDATE task
 */
taskRouter.patch('/task', authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        yield TaskService.updateTask(body);
        return res.sendStatus(204);
    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
}));
/**
 * DELETE task
 */
taskRouter.delete('/task', authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        yield TaskService.deleteTask(body.taskId, body.userId);
        res.sendStatus(204);
    } catch (e) {
        res.sendStatus(404);
    }
}));
