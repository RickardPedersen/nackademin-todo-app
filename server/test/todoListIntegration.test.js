require('dotenv').config()
const {connect, disconnect} = require('../database/dbSetup')
const todoListModel = require('../models/todoList')
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = require('chai')
chai.should()
const app = require('../app')
const {addUser, clearUsers, authenticateUser} = require('../models/user')

describe('Todo List Integration', function() {
    before(async function() {
        await connect()
    })

    beforeEach(async function() {
        await todoListModel.clearTodoLists()
        await clearUsers()
        const newUser = await addUser('RickardUser', '123', 'user')
        const newAdmin = await addUser('RickardAdmin', '123', 'admin')
        this.currentTest.userId = newUser._id
        this.currentTest.adminId = newAdmin._id
        const user = await authenticateUser('RickardUser', '123')
        const admin = await authenticateUser('RickardAdmin', '123')
        this.currentTest.userToken = user.token
        this.currentTest.adminToken = admin.token
    })

    it('should create todo list', async function() {
        const fields = {title: 'Test List'}
        request(app)
            .post('/api/todoLists')
            .set('Authorization', `Bearer ${this.test.userToken}`)
            .set('Content-Type', 'application/json')
            .send(fields)
            .end((err, res) => {
                expect(err).to.be.null
                res.should.have.status(201)
                res.should.be.json
                res.body.should.have.keys(['__v', '_id', 'title', 'creatorId', 'userIds', 'createdAt', 'updatedAt'])
            })
    })

    after(async function() {
        await disconnect()
    })
})
