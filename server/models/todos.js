const {todos} = require('../database/dbSetup')

module.exports = {
    getTodos: async () => {
        try {
            let results = await todos.find({ done: false })
            return results
        } catch (error) {
            console.log(error)
            return false
        }
    },
    getDoneTodos: async () => {
        try {
            let results = await todos.find({ done: true })
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
            await todos.insert(todo)

            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },
    editTodo: async (id, updatedTodo) => {
        try {
            let result = await todos.update({ _id: id }, { $set: updatedTodo })
            return result
        } catch (error) {
            console.log(error)
            return false
        }
    },
    doneTodo: async (id, updatedTodo) => {
        try {
            let result = await todos.update({ _id: id }, { $set: updatedTodo })
            return result
        } catch (error) {
            console.log(error)
            return false
        }
    },
    deleteTodo: async (id) => {
        try {
            let result = await todos.remove({ _id: id})
            return result
        } catch (error) {
            console.log(error)
            return false
        }
    }
}
