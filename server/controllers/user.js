const model = require('../models/user.js')
const todoModel = require('../models/todo')
const todoListModel = require('../models/todoList')
const bcrypt = require('bcryptjs')

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const count = await model.countUsers(req.query.filter)
            const users = await model.getAllUsers(req.query.sortBy, req.query.skip, req.query.limit, req.query.descending, req.query.filter)

            const resObject = {
                count,
                data: users
            }

            res.status(200).json(resObject)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await model.getUser(req.params.id)
            if (!user) { return res.sendStatus(404) }
            if (!req.user.is(user) && !req.user.isAdmin()) { return res.sendStatus(401) }
    
            res.status(200).json(user)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },
    getUserTodos: async (req, res) => {
        try {
            const count = await todoModel.countUserTodos(req.params.id)
            const todos = await todoModel.getUserTodos(
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
    addUser: async (req, res) => {
        try {
            if (!req.body.hasOwnProperty('username') ||
                !req.body.hasOwnProperty('password')
                ) {
                    res.sendStatus(400)
            }    
    
            // check if username already exists, case insensitive
            const caseInsensitiveUsername = new RegExp(`^${req.body.username}$` ,'i')
            const existingUser = await model.getUserByUsername(caseInsensitiveUsername)
            if (existingUser) { return res.status(409).send('username already exists') }
    
            let role = 'user'
    
            if (req.body.hasOwnProperty('role') &&
                req.body.role === 'admin' &&
                req.user !== undefined &&
                req.user.isAdmin()) {
                    role = 'admin'
            }
    
            const newUser = await model.addUser(req.body.username, req.body.password, role)
            res.status(200).json(newUser)
        } catch (error) {
            console.error(error)
        }
    },
    editUser: async (req, res) => {
        try {
            const user = await model.getUser(req.params.id)
            if (!user) { return res.sendStatus(404) }
            if (!req.user.is(user) && !req.user.isAdmin()) { return res.sendStatus(401) }
            if (!req.body.hasOwnProperty('username') &&
                !req.body.hasOwnProperty('password') &&
                !req.body.hasOwnProperty('role')) {
                    res.sendStatus(400)
            }
    
            let updatedUser = {}
            
            if (req.body.hasOwnProperty('username')) {
                // check if username already exists, case insensitive
                const caseInsensitiveUsername = new RegExp(`^${req.body.username}$` ,'i')
                const existingUser = await model.getUserByUsername(caseInsensitiveUsername)
                if (existingUser) {
                    // check if existing username is your own so you can change to upper case/lower case letters
                    if (req.user.userId !== existingUser._id.toString()) {
                        return res.status(403).send('username already exists')
                    }
                }
    
                updatedUser.username = req.body.username
            }
    
            if (req.body.hasOwnProperty('password')) {
                updatedUser.password = bcrypt.hashSync(req.body.password, 10)
            }
    
            if (req.body.hasOwnProperty('role') && req.user.isAdmin()) {
                updatedUser.role = req.body.role
            }
    
            const updUser = await model.editUser(req.params.id, updatedUser)
    
            res.status(200).json(updUser)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await model.getUser(req.params.id)
            if (!user) { return res.sendStatus(404) }
            if (!req.user.is(user) && !req.user.isAdmin()) { return res.sendStatus(401) }


            const deletedTodos = await todoModel.deleteAllUserTodos(req.params.id)
            const userTodoLists = await todoListModel.getTodoListsByCreatorId(req.params.id)

            for (let todoList of userTodoLists) {
                let deletedTodoList = await todoModel.deleteAllTodoListTodos(todoList._id)
                deletedTodos.deletedCount += deletedTodoList.deletedCount
            }
            const deletedUser = await model.deleteUser(req.params.id)

            const responseObject = {
                deletedUser,
                deletedTodoListsCount: userTodoLists.length,
                deletedTodosCount: deletedTodos.deletedCount
            }
            res.status(200).json(responseObject)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }
}
