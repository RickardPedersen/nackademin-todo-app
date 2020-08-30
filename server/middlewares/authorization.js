const jwt = require('jsonwebtoken')
const secret = process.env.SECRET
const {verifyToken} = require('../models/user.js')
//const {getComment} = require('../models/comment.js')

module.exports = {
    user: async (req, res, next) => {
        if (!req.headers.authorization) {
            return res.sendStatus(403)
        }
    
        const token = req.headers.authorization.replace("Bearer ", "")
    
        try {
            req.user = await verifyToken(token)
            next()
        } catch (error) {
            let resObject = {
                isLoggedIn: false,
                error: error.message
            }

            if (error instanceof jwt.TokenExpiredError) {
                res.status(403).send(resObject)
            } else if (error.message === 'invalid token') {
                res.status(403).send(resObject)
            } else {
                console.log(error)
                res.status(500).send(resObject) 
            }
        }
    },
    admin: async (req, res, next) => {
        if (!req.headers.authorization) {
            return res.sendStatus(403)
        }
    
        const token = req.headers.authorization.replace("Bearer ", "")
    
        try {
            req.user = await verifyToken(token)
            if (req.user.role === 'admin') {
                next()
            } else {
                throw new Error('Not Admin')
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                res.status(403).send('Your token has expired')
            } else if (error.message === 'invalid token') {
                res.status(403).send(error.message)
            } else if (error.message === 'Not Admin') {
                res.status(401).send(error.message)
            } else {
                console.log(error)
                res.sendStatus(500) 
            }
        }
    }
}
