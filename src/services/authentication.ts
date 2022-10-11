import * as dotenv from "dotenv";
import {TypedRequestBody} from "../TypedRequestBody";
import {Response} from "express";

const jwt = require('jsonwebtoken');
dotenv.config();

function authenticateToken(req: TypedRequestBody<{ userId: any }>, res: Response, next: any) {

    const token = req.headers.accesstoken;
    if (token === null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403);
        }
        if (user.id === req.body.userId) {
            //req.body.userId = user.id;
            next()
        } else {
            return res.sendStatus(403);
        }
    });
}

export {authenticateToken};