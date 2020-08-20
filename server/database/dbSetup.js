const Datastore = require('nedb-promises')

let db = {}
db.todos = Datastore.create('server/database/todos')
db.todos.load()

module.exports = db
