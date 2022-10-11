import {Response} from "express";
import * as express from "express";
import {TypedRequestBody} from '../TypedRequestBody';
import {authenticateToken} from '../services/authentication';
import * as TaskService from '../services/taskService';

const taskRouter = express.Router();

/**
 * CREATE task
 */
taskRouter.post('/task', authenticateToken, async (req: TypedRequestBody<{
    name: String,
    description: String,
    userId: number,
    deadline: Date,
    listId: number
}>, res: Response) => {

    const body = req.body;
    try {
        const createdTask = await TaskService.createTask(body)
        const newTask = await TaskService.findTaskById(createdTask.id);

        return res.status(201).send({
            newTask
        });
    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
});

/**
 * UPDATE task
 */
taskRouter.patch('/task', authenticateToken, async (req: TypedRequestBody<{
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

/**
 * DELETE task
 */
taskRouter.delete('/task', authenticateToken, async (req: TypedRequestBody<{ taskId: number, userId: number }>, res: Response) => {
    const body = req.body;
    try {
        await TaskService.deleteTask(body.taskId, body.userId);
        res.sendStatus(204)
    } catch (e) {
        res.sendStatus(404);
    }
})

export {taskRouter};