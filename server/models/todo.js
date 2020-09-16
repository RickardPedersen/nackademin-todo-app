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
            //await todo.deleteMany({})
            const collectionList = await todo.db.db.listCollections({name: todo.collection.name}).toArray()
            if (collectionList.length !== 0) {
                await todo.collection.drop()
            }          
        } catch (error) {
            console.error(error)
            throw error
        }
    },
    countAllTodos: async (filter = '') => {
        try {
            const query = filter ? { title: new RegExp(filter, 'i') } : {}
            return await todo.countDocuments(query)
        } catch (error) {
            throw error
        }   
    },
    countUserTodos: async (userId, filter = '') => {
        try {
            const query = filter ? { userId, title: new RegExp(filter, 'i') } : { userId }
            return await todo.countDocuments(query)
        } catch (error) {
            throw error
        } 
    },
    countTodosByListId: async (listId, filter = '') => {
        try {
            const query = filter ? { listId, title: new RegExp(filter, 'i') } : { listId }
            return await todo.countDocuments(query)
        } catch (error) {
            throw error
        }
    },
    getUserTodos: async (userId, sortBy = 'title', skip = 0, limit = 10, descending = 'false', filter = '') => {
        try {
            const query = filter ? { userId, title: new RegExp(filter, 'i') } : { userId }
            const order = descending === 'true' ? -1 : 1
            const sortQuery = getSort(sortBy, order)

            return await todo.find(query)
                .collation({ locale: "sv" })
                .sort(sortQuery)
                .skip(parseInt(skip))
                .limit(parseInt(limit))
        } catch (error) {
            throw error
        }
    },
    getAllTodos: async (sortBy = 'title', skip = 0, limit = 10, descending = 'false', filter = '') => {
        try {
            const query = filter ? { title: new RegExp(filter, 'i') } : {}
            const order = descending === 'true' ? -1 : 1
            const sortQuery = getSort(sortBy, order)

            return await todo.find(query)
                .collation({ locale: "sv" })
                .sort(sortQuery)
                .skip(parseInt(skip))
                .limit(parseInt(limit))
        } catch (error) {
            throw error
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
            throw error
        }
    },
    getTodo: async (id) => {
        try {
            return await todo.findById(id)
        } catch (error) {
            throw error
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
            throw error
        }
    },
    editTodo: async (id, title, done) => {
        try {
            let fields = {}

            if (title) {
                fields.title = title
            }

            if (typeof done === 'boolean') {
                fields.done = done
            }

            return await todo.findByIdAndUpdate(id, { $set: fields }, { useFindAndModify: false, new: true })
        } catch (error) {
            throw error
        }
    },
    deleteTodo: async (id) => {
        try {
            return await todo.findByIdAndDelete(id)
        } catch (error) {
            throw error
        }
    },
    deleteAllUserTodos: async (userId) => {
        try {
            return await todo.deleteMany({userId})
        } catch (error) {
            throw error
        }
    },
    deleteAllTodoListTodos: async (listId) => {
        try {
            return await todo.deleteMany({listId})
        } catch (error) {
            throw error
        }
    }
}
