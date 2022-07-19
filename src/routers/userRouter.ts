import {Response} from "express";

const authenticateToken = require('../services/authentication')

const express = require('express');
import {TypedRequestBody} from '../TypedRequestBody'

const router = express.Router();
const UserService = require('../services/userService');

router.post('/users', async (req: TypedRequestBody<{ username: string, password: string }>, res: Response) => {
    try {
        const newUser = await UserService.registration(req.body);
        return res.status(201).send(newUser);
    } catch (e) {
        console.error(e);
        return res.sendStatus(400);
    }
})

router.post('/users/login', async (req: TypedRequestBody<{ username: string, password: string }>, res: Response) => {
    try {
        const jwt = await UserService.login(req.body);
        if (jwt) {
            return res.status(200).send({
                accessToken: jwt
            });
        } else {
            return res.sendStatus(401);
        }
    } catch (e) {
        console.error(e)
        return res.sendStatus(401);
    }
})


router.get('/users/lists', authenticateToken, async (req: TypedRequestBody<{ userId: number }>, res: Response) => {
    const body = req.body;
    try {
        const lists = await UserService.getAllLists(body.userId);
        return res.send({
            lists: lists
        })
    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
})
module.exports = router;