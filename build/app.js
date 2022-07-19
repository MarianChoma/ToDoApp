"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const userRouter = require('./routers/userRouter');
const listRouter = require('./routers/listRouter');
const taskRouter = require('./routers/taskRouter');
const port = 3000;
require("./database/connection");
app.use(express_1.default.json());
app.use(userRouter);
app.use(listRouter);
app.use(taskRouter);
app.listen(port, () => {
    console.log(`Connected successfully on port ${port}`);
});
