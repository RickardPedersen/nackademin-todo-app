const userModel = require('../models/user')

module.exports = {
    authenticateUser: async (req, res) => {
        try {
            const userObject = await userModel.authenticateUser(req.body.username, req.body.password)

            if (userObject.success) {
                res.status(200).json(userObject.token)
            } else if (userObject.error === 'Wrong password') {
                res.status(401).json(userObject.error)
            } else if (userObject.error === 'Wrong username') {
                res.status(401).json(userObject.error)
            } else {
                res.sendStatus(500)
            }
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },
    isLoggedIn: async (req, res) => {
        let resObject = {
            isLoggedIn: true,
            userId: req.user.userId,
            role: req.user.role
        }
        res.status(200).json(resObject)
    }
}
