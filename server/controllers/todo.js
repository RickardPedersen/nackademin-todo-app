const model = require('../models/todo.js')

module.exports = {
    getTodos: async (req, res) => {      
        try {
            let resObject = {
                count: 0,
                data: []
            }

            if (req.user.isAdmin()) {
                resObject.count = await model.countAllTodos(req.query.filter)
                resObject.data = await model.getAllTodos(
                    req.query.sortBy,
                    req.query.skip,
                    req.query.limit,
                    req.query.descending,
                    req.query.filter
                )
            } else {
                resObject.count = await model.countUserTodos(req.user.userId)
                resObject.data = await model.getUserTodos(
                    req.user.userId,
                    req.query.sortBy,
                    req.query.skip,
                    req.query.limit,
                    req.query.descending,
                    req.query.filter
                )
            }

            res.status(200).json(resObject)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },
    getTodo: async (req, res) => {
        try {
            const todo = await model.getTodo(req.params.id)
            if (!todo) { return res.sendStatus(404) }
            if (!req.user.owns(todo) && !req.user.isAdmin()) { return res.sendStatus(401) }
    
            res.status(200).json(todo) 
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },
    postTodo: async (req, res) => {
        try {
            if (!req.body.hasOwnProperty('title') ||
                !req.body.hasOwnProperty('listId')) {
                return res.sendStatus(400)
            }
            // TODO: check if todo list exists here
    
            const todo = await model.createTodo(req.body.title, req.user.userId, req.body.listId)
            res.status(201).json(todo)   
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },
    editTodo: async (req, res) => {
        try {
            const todo = await model.getTodo(req.params.id)
            if (!todo) { return res.sendStatus(404) }
            if (!req.user.owns(todo) && !req.user.isAdmin()) { return res.sendStatus(401) }
            if (!req.body.hasOwnProperty('title') &&
                !req.body.hasOwnProperty('done')) {
                    return res.sendStatus(400)
                }
    
            const updatedTodo = await model.editTodo(req.params.id, req.body.title, req.body.done)
            res.status(200).json(updatedTodo)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },
    deleteTodo: async (req, res) => {
        try {
            const todo = await model.getTodo(req.params.id)
            if (!todo) { return res.sendStatus(404) }
            if (!req.user.owns(todo) && !req.user.isAdmin()) { return res.sendStatus(401) }
    
            const deletedTodo = await model.deleteTodo(req.params.id)
            res.status(200).json(deletedTodo)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }
}
