const controller = require('../../controllers/todos.js')
const {Router} = require('express')

const router = new Router()

router.get('/get', controller.getTodos)
router.get('/get/:id', controller.getTodo)
router.post('/post', controller.postTodo)
router.put('/put/:id', controller.putTodo)
router.delete('/delete/:id', controller.deleteTodo)

module.exports = router
