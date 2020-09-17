const mongoose = require('mongoose')
let mongoDatabase
switch (process.env.ENVIRONMENT) {
    case 'test':
        const {MongoMemoryServer} = require('mongodb-memory-server')
        mongoDatabase = new MongoMemoryServer()
        break;

    case 'dev':
        mongoDatabase = {
            getUri: async () => 
                //`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
                `mongodb://localhost:27017/TodoAppDB_dev`
        }
        break;

    case 'stage':
        mongoDatabase = {
            getUri: async () => 
                `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
        }
        break;

    case 'prod':
        mongoDatabase = {
            getUri: async () => 
                `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
        }
        break;

    default:
        mongoDatabase = { 
            getUri: async () => 
                `mongodb://localhost:27017/TodoAppDB_dev`
                //`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
        }
}

async function connect() {
    try {
        const uri = await mongoDatabase.getUri()
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
    } catch (error) {
        console.error(error)
    }
}

async function disconnect() {
    try {
        await mongoose.connection.close(() => { console.log('Disconnected from database') })
        if (process.env.ENVIRONMENT === 'test') {
            await mongoDatabase.stop()
        }
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
        required: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        required: true,
        minlength: 1,
    }
  },
  { timestamps: true }
)

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
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
        required: true,
        minlength: 1,
        maxlength: 20
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
