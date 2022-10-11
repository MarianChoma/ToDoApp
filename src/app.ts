import {sequelize} from "./database/connection";
import express from "express";
import {userRouter} from './routers/userRouter';
import {listRouter} from './routers/listRouter';
import {taskRouter} from './routers/taskRouter';

const port: number = 3000;
const app = express();


app.use(express.json());
app.use(userRouter);
app.use(listRouter);
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Connected successfully on port ${port}`);
})