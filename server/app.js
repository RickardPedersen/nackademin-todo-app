require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

const users = require('./routes/api/user')
const authentication = require('./routes/api/authentication')
const todos = require('./routes/api/todo')
const todoLists = require('./routes/api/todoList')

app.use('/api/users', users)
app.use('/api/authentication', authentication)
app.use('/api/todos', todos)
app.use('/api/todoLists', todoLists)

module.exports = app
