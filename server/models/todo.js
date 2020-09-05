const {todo} = require('../database/dbSetup')

module.exports = {
    clearTodos: async () => {
        try {
            if (process.env.ENVIRONMENT !== 'test') {
                throw new Error('Drop collection is only allowed in test environment')
            }

            const collectionList = await todo.db.db.listCollections({name: todo.collection.name}).toArray()
            if (collectionList.length !== 0) {
                await todo.collection.drop()
            }          
        } catch (error) {
            console.error(error)
        }
    },
    countTodos: async (filter) => {
        try {
            return await todo.countDocuments(filter)
        } catch (error) {
            console.log(error)
            return false
        }   
    },
    getTodos: async (sortBy, skip, limit, filter) => {
        try {
            return await todo.find(filter)
            .collation({ locale: "sv" })
            .sort(sortBy)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        } catch (error) {
            console.log(error)
            return false
        }
    },
    getTodosByListId: async (listId) => {
        try {
            return await todo.find({listId})   
        } catch (error) {
            console.error(error)
        }
    },
    getTodo: async (id) => {
        try {
            return await todo.findOne({ _id: id })
        } catch (error) {
            console.log(error)
            return false
        }
    },
    createTodo: async (title, userId, listId) => {
        try {
            const todoObject = {
                title,
                done: false,
                userId,
                listId
            }

            return await todo.create(todoObject)
        } catch (error) {
            console.log(error)
        }
    },
    editTodo: async (id, updatedTodo) => {
        try {
            let result = await todo.updateOne({ _id: id }, { $set: updatedTodo })
            return result.n
        } catch (error) {
            console.log(error)
            return false
        }
    },
    deleteTodo: async (id) => {
        try {
            let result = await todo.deleteOne({ _id: id})
            return result.n
        } catch (error) {
            console.log(error)
            return false
        }
    }
}
