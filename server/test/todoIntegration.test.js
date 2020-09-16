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

describe('Todo Integration', function() {
    before(async function() {
        return connect()
    })

    beforeEach(async function() {
        await todoListModel.clearTodoLists()
        await clearUsers()
        const newUser = await addUser('RickardUser', '123', 'user')
        const newAdmin = await addUser('RickardAdmin', '123', 'admin')
        this.currentTest.userId = newUser._id.toString()
        this.currentTest.adminId = newAdmin._id.toString()
        const user = await authenticateUser('RickardUser', '123')
        const admin = await authenticateUser('RickardAdmin', '123')
        this.currentTest.userToken = user.token
        this.currentTest.adminToken = admin.token
    })

    it('should create todo', async function() {
        const todoList = await todoListModel.createTodoList('Test List', this.test.userId)
        const listId = todoList._id.toString()
        const fields = {title: 'Test List', listId}

        const res = await request(app)
            .post('/api/todos')
            .set('Authorization', `Bearer ${this.test.userToken}`)
            .set('Content-Type', 'application/json')
            .send(fields)

        res.should.have.status(201)
        res.should.be.json
        res.body.should.have.keys(['__v', '_id', 'title', 'done', 'userId', 'listId', 'createdAt', 'updatedAt'])
        res.body.userId.should.equal(this.test.userId)
        res.body.listId.should.equal(listId)
    })

    after(async function() {
        return disconnect()
    })
})
