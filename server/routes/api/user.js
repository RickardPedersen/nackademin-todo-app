const controller = require('../../controllers/user.js')
const {Router} = require('express')
const {user, admin} = require('../../middlewares/authorization')

const router = new Router()

router.get('/count/:filter?', admin, controller.countUsers)
router.get('/user/:id/todos', admin, controller.getUserTodos)
router.get('/getOne/:id', user, controller.getUser)
router.get('/:order?/:skip?/:limit?/:sortBy?/:filter?', admin, controller.getAllUsers)
router.post('/', controller.addUser)
router.patch('/:id', user, controller.editUser)
router.delete('/:id', user, controller.deleteUser)

module.exports = router
