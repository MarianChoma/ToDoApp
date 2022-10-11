import Lists = require("../models/List");

const checkOwner = async (userId: number, listId: number) => {
    const lists = await Lists.UserLists.findAll({
        where: {
            user_id: userId
        }, raw: true
    })
    let canShare = false;
    lists.forEach((l: any) => {
        if (l.list_id === listId) {
            canShare = true;
        }
    })
    return canShare
}
export {
    checkOwner
}