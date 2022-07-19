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
const ListService = require('../services/listService');
router.post('/list', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const newList = yield ListService.createList(body);
        res.status(201).send(newList);
    } catch (e) {
        res.sendStatus(400);
    }
}));
router.patch('/list/share', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        yield ListService.shareList(body);
        res.send(204);
    } catch (e) {
        res.sendStatus(400);
    }
}));
router.delete('/list', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        yield ListService.deleteList(body);
        res.sendStatus(204);
    } catch (e) {
        res.sendStatus(404);
    }
}));
module.exports = router;
