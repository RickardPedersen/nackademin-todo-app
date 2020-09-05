const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {user} = require('../database/dbSetup')

function getSort(sortBy, order) {
    switch (sortBy) {
        case 'username':
            return { username: order }

        case 'createdAt':
            return { createdAt: order }

        case 'updatedAt':
            return { updatedAt: order }

        default:
            return { title: order }
    }
}

module.exports = {
    clearUsers: async () => {
        try {
            if (process.env.ENVIRONMENT !== 'test') {
                throw new Error('Drop collection is only allowed in test environment')
            }

            const collectionList = await user.db.db.listCollections({name: user.collection.name}).toArray()
            if (collectionList.length !== 0) {
                await user.collection.drop()
            }          
        } catch (error) {
            console.error(error)
            throw error
        }
    },
    countUsers: async (filter = '') => {
        try {
            const query = filter ? { username: new RegExp(filter, 'i') } : {}
            return await user.countDocuments(query)
        } catch (error) {
            throw error
        }   
    },
    getAllUsers: async (sortBy = 'title', skip = 0, limit = 10, descending = 'false', filter = '') => {
        try {
            const query = filter ? { username: new RegExp(filter, 'i') } : {}
            const order = descending === 'true' ? -1 : 1
            const sortQuery = getSort(sortBy, order)

            return await user.find(query)
            .collation({ locale: "sv" })
            .sort(sortQuery)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        } catch (error) {
            throw error
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
            throw error
        }
    },
    getUser: async (id) => {
        try {
            return await user.findById(id)
        } catch (error) {
            throw error
        }
    },
    getUserByUsername: async (username) => {
        try {
            return await user.findOne({ username })
        } catch (error) {
            throw error
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
            throw error
        }
    },
    authenticateUser: async (username, password) => {
        try {
            const caseInsensitiveUsername = new RegExp(`^${username}$` ,'i')
            const userDoc = await user.findOne({username: caseInsensitiveUsername})
            if (!userDoc) { return { success: false, error: 'Wrong username' } }

            const correctPassword = bcrypt.compareSync(password, userDoc.password)
            if (!correctPassword) { return { success: false, error: 'Wrong password' } }

            const payload = { userId: userDoc._id, role: userDoc.role }
            return {
                success: true,
                token: jwt.sign(payload, process.env.SECRET, { expiresIn:'1h' })
            }
        } catch (error) {
            throw error
        }
    },
    editUser: async (id, fields) => {
        try {
            return await user.findByIdAndUpdate(id ,{ $set: fields }, { useFindAndModify: false, new: true })
        } catch (error) {
            throw error
        }
    },
    deleteUser: async (id) => {
        try {
            return await user.findByIdAndDelete(id)
        } catch (error) {
            throw error
        }
    }
}
