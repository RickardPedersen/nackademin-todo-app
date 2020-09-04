const model = require('../models/todoList')

module.exports = {
    postTodoList: async (req, res) => {
        if (!req.body.hasOwnProperty('title')) { return res.sendStatus(400) }
        const newList = await model.createTodoList(req.body.title, req.user.userId)
        res.status(201).json(newList)
    },
    getTodoLists: async (req, res) => {
        if (req.user.isAdmin()) {
            const count = await model.countAllTodoLists()
            const todoLists = await model.getAllTodoLists()
            res.status(200).json({count, data: todoLists})
        } else {
            const count = await model.countUsersTodoLists(req.user.userId)
            const todoLists = await model.getUsersTodoLists(req.user.userId)
            res.status(200).json({count, data: todoLists})
        }
    },
    getTodoList: async (req, res) => {
        const todoList = await model.getTodoList(req.params.id)
        if (!req.user.isAdmin() && !req.user.isListMember(todoList)) { return res.sendStatus(403) }
        res.status(200).json(todoList)
    }
}