const mongoose = require('mongoose')
let mongoDatabase

async function connect() {
    try {
        switch (process.env.ENVIRONMENT) {
            case 'dev':
                await mongoose.connect('mongodb://localhost:27017/TodoAppDB_dev', { useNewUrlParser: true, useUnifiedTopology: true })
                break;

            case 'prod':
                await mongoose.connect('mongodb://localhost:27017/TodoAppDB_prod', { useNewUrlParser: true, useUnifiedTopology: true })
                break;

            case 'test':
                const {MongoMemoryServer} = require('mongodb-memory-server')
                mongoDatabase = new MongoMemoryServer()
                let uri = await mongoDatabase.getUri()
                await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})

                break;
            
            default:
                await mongoose.connect('mongodb://localhost:27017/TodoAppDB_dev', { useNewUrlParser: true, useUnifiedTopology: true })
        }
    } catch (error) {
        console.error(error)
    }
}

async function disconnect() {
    try {
        if (process.env.ENVIRONMENT === 'test') {
            await mongoDatabase.stop()
        }
        await mongoose.connection.close(() => {
            console.log('Database connection closed')
        })
    } catch (error) {
        console.error(error)
    }
}

mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
mongoose.connection.once('open', function() {
  console.log(`Connected to ${process.env.ENVIRONMENT} database`)
})

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
    },
    listId: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
)


const todoListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    creatorId: {
        type: String,
        required: true
    },
    userIds: {
        type: Array,
        required: true
    }
  },
  { timestamps: true }
)

const user = mongoose.model('user', userSchema)
const todo = mongoose.model('todo', todoSchema)
const todoList = mongoose.model('todoList', todoListSchema)

module.exports = {connect, disconnect, user, todo, todoList}
