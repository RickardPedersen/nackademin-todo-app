require('dotenv').config()
const {connect, disconnect} = require('../database/dbSetup')
const todoListModel = require('../models/todoList')
const chai = require('chai')
const { expect } = require('chai')
chai.should()

describe('Todo List Model', function() {
    before(async function() {
        return connect()
    })

    beforeEach(async function() {
        await todoListModel.clearTodoLists()
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

    it('should get todo list by id', async function() {
        // Arrange
        const listToBefound = await todoListModel.createTodoList('Test List', 'jhaksdgfajhsdfaksjd')

        // Act
        const returnedList = await todoListModel.getTodoList(listToBefound._id)

        // Assert
        returnedList.should.be.an('object')
        returnedList._id.toString().should.equal(listToBefound._id.toString())
    })

    it('should return all todo lists', async function() {
        // Arrange
        for (let i = 0, noOfTodoLists = 10; i < noOfTodoLists; i++) {
            await todoListModel.createTodoList('Test List', 'poisufghopdisfghjdfg')
        }

        // Act
        const todoLists = await todoListModel.getAllTodoLists()

        // Assert
        todoLists.should.be.an('array')
        todoLists.length.should.equal(10)
    })

    it('should only return users todo lists', async function() {
        // Arrange
        const userId = 'jhaksdgfajhsdfaksjd'

        for (let i = 0, noOfTodoLists = 10, noOfUserLists = 2; i < noOfTodoLists; i++) {
            if (i < noOfUserLists) {
                await todoListModel.createTodoList('Test List', userId)
            } else {
                await todoListModel.createTodoList('Test List', 'akljdfshgaldskjf')
            }
        }

        // Act
        const todoLists = await todoListModel.getUsersTodoLists(userId)

        // Assert
        todoLists.should.be.an('array')
        todoLists.length.should.equal(2)
    })

    it('should get todo lists by creatorId', async function() {
        // Arrange
        const userId = 'jhaksdgfajhsdfaksjd'

        for (let i = 0, noOfTodoLists = 10, noOfUserLists = 3; i < noOfTodoLists; i++) {
            if (i < noOfUserLists) {
                await todoListModel.createTodoList('Test List', userId)
            } else {
                await todoListModel.createTodoList('Test List', 'akljdfshgaldskjf')
            }
        }

        // Act
        const todoLists = await todoListModel.getTodoListsByCreatorId(userId)

        // Assert
        todoLists.should.be.an('array')
        todoLists.length.should.equal(3)
    })

    it('should count all todo lists', async () => {
        // Arrange
        for (let i = 0, noOfTodoLists = 10; i < noOfTodoLists; i++) {
            await todoListModel.createTodoList('Test List', 'kljashdfliaskdufyl')
        }

        // Act
        const numberOfTodoLists = await todoListModel.countAllTodoLists()

        // Assert
        numberOfTodoLists.should.be.a('number')
        numberOfTodoLists.should.equal(10)
    })

    it('should count users todo lists', async function() {
        // Arrange
        const userId = 'jhaksdgfajhsdfaksjd'

        for (let i = 0, noOfTodoLists = 10, noOfUserLists = 3; i < noOfTodoLists; i++) {
            if (i < noOfUserLists) {
                await todoListModel.createTodoList('Test List', userId)
            } else {
                await todoListModel.createTodoList('Test List', 'akljdfshgaldskjf')
            }
        }

        // Act
        const numberOfTodoLists = await todoListModel.countUsersTodoLists(userId)

        // Assert
        numberOfTodoLists.should.be.a('number')
        numberOfTodoLists.should.equal(3)
    })

    it('should edit todo list title', async function() {
        // Arrange
        const newTodoList = await todoListModel.createTodoList('Test List', 'jhaksdgfajhsdfaksjd')
        const updatedTitle = 'Updated Title'

        // Act
        const updatedTodoList = await todoListModel.editTodoList(newTodoList._id, updatedTitle)

        // Assert
        updatedTodoList.should.be.an('object')
        updatedTodoList._id.toString().should.equal(newTodoList._id.toString())
        updatedTodoList.should.have.property('title')
        updatedTodoList.title.should.not.equal(newTodoList.title)
        updatedTodoList.title.should.equal(updatedTitle)
    })

    it('should add member to todo list', async function() {
        // Arrange
        const newTodoList = await todoListModel.createTodoList('Test List', 'jhaksdgfajhsdfaksjd')
        const newMemberId = 'hgisdfuogsdflgksjh'

        // Act
        const updatedTodoList = await todoListModel.addMember(newTodoList._id, newMemberId)

        // Assert
        updatedTodoList.should.be.an('object')
        updatedTodoList.userIds.should.include(newMemberId)
    })

    it('should remove member from todo list', async function() {
        // Arrange
        const newTodoList = await todoListModel.createTodoList('Test List', 'jhaksdgfajhsdfaksjd')
        const newMemberId = 'hgisdfuogsdflgksjh'

        // Act
        const updatedTodoList = await todoListModel.addMember(newTodoList._id, newMemberId)
        const removedFromList = await todoListModel.removeMember(newTodoList._id, newMemberId)

        // Assert
        updatedTodoList.should.be.an('object')
        updatedTodoList.userIds.should.include(newMemberId)
        removedFromList.should.be.an('object')
        removedFromList.userIds.should.not.include(newMemberId)
    })

    it('should delete the todo list', async function() {
        // Arrange
        const newTodoList = await todoListModel.createTodoList('Test List', 'jhaksdgfajhsdfaksjd')

        // Act
        const deletedTodoList = await todoListModel.deleteTodoList(newTodoList._id)
        const testGetTodoList = await todoListModel.getTodoList(newTodoList._id)

        // Assert
        deletedTodoList.should.be.an('object')
        deletedTodoList._id.toString().should.equal(newTodoList._id.toString())
        expect(testGetTodoList).to.be.null
    })

    it('should delete all todo lists created by the user', async function() {
        // Arrange
        const creatorId = 'jhaksdgfajhsdfaksjd'

        for (let i = 0, noOfTodoLists = 10, noOfUserLists = 2; i < noOfTodoLists; i++) {
            if (i < noOfUserLists) {
                await todoListModel.createTodoList('Test List', creatorId)
            } else {
                await todoListModel.createTodoList('Test List', 'akljdfshgaldskjf')
            }
        }

        // Act
        const result = await todoListModel.deleteAllUsersTodoLists(creatorId)

        // Assert
        result.should.be.an('object')
        result.should.have.property('n')
        result.should.have.property('ok')
        result.should.have.property('deletedCount')
        result.n.should.equal(2)
        result.ok.should.equal(1)
        result.deletedCount.should.equal(2)
    })

    after(async function() {
        return disconnect()
    })
})
