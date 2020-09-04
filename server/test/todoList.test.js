require('dotenv').config()
const {connect, disconnect} = require('../database/dbSetup')
const todoListModel = require('../models/todoList')
const chai = require('chai')
const { expect } = require('chai')
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

    it('should get todo list by id', async function() {
        // Arrange
        const listToBefound = await todoListModel.createTodoList('Test List', 'jhaksdgfajhsdfaksjd')
        await todoListModel.createTodoList('Test List', 'jhaksdgfajhsdfaksjd')
        await todoListModel.createTodoList('Test List', 'jhaksdgfajhsdfaksjd')

        // Act
        const returnedList = await todoListModel.getTodoList(listToBefound._id)

        // Assert
        returnedList.should.be.an('object')
        returnedList._id.toString().should.equal(listToBefound._id.toString())
    })

    it('should return all todos', async function() {
        // Arrange
        await todoListModel.createTodoList('Test List', 'poisufghopdisfghjdfg')
        await todoListModel.createTodoList('Test List', 'cvbncvbnpoidghujos')
        await todoListModel.createTodoList('Test List', 'kjlghnlkdgfjhnlkdh')
        await todoListModel.createTodoList('Test List', '98fh7frho8a8lw473rfjaw')
        await todoListModel.createTodoList('Test List', 'klsdjfghlsk43543rt4')

        // Act
        const todoLists = await todoListModel.getAllTodoLists()

        // Assert
        todoLists.should.be.an('array')
        todoLists.length.should.equal(5)
    })

    it('should return users todo lists', async function() {
        // Arrange
        const userId = 'jhaksdgfajhsdfaksjd'

        await todoListModel.createTodoList('Test List', userId)
        await todoListModel.createTodoList('Test List', userId)
        await todoListModel.createTodoList('Test List', 'akljdfshgaldskjf')
        await todoListModel.createTodoList('Test List', 'asldkjfhalksdhflkjahdsf')
        await todoListModel.createTodoList('Test List', 'kljashdfliaskdufyl')

        // Act
        const todoLists = await todoListModel.getUsersTodoLists(userId)

        // Assert
        todoLists.should.be.an('array')
        todoLists.length.should.equal(2)
    })

    it('should count all todo lists', async () => {
        // Arrange
        await todoListModel.createTodoList('Test List', 'kljashdfliaskdufyl')
        await todoListModel.createTodoList('Test List', 'pghsdfigosidfug')
        await todoListModel.createTodoList('Test List', 'kljashdfliaskdufyl')
        await todoListModel.createTodoList('Test List', 'pghsdfigosidfug')
        await todoListModel.createTodoList('Test List', 'kljashdfliaskdufyl')
        await todoListModel.createTodoList('Test List', 'pghsdfigosidfug')

        // Act
        const numberOfTodoLists = await todoListModel.countAllTodoLists()

        // Assert
        numberOfTodoLists.should.be.a('number')
        numberOfTodoLists.should.equal(6)
    })

    it('should count users todo lists', async function() {
        // Arrange
        const userId = 'jhaksdgfajhsdfaksjd'

        await todoListModel.createTodoList('Test List', userId)
        await todoListModel.createTodoList('Test List', userId)
        await todoListModel.createTodoList('Test List', userId)
        await todoListModel.createTodoList('Test List', 'kljashdfliaskdufyl')
        await todoListModel.createTodoList('Test List', 'pghsdfigosidfug')

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

    after(async function() {
        await disconnect()
    })
})
