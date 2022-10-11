"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
const express_1 = __importDefault(require("express"));
const userRouter_1 = require("./routers/userRouter");
const listRouter_1 = require("./routers/listRouter");
const taskRouter_1 = require("./routers/taskRouter");
const port = 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(userRouter_1.userRouter);
app.use(listRouter_1.listRouter);
app.use(taskRouter_1.taskRouter);
app.listen(port, () => {
    console.log(`Connected successfully on port ${port}`);
});
