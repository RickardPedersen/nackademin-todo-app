const controller = require('../../controllers/user.js')
const {Router} = require('express')
const {user, admin} = require('../../middlewares/authorization')

const router = new Router()

router.get('/', admin, controller.getAllUsers)
router.get('/:id', user, controller.getUser)
router.get('/:id/todos', admin, controller.getUserTodos)
router.post('/', controller.addUser)
router.patch('/:id', user, controller.editUser)
router.delete('/:id', user, controller.deleteUser)

module.exports = router
