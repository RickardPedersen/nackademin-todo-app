const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {user} = require('../database/dbSetup')

module.exports = {
    clearUsers: async () => {
        try {
            const collectionList = await user.db.db.listCollections({name: user.collection.name}).toArray()
            if (collectionList.length !== 0) {
                await user.collection.drop()
            }          
        } catch (error) {
            console.error(error)
        }
    },
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
        try {
            const payload = jwt.verify(token, process.env.SECRET)
            return {
                ...payload,
                owns(document) { return document.userId === this.userId },
                is(user) { return user._id.toString() === this.userId },
                isAdmin() { return this.role === 'admin' },
                isListMember(todoList) { return todoList.userIds.includes(this.userId) },
                isListCreator(todoList) { return todoList.creatorId === this.userId }
            } 
        } catch (error) {
            console.error(error)
        }
    },
    getUser: async (filter) => {
        try {
            return await user.findOne(filter)
        } catch (error) {
            console.log(error)
            return false
        }
    },
    addUser: async (username, password, role) => {
        try {
            const userObject = {
                username,
                password: bcrypt.hashSync(password, 10),
                role
            }

            return await user.create(userObject)
        } catch (error) {
            console.error(error)
        }
    },
    authenticateUser: async (username, password) => {
        try {
            const userDoc = await user.findOne({username})
            if (!userDoc) { return { success: false, error: 'User not found' } }

            const correctPassword = bcrypt.compareSync(password, userDoc.password)
            if (!correctPassword) { return { success: false, error: 'Wrong password' } }

            const payload = { userId: userDoc._id, role: userDoc.role }
            return {
                success: true,
                //token: createToken({ userId: userDoc._id, role: userDoc.role })
                token: jwt.sign(payload, process.env.SECRET, { expiresIn:'1h' })
            }
        } catch (error) {
            console.error(error)
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
