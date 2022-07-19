const ListModel = require('../models/List');
const UserService = require('../services/userService');
const checkOwner = require('./checkOwner')

const createList = async (body: any) => {
    const {title, userId} = body;
    if (title.trim().length === 0) {
        throw new Error("empty_title");
    }
    const user = await UserService.findById(userId);
    if (user === null) {
        throw new Error("invalid_userId");
    }

    const list = await ListModel.List.create({title}).catch((e: Error) => {
        console.error(e);
    });

    await list.addUser(user).catch((e: any) => {
        console.error(e);
    });
    return list;
}
const getAllLists = async () => {
    return await ListModel.List.findAll({raw: true})
}

const shareList = async (body: any) => {
    const {listId, addId, userId} = body;
    const list = await findById(listId);
    const canShare = await check(userId, listId);
    if (list === null) {
        throw new Error("invalid_listId")
    }
    const user = await UserService.findById(addId);
    if (user === null) {
        throw new Error("invalid_userId")
    }
    if (canShare) {
        await list.addUser(user);
    } else {
        throw new Error("unauthorized")
    }
}

const deleteList = async (body: any) => {
    const {listId, userId} = body;
    if (!(await findById(listId))) {
        throw new Error("invalid_listId")
    }
    const canDelete = await check(userId, listId);
    if (canDelete) {
        await ListModel.List.destroy({
            where: {
                id: listId
            }
        })
        await ListModel.UserLists.destroy({
            where: {
                list_id: listId
            }
        })
    }
}
const findById = async (id: number) => {
    return await ListModel.List.findOne({
        where: {
            id: id
        }
    })
}


async function check(userId: number, listId: number) {

    const lists = await ListModel.UserLists.findAll({
        where: {
            user_id: userId
        }, raw: true
    })

    let canShare = false;
    lists.forEach((l: any) => {
        if (l.list_id === listId) {
            canShare = true
        }
    })
    return canShare
}

module.exports = {
    createList,
    shareList,
    deleteList,
    findById,
    getAllLists
}