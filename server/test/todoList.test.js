require('dotenv').config()
const {connect, disconnect} = require('../database/dbSetup')
const todoListModel = require('../models/todoList')
const chai = require('chai')
chai.should()

describe('Todo List Model', function() {
    before(async function() {
        await connect()
    })

    beforeEach(async function() {
        await todoListModel.clear()
    })

    it('should create a todo list', async function() {
        // Arrange
        const title = 'Test List'
        const creatorId = 'asdasdasdasdasd'

        // Act
        const result = await todoListModel.createTodoList(title, creatorId)

        // Assert
        result.should.be.an('object')
        result.should.have.property('_id')
        result.should.have.property('title')
        result.should.have.property('creatorId')
        result.should.have.property('userIds')
        result.should.have.property('createdAt')
        result.should.have.property('updatedAt')
    })

    it('should get todo list by _id', async function() {
        // Arrange
        const listToBefound = await todoListModel.createTodoList('Test List', 'jhaksdgfajhsdfaksjd')
        await todoListModel.createTodoList('Test List', 'jhaksdgfajhsdfaksjd')
        await todoListModel.createTodoList('Test List', 'jhaksdgfajhsdfaksjd')

        // Act
        const returnedList = await todoListModel.getTodoList(listToBefound._id.toString())

        // Assert
        returnedList.should.be.an('object')
        returnedList._id.toString().should.equal(listToBefound._id.toString())
    })

    it('should return users todo lists or all todo lists if admin', async function() {
        // Arrange
        const user = {
            userId: 'jhaksdgfajhsdfaksjd',
            role: 'user',
            isAdmin() { return this.role === 'admin' }
        }

        const admin = {
            userId: 'yiuoashdflkasjdf',
            role: 'admin',
            isAdmin() { return this.role === 'admin' }
        }

        await todoListModel.createTodoList('Test List', user.userId)
        await todoListModel.createTodoList('Test List', user.userId)
        await todoListModel.createTodoList('Test List', admin.userId)
        await todoListModel.createTodoList('Test List', admin.userId)
        await todoListModel.createTodoList('Test List', 'kljashdfliaskdufyl')

        // Act
        const userLists = await todoListModel.getTodoLists(user)
        const adminLists = await todoListModel.getTodoLists(admin)

        // Assert
        userLists.should.be.an('array')
        userLists.length.should.equal(2)
        adminLists.should.be.an('array')
        adminLists.length.should.equal(5)
    })

    after(async function() {
        await disconnect()
    })
})
