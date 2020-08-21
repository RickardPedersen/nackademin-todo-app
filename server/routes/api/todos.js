const controller = require('../../controllers/todos.js')
const {Router} = require('express')

const router = new Router()

router.get('/get/:order', controller.getTodos)
router.get('/get/done', controller.getDoneTodos)
router.get('/getOne/:id', controller.getTodo)
router.post('/post', controller.postTodo)
router.put('/edit/:id', controller.editTodo)
router.put('/done/:id', controller.doneTodo)
router.delete('/delete/:id', controller.deleteTodo)

module.exports = router
