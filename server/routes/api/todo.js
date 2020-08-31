const controller = require('../../controllers/todo.js')
const {Router} = require('express')
const {user} = require('../../middlewares/authorization')

const router = new Router()

router.get('/', user, controller.getTodos)
router.get('/:id', user, controller.getTodo)
router.post('/', user, controller.postTodo)
router.patch('/:id', user, controller.editTodo)
router.delete('/:id', user, controller.deleteTodo)

module.exports = router
