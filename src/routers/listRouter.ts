import {Response} from "express";

const authenticateToken = require('../services/authentication')

const express = require('express');
import {TypedRequestBody} from '../TypedRequestBody';

const router = express.Router();
const ListService = require('../services/listService');


router.post('/list', authenticateToken, async (req: TypedRequestBody<{ title: String, userId: number }>, res: Response) => {
    const body = req.body;
    try {
        const newList = await ListService.createList(body);
        res.status(201).send(newList);
    } catch (e) {
        res.sendStatus(400);
    }
});

router.patch('/list/share', authenticateToken, async (req: TypedRequestBody<{ listId: number, userId: number, addId: number }>, res: Response) => {
    const body = req.body;
    try {
        await ListService.shareList(body);
        res.send(204);
    } catch (e) {
        res.sendStatus(400);
    }
})

router.delete('/list', authenticateToken, async (req: TypedRequestBody<{ listId: number, userId: number }>, res: Response) => {
    const body = req.body;
    try {
        await ListService.deleteList(body);
        res.sendStatus(204)
    } catch (e) {
        res.sendStatus(404);
    }

})

module.exports = router;