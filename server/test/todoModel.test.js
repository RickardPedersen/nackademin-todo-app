require('dotenv').config()
const {connect, disconnect} = require('../database/dbSetup')
const todoModel = require('../models/todo')
const chai = require('chai')
const { expect } = require('chai')
chai.should()

describe('Todo Model', function() {
    before(async function() {
        return connect()
    })

    beforeEach(async function() {
        await todoModel.clearTodos()
    })

    it('should create todo', async function() {
        // Arrange
        const title = 'Test Todo'
        const userId = 'asdasdasdasdasd'
        const listId = 'kshjdfghlskdfjgh'

        // Act
        const result = await todoModel.createTodo(title, userId, listId)

        // Assert
        result.should.be.an('object')
        result.should.have.property('_id')
        result.should.have.property('done')
        result.should.have.property('title')
        result.should.have.property('userId')
        result.should.have.property('listId')
        result.should.have.property('createdAt')
        result.should.have.property('updatedAt')
    })

    it('should get todos by listId', async function() {
        // Arrange
        const title = 'Test Todo'
        const userId = 'asdasdasdasdasd'
        const listId = 'kshjdfghlskdfjgh'

        for (let i = 0, noOfTodos = 10, noOfMatchingTodos = 5; i < noOfTodos; i++) {
            if (i < noOfMatchingTodos) {
                await todoModel.createTodo(title, userId, listId)
            } else {
                await todoModel.createTodo(title, userId, 'ajkldfhaldskf')
            }
        }

        // Act
        const results = await todoModel.getTodosByListId(listId)

        // Assert
        results.should.be.an('array')
        results.length.should.equal(5)
        for (let todo of results) {
            todo.listId.should.equal(listId)
        }
    })

    it('should delete all todos matching the user id', async function() {
        // Arrange
        const title = 'Test Todo'
        const userId = 'asdasdasdasdasd'
        const listId = 'kshjdfghlskdfjgh'

        for (let i = 0, noOfTodos = 10, noOfMatchingTodos = 5; i < noOfTodos; i++) {
            if (i < noOfMatchingTodos) {
                await todoModel.createTodo(title, userId, listId)
            } else {
                await todoModel.createTodo(title, 'khfdglksjfgh', listId)
            }
        }

        // Act
        const result = await todoModel.deleteAllUserTodos(userId)

        // Assert
        result.should.be.an('object')
        result.should.have.property('n')
        result.should.have.property('ok')
        result.should.have.property('deletedCount')
        result.n.should.equal(5)
        result.ok.should.equal(1)
        result.deletedCount.should.equal(5)
    })

    it('should delete all todos in todo list', async function() {
        // Arrange
        const title = 'Test Todo'
        const userId = 'asdasdasdasdasd'
        const listId = 'kshjdfghlskdfjgh'

        for (let i = 0, noOfTodos = 10, noOfUserTodos = 6; i < noOfTodos; i++) {
            if (i < noOfUserTodos) {
                await todoModel.createTodo(title, userId, listId)
            } else {
                await todoModel.createTodo(title, userId, 'asdflkjahsdlf')
            }
        }

        // Act
        const result = await todoModel.deleteAllTodoListTodos(listId)

        // Assert
        result.should.be.an('object')
        result.should.have.property('n')
        result.should.have.property('ok')
        result.should.have.property('deletedCount')
        result.n.should.equal(6)
        result.ok.should.equal(1)
        result.deletedCount.should.equal(6)
    })

    after(async function() {
        return disconnect()
    })
})
