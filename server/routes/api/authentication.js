const controller = require('../../controllers/authentication.js')
const {Router} = require('express')
const {user} = require('../../middlewares/authorization')

const router = new Router()

router.post('/login', controller.authenticateUser)
router.get('/isLoggedIn', user, controller.isLoggedIn)

module.exports = router
