const model = require('../models/user.js')
const { getTodos, countTodos } = require('../models/todo')
const bcrypt = require('bcryptjs')

function hashPassword(password) {
    return bcrypt.hashSync(password, 10)
}

function getOrder(order) {
    return order === 'true' ? -1 : 1
}

function getFilter(filter, user) {
    let filterObject = filter ? { username: new RegExp(filter, 'i') } : {}
    return filterObject
}

function getTodoFilter(filter, user) {
    let filterObject = filter ? { title: new RegExp(filter, 'i') } : {}
    if (!user.isAdmin()) {filterObject.userId = user.userId}
    return filterObject
}

function getSort(sortBy, order) {
    switch (sortBy) {
        case 'username':
            return { username: order }

        case 'createdAt':
            return { createdAt: order }

        case 'updatedAt':
            return { updatedAt: order }

        default:
            return { title: order }
    }
}

function getTodoSort(sortBy, order) {
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
    countUsers: async (req, res) => {
        let filter = getFilter(req.params.filter, req.user)
        let result = await model.countUsers(filter)

        res.status(200).json(result)
    },
    getAllUsers: async (req, res) => {
        let order = getOrder(req.params.order)
        let filter = getFilter(req.params.filter, req.user)
        let sortBy = getSort(req.params.sortBy, order)

        let results = await model.getAllUsers(sortBy, req.params.skip, req.params.limit, filter)

        if (results) {
            res.status(200).json(results)
        } else {
            res.sendStatus(404)
        } 
    },
    getUser: async (req, res) => {
        let user = await model.getUser({ _id: req.params.id })
        if (!user) { return res.sendStatus(404) }
        if (!req.user.is(user) && !req.user.isAdmin()) { return res.sendStatus(401) }

        res.status(200).json(user)
    },
    countUserTodos: async (req, res) => {
        let filter = getTodoFilter(req.params.filter, req.user)
        filter.userId = req.params.id

        let todos = await countTodos(filter)

        if (todos) {
            res.status(200).json(todos)
        } else {
            res.sendStatus(404)
        }
    },
    getUserTodos: async (req, res) => {
        let order = getOrder(req.params.order)
        let sortBy = getTodoSort(req.params.sortBy, order)
        let filter = getTodoFilter(req.params.filter, req.user)
        filter.userId = req.params.id

        let todos = await getTodos(sortBy, req.params.skip, req.params.limit, filter)

        if (todos) {
            res.status(200).json(todos)
        } else {
            res.sendStatus(404)
        }
    },
    addUser: async (req, res) => {
        if (!req.body.hasOwnProperty('username') ||
            !req.body.hasOwnProperty('password')
            ) {
                res.sendStatus(400)
        }

        let user = {
            username: req.body.username,
            password: hashPassword(req.body.password),
            role: 'user'
        }

        if (req.body.hasOwnProperty('role') &&
            req.body.role === 'admin' &&
            req.user !== undefined &&
            req.user.isAdmin()) {
                user.role = 'admin'
        }

        let success = await model.addUser(user)

        if (success) {
            res.sendStatus(201)
        } else {
            res.sendStatus(500)
        }
    },
    editUser: async (req, res) => {
        let user = await model.getUser({ _id: req.params.id })
        if (!user) { return res.sendStatus(404) }
        if (!req.user.is(user) && !req.user.isAdmin()) { return res.sendStatus(401) }
        if (!req.body.hasOwnProperty('username') &&
            !req.body.hasOwnProperty('password') &&
            !req.body.hasOwnProperty('role')) {
                res.sendStatus(400)
        }

        let updatedUser = {}

        if (req.body.hasOwnProperty('username')) {
            updatedUser.username = req.body.username
        }
        if (req.body.hasOwnProperty('password')) {
            updatedUser.password = hashPassword(req.body.password)
        }

        if (req.body.hasOwnProperty('role') && req.user.isAdmin()) {
            updatedUser.role = req.body.role
        }

        let updUser = await model.editUser(req.params.id, updatedUser)

        if (updUser === 0) {
            res.sendStatus(404)
        } else if (updUser === 1) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    },
    deleteUser: async (req, res) => {
        let user = await model.getUser({ _id: req.params.id })
        if (!user) { return res.sendStatus(404) }
        if (!req.user.is(user) && !req.user.isAdmin()) { return res.sendStatus(401) }

        let delPost = await model.deleteUser(req.params.id)

        if (delPost === 0) {
            res.sendStatus(404)
        } else if (delPost === 1) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    }
}
