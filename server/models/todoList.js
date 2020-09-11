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
            throw error
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
            throw error
        }
    },
    getAllTodoLists: async () => {
        try {
            return await todoList.find({})
        } catch (error) {
            throw error
        }
    },
    getTodoList: async (id) => {
        try {
            return await todoList.findById(id)
        } catch (error) {
            throw error
        }
    },
    getUsersTodoLists: async (userId) => {
        try {
            return await todoList.find({ userIds: { $in: [ userId ] } })
        } catch (error) {
            throw error
        }
    },
    countAllTodoLists: async () => {
        try {
            return await todoList.countDocuments({})
        } catch (error) {
            throw error
        }
    },
    countUsersTodoLists: async (userId) => {
        try {
            return await todoList.countDocuments({ userIds: { $in: [ userId ] } })
        } catch (error) {
            throw error
        }
    },
    editTodoList: async (id, title) => {
        try {
            return await todoList.findByIdAndUpdate(id, { title }, { useFindAndModify: false, new: true })
        } catch (error) {
            throw error
        }
    },
    addMember: async (id, userId) => {
        try {
            return await todoList.findByIdAndUpdate(id, { $push: { userIds: userId } }, { useFindAndModify: false, new: true })
        } catch (error) {
            throw error
        }
    },
    removeMember: async (id, userId) => {
        try {
            return await todoList.findByIdAndUpdate(id, { $pull: { userIds: userId } }, { useFindAndModify: false, new: true })
        } catch (error) {
            throw error
        }
    },
    deleteTodoList: async (id) => {
        try {
            return await todoList.findByIdAndDelete(id)
        } catch (error) {
            throw error
        }
    },
    deleteAllUsersTodoLists: async (creatorId) => {
        try {
            return await todoList.deleteMany({creatorId})
        } catch (error) {
            throw error
        }
    }
}
