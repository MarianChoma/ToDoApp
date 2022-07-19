import {checkOwner} from "./checkOwner";

const Task = require('../models/Task');
const ListService = require('./listService');
const OwnerService = require('./userService')


const createTask = async (body: any) => {
    const {name, description, deadline, listId, userId} = body;

    if (!await OwnerService.findById(userId)) {
        throw new Error("invalid_userId");
    }
    if (!await ListService.findById(listId)) {
        throw new Error("invalid_listId");
    }
    if (name.trim().length === 0) {
        throw new Error("empty_name");
    }
    if (description.trim().length === 0) {
        throw new Error("empty_description");
    }
    if (deadline === null) {
        throw new Error("empty_date");
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

}

const updateTask = async (body: any) => {
    const {name, description, deadline, taskId, userId, done} = body;
    const task = await findTaskById(taskId);
    if (task === null) {
        throw new Error("invalid_taskId");
    }
    const canUpdate = await checkOwner(userId, task.listId)
    if (canUpdate) {
        await task.update({name, description, deadline}).catch((e: Error) => console.log(e));
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
        }
    })
}
module.exports = {
    createTask,
    updateTask,
    deleteTask
}