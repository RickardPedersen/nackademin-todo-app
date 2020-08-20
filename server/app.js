const express = require('express')
const app = express()
const port = 7070

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const todos = require('./routes/api/todos')
app.use('/api/todos', todos)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
