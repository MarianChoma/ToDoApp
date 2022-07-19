import express from "express";

const app = express();
const userRouter = require('./routers/userRouter');
const listRouter = require('./routers/listRouter');
const taskRouter = require('./routers/taskRouter');
const port: number = 3000;


require("./database/connection");
app.use(express.json());
app.use(userRouter);
app.use(listRouter);
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Connected successfully on port ${port}`);
})