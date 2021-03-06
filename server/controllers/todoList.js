const model = require('../models/todoList')
const todoModel = require('../models/todo')

module.exports = {
    postTodoList: async (req, res) => {
        try {
            if (!req.body.hasOwnProperty('title')) { return res.sendStatus(400) }
            const newList = await model.createTodoList(req.body.title, req.user.userId)
            res.status(201).json(newList) 
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },
    getTodoLists: async (req, res) => {
        try {
            let resObject = {
                count: 0,
                data: []
            }

            if (req.user.isAdmin()) {
                resObject.count = await model.countAllTodoLists()
                resObject.data = await model.getAllTodoLists()
            } else {
                resObject.count = await model.countUsersTodoLists(req.user.userId)
                resObject.data = await model.getUsersTodoLists(req.user.userId)
            }

            res.status(200).json(resObject)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },
    getTodoList: async (req, res) => {
        try {
            const todoList = await model.getTodoList(req.params.id)
            if (!todoList) { return res.sendStatus(404) }
            if (!req.user.isAdmin() && !req.user.isListMember(todoList)) { return res.sendStatus(403) }
            res.status(200).json(todoList)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },
    getTodosByListId: async (req, res) => {
        try {
            const todoList = await model.getTodoList(req.params.id)
            if (!todoList) { return res.sendStatus(404) }
            if (!req.user.isAdmin() && !req.user.isListMember(todoList)) { return res.sendStatus(403) }
    
            const count = await todoModel.countTodosByListId(req.params.id, req.query.filter)
            const todos = await todoModel.getTodosByListId(
                req.params.id,
                req.query.sortBy,
                req.query.skip,
                req.query.limit,
                req.query.descending,
                req.query.filter
            )

            const resObject = {
                count,
                data: todos
            }

            res.status(200).json(resObject)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },
    editTodoList: async (req, res) => {
        try {
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
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },
    deleteTodoList: async (req, res) => {
        try {
            const todoList = await model.getTodoList(req.params.id)
            if (!todoList) { return res.sendStatus(404) }
            if (!req.user.isAdmin() && !req.user.isListCreator(todoList)) { return res.sendStatus(403) }

            const deletedTodos = await todoModel.deleteAllTodoListTodos(req.params.id)
            const deletedTodoList = await model.deleteTodoList(req.params.id)

            const responseObject = {
                deletedTodoList,
                deletedTodosCount: deletedTodos.deletedCount
            }
            res.status(200).json(responseObject)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }
}
