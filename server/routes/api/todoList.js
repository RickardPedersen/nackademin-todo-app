const controller = require('../../controllers/todoList.js')
const {Router} = require('express')
const {user} = require('../../middlewares/authorization')

const router = new Router()

router.get('/', user, controller.getTodoLists)
router.get('/:id', user, controller.getTodoList)
router.post('/', user, controller.postTodoList)
router.patch('/:id', user, controller.editTodoList)
router.delete('/:id', user, controller.deleteTodoList)

module.exports = router
