const {todos} = require('../database/dbSetup')

module.exports = {
    countTodos: async () => {
        return await todos.count({ done: false })
    },
    getTodos: async (order, skip, limit, sortBy) => {
        try {
            let sortObj = {}
            if (sortBy === 'title') {
                sortObj = {
                    title: order
                }
            } else if (sortBy === 'createdDate') {
                sortObj = {
                    createdDate: order
                }
            } else if (sortBy === 'updatedDate') {
                sortObj = {
                    updatedDate: order
                }
            } else {
                sortObj = {
                    title: order
                }
            }
            console.log(sortObj)

            let results = await todos.find({ done: false })
            .sort(sortObj)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            //console.log(results)
            console.log(limit)
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
