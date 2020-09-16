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

describe('User Integration', function() {
    before(async function() {
        return connect()
    })

    beforeEach(async function() {
        await todoListModel.clearTodoLists()
        await todoModel.clearTodos()
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

    it('should delete a user and all the users content', async function() {
        // Arrange
        const newList = await todoListModel.createTodoList('Test List', this.test.userId)
        const listId = newList._id.toString()

        for (let i = 0, noOfTodos = 15, noOfUserTodos = 11; i < noOfTodos; i++) {
            if (i < noOfUserTodos) {
                await todoModel.createTodo('Test todo', this.test.userId, listId)
            } else {
                await todoModel.createTodo('Test todo', this.test.adminId, listId)
            }
        }

        // Act
        const res = await request(app)
            .delete(`/api/users/${this.test.userId}`)
            .set('Authorization', `Bearer ${this.test.userToken}`)
            .set('Content-Type', 'application/json')
        
        const removed = await request(app)
            .get(`/api/users/${this.test.userId}`)
            .set('Authorization', `Bearer ${this.test.userToken}`)
            .set('Content-Type', 'application/json')
        
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.an('object')
        res.body.should.have.keys(['deletedUser', 'deletedTodoListsCount', 'deletedTodosCount'])
        res.body.deletedUser.should.be.an('object')
        res.body.deletedUser.should.have.property('_id')
        res.body.deletedUser._id.should.equal(this.test.userId)
        res.body.deletedTodoListsCount.should.be.a('number')
        res.body.deletedTodoListsCount.should.equal(1)
        res.body.deletedTodosCount.should.be.a('number')
        res.body.deletedTodosCount.should.equal(15)

        removed.should.have.status(404)
    })

    after(async function() {
        return disconnect()
    })
})
