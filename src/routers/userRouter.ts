import {Response} from "express";
import {authenticateToken} from '../services/authentication';
import {TypedRequestBody} from '../TypedRequestBody'
import * as express from "express";
import * as UserService from '../services/userService';

const userRouter = express.Router();

/**
 * CREATE new user
 */
userRouter.post('/users', async (req: TypedRequestBody<{ username: string, password: string }>, res: Response) => {
    try {
        const newUser = await UserService.registration(req.body);
        return res.status(201).send(newUser);
    } catch (e: any) {
        console.error(e.message);
        return res.status(400).send(e.message);
    }
})

/**
 * LOGIN user
 */
userRouter.post('/users/login', async (req: TypedRequestBody<{ username: string, password: string }>, res: Response) => {
    try {
        const jwt = await UserService.login(req.body);
        if (jwt) {
            return res.status(200).send({
                accessToken: jwt
            });
        } else {
            return res.sendStatus(401);
        }
    } catch (e: any) {
        console.error(e)
        return res.status(400).send(e.message);
    }
})

/**
 * GET all user lists with tasks
 */
userRouter.get('/users/lists', authenticateToken, async (req: TypedRequestBody<{ userId: number }>, res: Response) => {
    const body = req.body;
    try {
        const lists = await UserService.getAllUserLists(body.userId);
        return res.send({
            lists: lists
        })
    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
})
export {userRouter};