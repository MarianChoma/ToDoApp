import Validator from "fastest-validator";
import Lists = require('../models/List');
import * as UserService from '../services/userService';
import {checkOwner} from './checkOwner';
import {sequelize} from "../database/connection";
import {QueryTypes} from "sequelize";

const validator = new Validator();

const createList = async (body: any) => {
    const {title, userId} = body;
    const schema = {
        title: {type: "string", empty: false, min: 1},
    }
    const checkInput = validator.compile(schema);
    const result = checkInput({
        title: title.trim()
    })
    if (result !== true) {
        throw new Error("incorrect_parameters");
    }
    const user = await UserService.findById(userId);
    if (user === null) {
        throw new Error("invalid_userId");
    }

    const list = await Lists.List.create({title}).catch((e: Error) => {
        console.error(e);
    });

    await list.addUser(user).catch((e: any) => {
        console.error(e);
    });
    return list;
}
const getAllLists = async () => {
    const allList: { tasks: {} }[] = [];
    const lists = await Lists.List.findAll({raw: true});

    for (let [index, list] of lists.entries()) {
        allList[index] = list
        allList[index].tasks = await sequelize.query(`SELECT t.id, t.name, t.description, 
                                             DATE_FORMAT(t.deadline, '%Y-%d-%m %h:%i:%s') as deadline FROM Task t
                                             WHERE t.listId= ?`,
            {
                replacements: [list.id],
                type: QueryTypes.SELECT
            })
    }
    return allList;
}

const shareList = async (body: any) => {
    const {listId, addId, userId} = body;
    let schema = {
        listId: {type: "number", empty: false, min: 1},
        addId: {type: "number", empty: false, min: 1},
        userId: {type: "number", empty: false, min: 1}
    }
    const checkInput = validator.compile(schema);
    const result = checkInput({listId, addId, userId})
    if (result === true) {
        const list = await findById(listId);
        if (list === null) {
            throw new Error("invalid_listId")
        }
        const user = await UserService.findById(addId);
        if (user === null) {
            throw new Error("invalid_userId")
        }
        const canShare = await checkOwner(userId, listId);
        if (canShare) {
            await list.addUser(user);
        } else {
            throw new Error("unauthorized")
        }
    } else {
        throw new Error("wrong_input")
    }
}

const deleteList = async (body: any) => {
    const {listId, userId} = body;
    if (!(await findById(listId))) {
        throw new Error("invalid_listId")
    }
    const canDelete = await checkOwner(userId, listId);
    if (canDelete) {
        await Lists.List.destroy({
            where: {
                id: listId
            }
        })
        await Lists.UserLists.destroy({
            where: {
                list_id: listId
            }
        })
    } else {
        throw new Error("unauthorized")
    }
}
const findById = async (id: number) => {
    return await Lists.List.findOne({
        where: {
            id: id
        }
    })
}

export {
    createList,
    shareList,
    deleteList,
    findById,
    getAllLists
}