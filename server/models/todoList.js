const {todoList} = require('../database/dbSetup')

function getQuery(user) {
    let query = {}
    if (!user.isAdmin()) { query.userIds = { $in: [user.userId]} }
    return query
}

module.exports = {
    clear: async () => {
        try {
            await todoList.collection.drop()
        } catch (error) {
            console.error(error)
        }
    },
    createTodoList: async (title, creatorId) => {
        try {
            const todoListObject = {
                title,
                creatorId,
                userIds: [creatorId]
            }

            return await todoList.create(todoListObject)
        } catch (error) {
            console.error(error)
        }
    },
    getTodoList: async (id) => {
        try {
            return await todoList.findOne({_id: id})
        } catch (error) {
            console.error(error)
        }
    },
    getTodoLists: async (user) => {
        try {
            const query = getQuery(user) 
            return await todoList.find(query)
        } catch (error) {
            console.error(error)
        }
    },
    countTodoLists: async (user) => {
        try {
            const query = getQuery(user)
            return await todoList.countDocuments(query)
        } catch (error) {
            console.error(error)
        }
    }
}