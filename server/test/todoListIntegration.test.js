// require('dotenv').config()
// const {connect, disconnect} = require('../database/dbSetup')
// const todoListModel = require('../models/todoList')
// const chai = require('chai')
// const { expect, request } = require('chai')
// chai.should()
// const app = require('../app')
// const {addUser, clearUsers} = require('../models/user')
// //const {clearTodoLists} = require('../models/todoList')

// describe('Todo List Integration', function() {
//     before(async function() {
//         await connect()
//     })

//     beforeEach(async function() {
//         await todoListModel.clearTodoLists()
//         await clearUsers()
//         const user = await addUser('RickardUser', '123', 'user')
//         const admin = await addUser('RickardAdmin', '123', 'admin')
//         this.currentTest.userId = user._id
//         this.currentTest.adminId = admin._id
        
//     })

//     after(async function() {
//         await disconnect()
//     })
// })