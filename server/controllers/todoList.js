const model = require('../models/todoList')

module.exports = {
    postTodoList: async (req, res) => {
        if (!req.body.hasOwnProperty('title')) { return res.sendStatus(400) }
        const newList = await model.createTodoList(req.body.title, req.user.userId)
        res.status(201).json(newList)
    }
}