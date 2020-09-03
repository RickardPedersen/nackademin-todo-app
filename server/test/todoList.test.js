require('dotenv').config()
const {connect, disconnect} = require('../database/dbSetup')
const chai = require('chai')
chai.should()

describe('Todo List Model', function() {
    before(async function() {
        await connect()
    })

    it('should do something', function() {
        console.log(process.env.PORT)
    })

    after(function() {
        disconnect()
    })
})
