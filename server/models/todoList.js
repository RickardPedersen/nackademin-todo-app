const {todoList} = require('../database/dbSetup')

module.exports = {
    clearTodoLists: async () => {
        try {
            if (process.env.ENVIRONMENT !== 'test') {
                throw new Error('Drop collection is only allowed in test environment')
            }

            const collectionList = await todoList.db.db.listCollections({name: todoList.collection.name}).toArray()
            if (collectionList.length !== 0) {
                await todoList.collection.drop()
            }          
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
    getAllTodoLists: async () => {
        try {
            return await todoList.find({})
        } catch (error) {
            console.error(error)
        }
    },
    getTodoList: async (id) => {
        try {
            return await todoList.findById(id)
        } catch (error) {
            console.error(error)
        }
    },
    getUsersTodoLists: async (userId) => {
        try {
            return await todoList.find({ userIds: { $in: [ userId ] } })
        } catch (error) {
            console.error(error)
        }
    },
    countAllTodoLists: async () => {
        try {
            return await todoList.countDocuments({})
        } catch (error) {
            console.error(error)
        }
    },
    countUsersTodoLists: async (userId) => {
        try {
            return await todoList.countDocuments({ userIds: { $in: [ userId ] } })
        } catch (error) {
            console.error(error)
        }
    },
    editTodoList: async (id, title) => {
        try {
            return await todoList.findByIdAndUpdate(id, { title }, { useFindAndModify: false, new: true })
        } catch (error) {
            console.error(error)
        }
    },
    addMember: async (id, userId) => {
        try {
            return await todoList.findByIdAndUpdate(id, { $push: { userIds: userId } }, { useFindAndModify: false, new: true })
        } catch (error) {
            console.error(error)
        }
    },
    removeMember: async (id, userId) => {
        try {
            return await todoList.findByIdAndUpdate(id, { $pull: { userIds: userId } }, { useFindAndModify: false, new: true })
        } catch (error) {
            console.error(error)
        }
    },
    deleteTodoList: async (id) => {
        try {
            return await todoList.findByIdAndDelete(id)
        } catch (error) {
            console.error(error)
        }
    }
}
