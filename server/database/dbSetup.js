const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/TodoAppDB', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to db')
});

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true
    }
  },
  { timestamps: true }
)

const todos = mongoose.model('todos', todoSchema)

module.exports = {todos}

/*
const Datastore = require('nedb-promises')

let db = {}
db.todos = Datastore.create('server/database/todos')
db.todos.load()

module.exports = db*/
