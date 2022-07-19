import {Response} from "express";

const express = require('express');
import {TypedRequestBody} from '../TypedRequestBody';

const authenticateToken = require('../services/authentication')

const router = express.Router();
const TaskService = require('../services/taskService');


router.post('/task', authenticateToken, async (req: TypedRequestBody<{
    name: String,
    description: String,
    userId: number,
    deadline: Date,
    listId: number
}>, res: Response) => {

    const body = req.body;
    try {
        const newTask = await TaskService.createTask(body)
        return res.status(201).send({
            newTask
        });
    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
});

router.patch('/task', authenticateToken, async (req: TypedRequestBody<{
    name: String,
    description: String,
    deadline: Date,
    taskId: number,
    userId: number
    done: boolean
}>, res: Response) => {

    const body = req.body;
    try {
        await TaskService.updateTask(body)
        return res.sendStatus(204);
    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
});

router.delete('/task', authenticateToken, async (req: TypedRequestBody<{ taskId: number, userId: number }>, res: Response) => {
    const body = req.body;
    try {
        await TaskService.deleteTask(body.taskId, body.userId);
        res.sendStatus(204)
    } catch (e) {
        res.sendStatus(404);
    }
})

module.exports = router;