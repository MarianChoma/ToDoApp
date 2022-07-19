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
const express = require('express');
const authenticateToken = require('../services/authentication');
const router = express.Router();
const TaskService = require('../services/taskService');
router.post('/task', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const newTask = yield TaskService.createTask(body);
        return res.status(201).send({
            newTask
        });
    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
}));
router.patch('/task', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        yield TaskService.updateTask(body);
        return res.sendStatus(204);
    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
}));
router.delete('/task', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        yield TaskService.deleteTask(body.taskId, body.userId);
        res.sendStatus(204);
    } catch (e) {
        res.sendStatus(404);
    }
}));
module.exports = router;
