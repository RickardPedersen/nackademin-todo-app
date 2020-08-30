const controller = require('../../controllers/todo.js')
const {Router} = require('express')
const {user} = require('../../middlewares/authorization')

const router = new Router()

router.get('/count/:filter?', user, controller.countTodos)
router.get('/get/:order?/:skip?/:limit?/:sortBy?/:filter?', user, controller.getTodos)
router.get('/getOne/:id', user, controller.getTodo)
router.post('/post', user, controller.postTodo)
router.patch('/edit/:id', user, controller.editTodo)
router.delete('/delete/:id', user, controller.deleteTodo)

module.exports = router
