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
exports.userRouter = void 0;
const authentication_1 = require("../services/authentication");
const express = __importStar(require("express"));
const UserService = __importStar(require("../services/userService"));
const userRouter = express.Router();
exports.userRouter = userRouter;
/**
 * CREATE new user
 */
userRouter.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield UserService.registration(req.body);
        return res.status(201).send(newUser);
    } catch (e) {
        console.error(e.message);
        return res.status(400).send(e.message);
    }
}));
/**
 * LOGIN user
 */
userRouter.post('/users/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        return res.status(400).send(e.message);
    }
}));
/**
 * GET all user lists with tasks
 */
userRouter.get('/users/lists', authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const lists = yield UserService.getAllUserLists(body.userId);
        return res.send({
            lists: lists
        });
    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
}));
