import {Response} from "express";
import * as express from "express";
import {authenticateToken} from '../services/authentication';
import {TypedRequestBody} from '../TypedRequestBody';
import * as ListService from '../services/listService';

const listRouter = express.Router();

/**
 * CREATE new list
 */
listRouter.post('/list', authenticateToken, async (req: TypedRequestBody<{ title: String, userId: number }>, res: Response) => {
    const body = req.body;
    try {
        const newList = await ListService.createList(body);
        res.status(201).send(newList);
    } catch (e: any) {
        console.log(e);
        res.status(400).send(e.message);
    }
});

/**
 * UPDATE list for sharing to another user
 */
listRouter.patch('/list/share', authenticateToken, async (req: TypedRequestBody<{ listId: number, userId: number, addId: number }>, res: Response) => {
    const body = req.body;
    try {
        await ListService.shareList(body);
        res.send(204);
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
})

/**
 * DELETE list
 */
listRouter.delete('/list', authenticateToken, async (req: TypedRequestBody<{ listId: number, userId: number }>, res: Response) => {
    const body = req.body;
    try {
        await ListService.deleteList(body);
        res.sendStatus(204)
    } catch (e) {
        res.sendStatus(404);
    }
})

/**
 * GET ALL lists for anybody
 */
listRouter.get('/list', async (req: TypedRequestBody<{ listId: number, userId: number }>, res: Response) => {
    const lists = await ListService.getAllLists();
    res.send({lists: lists});

})

export {listRouter};