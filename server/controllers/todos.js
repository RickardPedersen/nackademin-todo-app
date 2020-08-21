const model = require('../models/todos.js')

module.exports = {
    countTodos: async (req, res) => {
        let result = await model.countTodos()
        console.log(result)
        res.json(result)
    },
    getTodos: async (req, res) => {
        let order = 1
        if (req.params.order === 'true') {
            order = -1
        }


        let results = await model.getTodos(order, req.params.skip, req.params.limit, req.params.sortBy)

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

        if (req.body.hasOwnProperty('title') &&
            typeof req.body.title === 'string'
            ) {
            let todo = {
                title: req.body.title,
                done: false,
                createdDate: new Date(),
                updatedDate: new Date(),
                dueDate: new Date()
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
        if (req.body.hasOwnProperty('title') &&
            typeof req.body.title === 'string'
            ) {
            let todo = {
                title: req.body.title,
                updatedDate: new Date()
            }

            let updatedTodos = await model.editTodo(req.params.id, todo)

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
    doneTodo: async (req, res) => {
        if (req.body.hasOwnProperty('done') &&
            typeof req.body.done === 'boolean'
            ) {
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
            console.log(typeof req.body.title)
            res.status(400).send('Bad Request')
        }
    },
    deleteTodo: async (req, res) => {
        let deletedPosts = await model.deleteTodo(req.params.id)

        if (deletedPosts === 0) {
            res.status(404).send('Not Found')
        } else if (deletedPosts === 1) {
            res.status(200).send('OK')
        } else {
            res.status(500).send('Internal Server Error')
        }
    }
}
