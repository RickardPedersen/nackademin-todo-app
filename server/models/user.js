const jwt = require('jsonwebtoken')
const {user} = require('../database/dbSetup')

module.exports = {
    countUsers: async (filter) => {
        try {
            return await user.countDocuments(filter)
        } catch (error) {
            console.log(error)
            return false
        }   
    },
    getAllUsers: async (sortBy, skip, limit, filter) => {
        try {
            return await user.find(filter)
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
            return await user.findOne(filter)
        } catch (error) {
            console.log(error)
            return false
        }
    },
    addUser: async (userObject) => {
        try {
            await user.create(userObject)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },
    editUser: async (id, updatedUser) => {
        try {
            let updPost = await user.updateOne({ _id: id },{ $set: updatedUser })
            return updPost.n
        } catch (error) {
            console.log(error)
            return false
        }
    },
    deleteUser: async (id) => {
        try {
            let delUsers = await user.deleteOne({ _id: id })
            return delUsers.n
        } catch (error) {
            console.log(error)
            return false
        }
    }
}
