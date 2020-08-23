const model = require('../models/todos.js')

function getOrder(order) {
    return order === 'true' ? -1 : 1
}

function getFilter(filter) {
    return filter ? { title: new RegExp(filter, 'i') } : {}
}

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
    countTodos: async (req, res) => {
        let filter = getFilter(req.params.filter)
        let result = await model.countTodos(filter)

        res.status(200).json(result)
    },
    getTodos: async (req, res) => {
        let order = getOrder(req.params.order)
        let filter = getFilter(req.params.filter)
        let sortBy = getSort(req.params.sortBy, order)

        let results = await model.getTodos(sortBy, req.params.skip, req.params.limit, filter)

        if (results) {
            res.status(200).json(results)
        } else {
            res.status(500).send('Internal Server Error')
        }
    },
    getDoneTodos: async (req, res) => {
        let results = await model.getDoneTodos()

        if (results) {
            res.status(200).json(results)
        } else {
            res.status(500).send('Internal Server Error')
        }
    },
    getTodo: async (req, res) => {
        let result = await model.getTodo(req.params.id)

        if (result) {
            res.status(200).json(result)
        } else {
            res.status(404).send('Not Found')
        }
    },
    postTodo: async (req, res) => {
        if (req.body.hasOwnProperty('title')) {
            let todo = {
                title: req.body.title,
                done: false
            }

            let success = await model.postTodo(todo)

            if (success) {
                res.status(201).send('Created')
            } else {
                res.status(500).send('Internal Server Error')
            }
        } else {
            res.status(400).send('Bad Request')
        }
    },
    editTodo: async (req, res) => {
        if (req.body.hasOwnProperty('title')) {
            let todo = {
                title: req.body.title
            }
    
            let updatedNum = await model.editTodo(req.params.id, todo)
    
            if (updatedNum === 0) {
                res.status(404).send('Not Found')
            } else if (updatedNum === 1) {
                res.status(200).send('OK')
            } else {
                res.status(500).send('Something went wrong')
            }
        } else {
            res.status(400).send('Bad Request')
        }
    },
    doneTodo: async (req, res) => {
        if (req.body.hasOwnProperty('done')) {
            let todo = {
                done: req.body.done
            }

            let updatedTodos = await model.doneTodo(req.params.id, todo)

            if (updatedTodos === 0) {
                res.status(404).send('Not Found')
            } else if (updatedTodos === 1) {
                res.status(200).send('OK')
            } else {
                res.status(500).send('Something went wrong')
            }
        } else {
            res.status(400).send('Bad Request')
        }
    },
    deleteTodo: async (req, res) => {
        let deletedNum = await model.deleteTodo(req.params.id)

        if (deletedNum === 0) {
            res.status(404).send('Not Found')
        } else if (deletedNum === 1) {
            res.status(200).send('OK')
        } else {
            res.status(500).send('Internal Server Error')
        }
    }
}
