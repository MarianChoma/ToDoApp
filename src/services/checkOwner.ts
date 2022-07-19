const ListModels = require("../models/List");
export const checkOwner = async (userId: number, listId: number) => {
    console.log("start")
    const lists = await ListModels.UserLists.findAll({
        where: {
            user_id: userId
        }, raw: true
    })
    console.log(46)
    console.log(lists)
    let canShare = false;
    lists.forEach((l: any) => {
        if (l.list_id === listId) {
            canShare = true
        }
    })
    return canShare
}
module.exports = {
    checkOwner
}