const jwt = require('jsonwebtoken')
const db = require('../database/dbSetup')

module.exports = {
    countUsers: async (filter) => {
        try {
            return await db.user.countDocuments(filter)
        } catch (error) {
            console.log(error)
            return false
        }   
    },
    getAllUsers: async (sortBy, skip, limit, filter) => {
        try {
            return await db.user.find(filter)
            .collation({ locale: "sv" })
            .sort(sortBy)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        } catch (error) {
            console.log(error)
            return false
        }
    },
    verifyToken: async (token) => {
        const payload = jwt.verify(token, process.env.SECRET)
        return {
            ...payload,
            owns(document) { return document.userId === this.userId },
            is(user) { return user._id.toString() === this.userId },
            isAdmin() { return this.role === 'admin' } }
    },
    getUser: async (filter) => {
        try {
            return await db.user.findOne(filter)
        } catch (error) {
            console.log(error)
            return false
        }
    },
    addUser: async (user) => {
        try {
            await db.user.create(user)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },
    editUser: async (id, updatedUser) => {
        try {
            let updPost = await db.user.updateOne({ _id: id },{ $set: updatedUser })
            return updPost.n
        } catch (error) {
            console.log(error)
            return false
        }
    },
    deleteUser: async (id) => {
        try {
            let delUsers = await db.user.deleteOne({ _id: id })
            return delUsers.n
        } catch (error) {
            console.log(error)
            return false
        }
    }
}
