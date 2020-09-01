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
    getAllUsers: async (req, res) => {
        let order = getOrder(req.query.order)
        let filter = getFilter(req.query.filter, req.user)
        let sortBy = getSort(req.query.sortBy, order)
        let skip = req.query.skip || 0
        let limit = req.query.limit || 5

        let count = await model.countUsers(filter)
        let users = await model.getAllUsers(sortBy, skip, limit, filter)

        if (users) {
            let resObject = {
                count,
                data: users
            }
            res.status(200).json(resObject)
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
    getUserTodos: async (req, res) => {
        let skip = req.query.skip || 0
        let limit = req.query.limit || 5
        let order = getOrder(req.query.order)
        let sortBy = getTodoSort(req.query.sortBy, order)
        let filter = getTodoFilter(req.query.filter, req.user)
        filter.userId = req.params.id

        let count = await countTodos(filter)
        let todos = await getTodos(sortBy, skip, limit, filter)

        if (todos) {
            let resObject = {
                count,
                data: todos
            }
            res.status(200).json(resObject)
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

        // check if username already exists, case insensitive
        const caseInsensitiveUsername = new RegExp(`^${req.body.username}$` ,'i')
        const existingUser = await model.getUser({ username: caseInsensitiveUsername })
        if (existingUser) { return res.status(403).send('username already exists') }

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
            // check if username already exists, case insensitive
            const caseInsensitiveUsername = new RegExp(`^${req.body.username}$` ,'i')
            const existingUser = await model.getUser({ username: caseInsensitiveUsername })
            if (existingUser) {
                // check if existing username is your own so you can change to upper case/lower case letters
                if (req.user.userId !== existingUser._id.toString()) {
                    return res.status(403).send('username already exists')
                }
            }

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
