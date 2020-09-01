const { getUser } = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function createToken(payload) {
    return jwt.sign(payload, process.env.SECRET, { expiresIn:'1h' })
}

module.exports = {
    authenticateUser: async (req, res) =>{
        const caseInsensitiveUsername = new RegExp(`^${req.body.username}$` ,'i')
        const user = await getUser({ username: caseInsensitiveUsername })
        if (!user) { return res.sendStatus(404) } 
        //let user = await getUser({ username: req.body.username })

        const correctPassword = bcrypt.compareSync(req.body.password, user.password)
        if (correctPassword) {
            let token = createToken({ userId: user._id, role: user.role })
            res.status(200).json(token)
        } else {
            res.status(403).send('Wrong Password')
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
