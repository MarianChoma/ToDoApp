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
const authenticateToken = require('../services/authentication');
const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
router.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield UserService.registration(req.body);
        return res.status(201).send(newUser);
    } catch (e) {
        console.error(e);
        return res.sendStatus(400);
    }
}));
router.post('/users/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jwt = yield UserService.login(req.body);
        if (jwt) {
            return res.status(200).send({
                accessToken: jwt
            });
        } else {
            return res.sendStatus(401);
        }
    } catch (e) {
        console.error(e);
        return res.sendStatus(401);
    }
}));
router.get('/users/lists', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const lists = yield UserService.getAllLists(body.userId);
        return res.send({
            lists: lists
        });
    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
}));
module.exports = router;
