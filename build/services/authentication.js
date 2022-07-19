"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.authenticateToken = void 0;
require('dotenv').config();
const jwt = require('jsonwebtoken');
function authenticateToken(req, res, next) {
    const token = req.headers.accesstoken;
    if (token === null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        console.log(user);
        if (user.id === req.body.userId) {
            req.body.userId = user.id;
            next();
        } else {
            return res.sendStatus(403);
        }
    });
}
exports.authenticateToken = authenticateToken;
module.exports = authenticateToken;
