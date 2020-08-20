

module.exports = {
    getTodos: (req, res) => {
        res.send('Get all todos')
    },
    getTodo: (req, res) => {
        res.send('Get single todo ' + req.params.id)
    },
    postTodo: (req, res) => {
        res.send('Post todo')
    },
    putTodo: (req, res) => {
        res.send('Put todo ' + req.params.id)
    },
    deleteTodo: (req, res) => {
        res.send('Delete todo ' + req.params.id)
    }
}
