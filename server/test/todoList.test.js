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

    after(async function() {
        await disconnect()
    })
})
