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
exports.listRouter = void 0;
const express = __importStar(require("express"));
const authentication_1 = require("../services/authentication");
const ListService = __importStar(require("../services/listService"));
const listRouter = express.Router();
exports.listRouter = listRouter;
/**
 * CREATE new list
 */
listRouter.post('/list', authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const newList = yield ListService.createList(body);
        res.status(201).send(newList);
    } catch (e) {
        console.log(e);
        res.status(400).send(e.message);
    }
}));
/**
 * UPDATE list for sharing to another user
 */
listRouter.patch('/list/share', authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        yield ListService.shareList(body);
        res.send(204);
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
}));
/**
 * DELETE list
 */
listRouter.delete('/list', authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        yield ListService.deleteList(body);
        res.sendStatus(204);
    } catch (e) {
        res.sendStatus(404);
    }
}));
/**
 * GET ALL lists for anybody
 */
listRouter.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lists = yield ListService.getAllLists();
    res.send({lists: lists});
}));
