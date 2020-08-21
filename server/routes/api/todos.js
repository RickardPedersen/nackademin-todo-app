const controller = require('../../controllers/todos.js')
const {Router} = require('express')

const router = new Router()

router.get('/count', controller.countTodos)
router.get('/get/:order/:skip/:limit/:sortBy', controller.getTodos)
router.get('/get/done', controller.getDoneTodos)
router.get('/getOne/:id', controller.getTodo)
router.post('/post', controller.postTodo)
router.put('/edit/:id', controller.editTodo)
router.put('/done/:id', controller.doneTodo)
router.delete('/delete/:id', controller.deleteTodo)

module.exports = router
