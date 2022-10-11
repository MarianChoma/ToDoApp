import {checkOwner} from "./checkOwner";
import Task = require('../models/Task');
import * as ListService from './listService';
import * as UserService from './userService';
import Validator from "fastest-validator";

const validator = new Validator();

const schema = {
    name: {type: "string", empty: false, min: 1},
    description: {type: "string", empty: false, min: 1},
    deadline: {type: "string", empty: false, min: 8, max: 19},
    listId: {type: "number", empty: false, min: 1},
    userId: {type: "number", empty: false, min: 1},
}
const checkInput = validator.compile(schema);

const createTask = async (body: any) => {
    const {name, description, deadline, listId, userId} = body;
    const result = checkInput({
        name: name.trim(),
        description: description.trim(),
        deadline: deadline,
        listId: listId,
        userId: userId
    })
    if (result === true) {
        if (!await UserService.findById(userId)) {
            throw new Error("invalid_userId");
        }
        if (!await ListService.findById(listId)) {
            throw new Error("invalid_listId");
        }

        const canCreate = await checkOwner(userId, listId);
        if (canCreate) {
            const task = await Task.create({name, description, deadline, listId, userId}).catch((e: Error) => {
                console.error(e);
            });
            return await findTaskById(task.id);
        } else {
            throw new Error();
        }
    } else {
        throw new Error("wrong_inputs");
    }
}

const updateTask = async (body: any) => {
    const {name, description, deadline, taskId, listId, userId, done} = body;
    const result = checkInput({
        name: name.trim(),
        description: description.trim(),
        deadline: deadline,
        listId: listId,
        userId: userId
    })
    if (result === true) {
        const task = await findTaskById(taskId);
        if (task === null) {
            throw new Error("invalid_taskId");
        }
        const canUpdate = await checkOwner(userId, task.listId)
        if (canUpdate) {
            await task.update({name, description, deadline, done}).catch((e: Error) => console.log(e));
        } else {
            throw new Error();
        }
    } else {
        throw new Error();
    }
}

const deleteTask = async (taskId: number, userId: number) => {
    const task = await findTaskById(taskId);
    if (!task) {
        throw new Error("invalid_listId")
    }
    const canDelete = await checkOwner(userId, task.listId);
    if (canDelete) {
        await Task.destroy({
            where: {
                id: taskId
            }
        })
    } else {
        throw new Error();
    }

}

const findTaskById = async (taskId: number) => {
    return await Task.findOne({
        where: {
            id: taskId
        }, attributes: [`id`, `name`, `description`, `deadline`, `done`, `listId`, `userId`]
    })
}

export {
    createTask,
    updateTask,
    deleteTask,
    findTaskById
}