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
        this.currentTest.userId = newUser._id.toString()
        this.currentTest.adminId = newAdmin._id.toString()
        const user = await authenticateUser('RickardUser', '123')
        const admin = await authenticateUser('RickardAdmin', '123')
        this.currentTest.userToken = user.token
        this.currentTest.adminToken = admin.token
    })

    it('should create todo list', function() {
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

    it('should get all users todo lists (if user)', async function() {
        // Arrange
        for (let i = 0, noOfTodoLists = 10, noOfUserLists = 5; i < noOfTodoLists; i++) {
            if (i < noOfUserLists) {
                await todoListModel.createTodoList('Test List', this.test.userId)
            } else {
                await todoListModel.createTodoList('Test List', this.test.adminId)
            }
        }

        // Act
        const res = await request(app)
            .get('/api/todoLists')
            .set('Authorization', `Bearer ${this.test.userToken}`)
            .set('Content-Type', 'application/json')

        // Assert
        res.should.have.status(200)
        res.should.be.json
        res.body.count.should.be.a('number')
        res.body.data.should.be.an('array')
        res.body.count.should.equal(5)
        res.body.count.should.equal(res.body.data.length)
    })

    it('should get all todo lists (if admin)', async function() {
        // Arrange
        for (let i = 0, noOfTodoLists = 10, noOfUserLists = 5; i < noOfTodoLists; i++) {
            if (i < noOfUserLists) {
                await todoListModel.createTodoList('Test List', this.test.userId)
            } else {
                await todoListModel.createTodoList('Test List', this.test.adminId)
            }
        }

        // Act
        const res = await request(app)
            .get('/api/todoLists')
            .set('Authorization', `Bearer ${this.test.adminToken}`)
            .set('Content-Type', 'application/json')

        // Assert
        res.should.have.status(200)
        res.should.be.json
        res.body.count.should.be.a('number')
        res.body.data.should.be.an('array')
        res.body.count.should.equal(10)
        res.body.count.should.equal(res.body.data.length)
    })

    after(async function() {
        await disconnect()
    })
})
