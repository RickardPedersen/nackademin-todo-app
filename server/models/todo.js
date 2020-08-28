const {todos} = require('../database/dbSetup')

module.exports = {
    countTodos: async (filter) => {
        try {
            return await todos.countDocuments(filter)
        } catch (error) {
            console.log(error)
            return false
        }   
    },
    getTodos: async (sortBy, skip, limit, filter) => {
        try {
            let results = await todos.find(filter)
            .collation({ locale: "sv" })
            .sort(sortBy)
            .skip(parseInt(skip))
            .limit(parseInt(limit))

            return results
        } catch (error) {
            console.log(error)
            return false
        }
    },
    getTodo: async (id) => {
        try {
            let result = await todos.findOne({ _id: id })
            return result
        } catch (error) {
            console.log(error)
            return false
        }
    },
    postTodo: async (todo) => {
        try {
            await todos.create(todo)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },
    editTodo: async (id, updatedTodo) => {
        try {
            let result = await todos.updateOne({ _id: id }, { $set: updatedTodo })
            return result.n
        } catch (error) {
            console.log(error)
            return false
        }
    },
    deleteTodo: async (id) => {
        try {
            let result = await todos.deleteOne({ _id: id})
            return result.n
        } catch (error) {
            console.log(error)
            return false
        }
    }
}
