const {todo} = require('../database/dbSetup')

function getSort(sortBy, order) {
    switch (sortBy) {
        case 'title':
            return { title: order }

        case 'createdAt':
            return { createdAt: order }

        case 'updatedAt':
            return { updatedAt: order }

        default:
            return { title: order }
    }
}

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
    countTodos: async (filter = '') => {
        try {
            const query = filter ? { title: new RegExp(filter, 'i') } : {}
            return await todo.countDocuments(query)
        } catch (error) {
            console.log(error)
            return false
        }   
    },
    countTodosByListId: async (listId, filter = '') => {
        try {
            const query = filter ? { listId, title: new RegExp(filter, 'i') } : { listId }
            return await todo.countDocuments(query)
        } catch (error) {
            console.error(error)
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
    getTodosByListId: async (listId, sortBy = 'title', skip = 0, limit = 10, descending = 'false', filter = '') => {
        try {
            const query = filter ? { listId, title: new RegExp(filter, 'i') } : { listId }
            const order = descending === 'true' ? -1 : 1
            const sortQuery = getSort(sortBy, order)

            return await todo.find(query)
                .collation({ locale: "sv" })
                .sort(sortQuery)
                .skip(parseInt(skip))
                .limit(parseInt(limit))
        } catch (error) {
            //console.error(error)
            throw error
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
