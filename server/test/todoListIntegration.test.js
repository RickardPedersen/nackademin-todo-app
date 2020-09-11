require('dotenv').config()
const {connect, disconnect} = require('../database/dbSetup')
const todoListModel = require('../models/todoList')
const todoModel = require('../models/todo')
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

    it('should get todo list by id', async function() {
        // Arrange
        const newList = await todoListModel.createTodoList('Test List', this.test.userId)
        const id = newList._id.toString()

        const res = await request(app)
            .get(`/api/todoLists/${id}`)
            .set('Authorization', `Bearer ${this.test.userToken}`)
            .set('Content-Type', 'application/json')

        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.an('object')
        res.body._id.should.equal(id)
    })

    it('should get todos by listId', async function() {
        // Arrange
        const newList = await todoListModel.createTodoList('Test List', this.test.userId)
        const listId = newList._id.toString()

        const title = 'Test List'
        const userId = 'asdasdasdasdasd'

        for (let i = 0, noOfTodos = 15, noOfMatchingTodos = 11; i < noOfTodos; i++) {
            if (i < noOfMatchingTodos) {
                await todoModel.createTodo(title, userId, listId)
            } else {
                await todoModel.createTodo(title, userId, 'ajkldfhaldskf')
            }
        }

        // Act
        const res = await request(app)
            .get(`/api/todoLists/${listId}/todos`)
            .set('Authorization', `Bearer ${this.test.userToken}`)
            .set('Content-Type', 'application/json')

        // Assert
        res.should.have.status(200)
        res.should.be.json
        res.body.count.should.be.a('number')
        res.body.data.should.be.an('array')
        res.body.count.should.equal(11)
        res.body.data.length.should.equal(10)
    })

    it('should edit todo list', async function() {
        // Arrange
        const newList = await todoListModel.createTodoList('Test List', this.test.userId)
        const id = newList._id.toString()
        const newTitle = 'Updated Title'

        // Act
        const fields = {title: newTitle, addMember: this.test.adminId}
        const res = await request(app)
            .patch(`/api/todoLists/${id}`)
            .set('Authorization', `Bearer ${this.test.userToken}`)
            .set('Content-Type', 'application/json')
            .send(fields)
        
        const fields2 = {removeMember: this.test.adminId}
        const res2 = await request(app)
            .patch(`/api/todoLists/${id}`)
            .set('Authorization', `Bearer ${this.test.adminToken}`)
            .set('Content-Type', 'application/json')
            .send(fields2)
        
        // Assert
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.an('object')
        res.body._id.should.equal(id)
        res.body.should.have.property('title')
        res.body.title.should.equal(newTitle)
        res.body.should.have.property('userIds')
        res.body.userIds.should.include(this.test.userId)
        res.body.userIds.should.include(this.test.adminId)

        res2.should.have.status(200)
        res2.should.be.json
        res2.body.should.be.an('object')
        res2.body._id.should.equal(id)
        res2.body.should.have.property('userIds')
        res2.body.userIds.should.include(this.test.userId)
        res2.body.userIds.should.not.include(this.test.adminId)
    })

    it('should delete a todo list and all todos in it', async function() {
        // Arrange
        const newList = await todoListModel.createTodoList('Test List', this.test.userId)
        const id = newList._id.toString()

        const title = 'Test List'
        const userId = 'asdasdasdasdasd'

        for (let i = 0, noOfTodos = 15, noOfUserTodos = 11; i < noOfTodos; i++) {
            if (i < noOfUserTodos) {
                await todoModel.createTodo(title, userId, id)
            } else {
                await todoModel.createTodo(title, 'asdfhlaksdjf', id)
            }
        }

        // Act
        const res = await request(app)
            .delete(`/api/todoLists/${id}`)
            .set('Authorization', `Bearer ${this.test.userToken}`)
            .set('Content-Type', 'application/json')
        
        const removed = await request(app)
            .get(`/api/todoLists/${id}`)
            .set('Authorization', `Bearer ${this.test.userToken}`)
            .set('Content-Type', 'application/json')
        
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.an('object')
        res.body.should.have.keys(['deletedTodoList', 'deletedTodosCount'])
        res.body.deletedTodoList.should.be.an('object')
        res.body.deletedTodoList.should.have.property('_id')
        res.body.deletedTodoList._id.should.equal(id)
        res.body.deletedTodosCount.should.be.a('number')
        res.body.deletedTodosCount.should.equal(15)

        removed.should.have.status(404)
    })

    after(async function() {
        await disconnect()
    })
})
