const model = require('../models/todoList')

module.exports = {
    postTodoList: async (req, res) => {
        if (!req.body.hasOwnProperty('title')) { return res.sendStatus(400) }
        const newList = await model.createTodoList(req.body.title, req.user.userId)
        res.status(201).json(newList)
    },
    getTodoLists: async (req, res) => {
        let resObject = {
            count: 0,
            data: []
        }
        let status = 200

        if (req.user.isAdmin()) {
            resObject.count = await model.countAllTodoLists()
            resObject.data = await model.getAllTodoLists()
        } else {
            resObject.count = await model.countUsersTodoLists(req.user.userId)
            resObject.data = await model.getUsersTodoLists(req.user.userId)
        }

        if (resObject.data.length === 0) { status = 404 }

        res.status(status).json(resObject)
    },
    getTodoList: async (req, res) => {
        const todoList = await model.getTodoList(req.params.id)
        if (!todoList) { return res.sendStatus(404) }
        if (!req.user.isAdmin() && !req.user.isListMember(todoList)) { return res.sendStatus(403) }
        res.status(200).json(todoList)
    },
    editTodoList: async (req, res) => {
        if (!req.body.hasOwnProperty('title') &&
            !req.body.hasOwnProperty('addMember') &&
            !req.body.hasOwnProperty('removeMember')) {
                return res.sendStatus(400)
            }

        const todoList = await model.getTodoList(req.params.id)
        if (!todoList) { return res.sendStatus(404) }
        if (!req.user.isAdmin() && !req.user.isListCreator(todoList)) { return res.sendStatus(403) }

        let resObject = {}
        if (req.body.hasOwnProperty('title')) { resObject = await model.editTodoList(req.params.id, req.body.title)}
        if (req.body.hasOwnProperty('addMember')) { resObject = await model.addMember(req.params.id, req.body.addMember)}
        if (req.body.hasOwnProperty('removeMember')) { resObject = await model.removeMember(req.params.id, req.body.removeMember)}

        res.status(200).json(resObject)
    },
    deleteTodoList: async (req, res) => {
        const todoList = await model.getTodoList(req.params.id)
        if (!todoList) { return res.sendStatus(404) }
        if (!req.user.isAdmin() && !req.user.isListCreator(todoList)) { return res.sendStatus(403) }
        const result = await model.deleteTodoList(req.params.id)
        res.status(200).json(result)
    }
}