const controller = require('../../controllers/todo.js')
const {Router} = require('express')
const {user} = require('../../middlewares/authorization')

const router = new Router()

//router.get('/count', controller.countTodos)
router.get('/count/:filter?', user, controller.countTodos)
//router.get('/get/:order/:skip/:limit/:sortBy', controller.getTodos)
router.get('/get/:order?/:skip?/:limit?/:sortBy?/:filter?', user, controller.getTodos)
//router.get('/get/done', controller.getDoneTodos) // ska tas bort
router.get('/getOne/:id', user, controller.getTodo)
router.post('/post', user, controller.postTodo)
router.patch('/edit/:id', user, controller.editTodo)
//router.put('/done/:id', user, controller.doneTodo) // ska tas bort ????????
router.delete('/delete/:id', user, controller.deleteTodo)

module.exports = router
