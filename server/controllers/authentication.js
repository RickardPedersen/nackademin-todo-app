const { getUser } = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function createToken(payload) {
    return jwt.sign(payload, process.env.SECRET, { expiresIn:'1h' })
}

module.exports = {
    authenticateUser: async (req, res) =>{
        let user = await getUser({ username: req.body.username })
        console.log(user)

        if (user) {
            const correctPassword = bcrypt.compareSync(req.body.password, user.password)
            if (correctPassword) {
                let token = createToken({ userId: user._id, role: user.role })
                console.log(token)
                res.status(200).json(token)
            } else {
                res.status(403).send('Wrong Password')
            }
    
            //res.status(200).json(user)
        } else {
            res.status(404).send('Not Found')
        } 
    },
    isLoggedIn: async (req, res) => {
        console.log(req.user)

        let resObject = {
            isLoggedIn: true,
            userId: req.user.userId,
            role: req.user.role
        }
        res.status(200).json(resObject)
    }
}
