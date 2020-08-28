const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/TodoAppDB', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to db')
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
)

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true
    },
    userId: {
        type: String,
        required: true
    }/*,
    listId: { // listans objectId _id
        type: String,
        required: true
    }*/
  },
  { timestamps: true }
)

/*
const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: String
    },
    userIds: { // list of user _id (plural)
        type: Array,
        required: true
    }
  },
  { timestamps: true }
) */

const user = mongoose.model('user', userSchema)
const todos = mongoose.model('todos', todoSchema)

module.exports = {user, todos}

/*
const Datastore = require('nedb-promises')

let db = {}
db.todos = Datastore.create('server/database/todos')
db.todos.load()

module.exports = db*/
