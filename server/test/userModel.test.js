require('dotenv').config()
const {connect, disconnect} = require('../database/dbSetup')
const userModel = require('../models/user')
const chai = require('chai')
const { expect } = require('chai')
chai.should()

describe('User Model', function() {
    before(async function() {
        await connect()
    })

    beforeEach(async function() {
        await userModel.clearUsers()
    })

    it('should create a user', async function() {
        // Arrange
        const username = 'Rickard'
        const password = '123'
        const role = 'user'

        // Act
        const user = await userModel.addUser(username, password, role)

        // Assert
        user.should.be.an('object')
        user.should.have.property('_id')
        user.should.have.property('username')
        user.should.have.property('password')
        user.should.have.property('role')
        user.should.have.property('createdAt')
        user.should.have.property('updatedAt')
    })

    it('should authenticate user', async function() {
        // Arrange
        const username = 'Rickard'
        const password = '123'
        const role = 'user'
        await userModel.addUser(username, password, role)

        // Act
        const result = await userModel.authenticateUser(username, password)

        // Assert
        result.should.be.an('object')
        result.should.have.property('success')
        result.success.should.be.true
        result.should.have.property('token')
        result.token.should.be.a('string')
    })

    it('should verify token', async function() {
        // Arrange
        const username = 'Rickard'
        const password = '123'
        const role = 'user'
        const newUser = await userModel.addUser(username, password, role)
        const {token} = await userModel.authenticateUser(username, password)
 
        // Act
        const user = await userModel.verifyToken(token)

        // Assert
        user.should.be.an('object')
        user.userId.should.equal(newUser._id.toString())
    })

    after(async function() {
        await disconnect()
    })
})
