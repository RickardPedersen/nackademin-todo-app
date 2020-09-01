const model = require('../models/todo.js')

function getOrder(order) {
    return order === 'true' ? -1 : 1
}

function getFilter(filter, user) {
    let filterObject = filter ? { title: new RegExp(filter, 'i') } : {}
    if (!user.isAdmin()) {filterObject.userId = user.userId}
    return filterObject
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
    getTodos: async (req, res) => {
        let order = getOrder(req.query.order)
        let filter = getFilter(req.query.filter, req.user)
        let sortBy = getSort(req.query.sortBy, order)
        let skip = req.query.skip || 0
        let limit = req.query.limit || 5

        let count = await model.countTodos(filter)
        let todos = await model.getTodos(sortBy, skip, limit, filter)

        if (todos) {
            let resObject = {
                count,
                data: todos
            }
            res.status(200).json(resObject)
        } else {
            res.sendStatus(500)
        }
    },
    getTodo: async (req, res) => {
        let todo = await model.getTodo(req.params.id)
        if (!todo) { return res.sendStatus(404) }
        if (!req.user.owns(todo) && !req.user.isAdmin()) { return res.sendStatus(401) }

        res.status(200).json(todo)
    },
    postTodo: async (req, res) => {
        if (!req.body.hasOwnProperty('title')) { return res.sendStatus(400) }

        let todo = {
            title: req.body.title,
            done: false,
            userId: req.user.userId
        }

        let success = await model.postTodo(todo)
        if (success) {
            res.sendStatus(201)
        } else {
            res.sendStatus(500)
        }
    },
    editTodo: async (req, res) => {
        let todo = await model.getTodo(req.params.id)
        if (!todo) { return res.sendStatus(404) }
        if (!req.user.owns(todo) && !req.user.isAdmin()) { return res.sendStatus(401) }
        if (!req.body.hasOwnProperty('title') &&
            !req.body.hasOwnProperty('done')) {
                return res.sendStatus(400)
            }

        let updatedTodo = {}

        if (req.body.hasOwnProperty('title')) {
            updatedTodo.title = req.body.title
        }

        if (req.body.hasOwnProperty('done')) {
            updatedTodo.done = req.body.done
        }

        let updatedNum = await model.editTodo(req.params.id, updatedTodo)

        if (updatedNum === 0) {
            res.sendStatus(404)
        } else if (updatedNum === 1) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    },
    deleteTodo: async (req, res) => {
        let todo = await model.getTodo(req.params.id)
        if (!todo) { return res.sendStatus(404) }
        if (!req.user.owns(todo) && !req.user.isAdmin()) { return res.sendStatus(401) }

        let deletedNum = await model.deleteTodo(req.params.id)

        if (deletedNum === 0) {
            res.sendStatus(404)
        } else if (deletedNum === 1) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    }
}
