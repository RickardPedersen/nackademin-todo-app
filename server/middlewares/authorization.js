const jwt = require('jsonwebtoken')
const {verifyToken} = require('../models/user.js')

module.exports = {
    user: async (req, res, next) => {
        if (!req.headers.authorization) {
            return res.sendStatus(403)
        }
    
        const token = req.headers.authorization.replace("Bearer ", "")
        if (token === 'null') { return res.sendStatus(401) }
    
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
                console.error(error)
                res.status(500).send(resObject) 
            }
        }
    },
    admin: async (req, res, next) => {
        if (!req.headers.authorization) {
            return res.sendStatus(403)
        }
    
        const token = req.headers.authorization.replace("Bearer ", "")
        if (token === 'null') { return res.sendStatus(401) }
    
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
                console.error(error)
                res.sendStatus(500) 
            }
        }
    }
}
