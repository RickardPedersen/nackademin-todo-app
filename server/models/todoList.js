const {todoList} = require('../database/dbSetup')

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
    }
}