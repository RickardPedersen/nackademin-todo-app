const controller = require('../../controllers/todoList.js')
const {Router} = require('express')
const {user} = require('../../middlewares/authorization')

const router = new Router()

router.post('/', user, controller.postTodoList)
router.get('/', user, controller.getTodoLists)
router.get('/:id', user, controller.getTodoList)
//router.patch('/:id', user, controller.editTodo)
//router.delete('/:id', user, controller.deleteTodo)

module.exports = router