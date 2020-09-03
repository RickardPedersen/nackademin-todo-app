//require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const users = require('./routes/api/user')
const authentication = require('./routes/api/authentication')
const todos = require('./routes/api/todo')

app.use('/api/users', users)
app.use('/api/authentication', authentication)
app.use('/api/todos', todos)
//console.log(process.env.ENVIRONMENT)

module.exports = app
