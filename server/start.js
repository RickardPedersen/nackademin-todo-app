require('dotenv').config()
const {connect, disconnect} = require('./database/dbSetup')
const port = process.env.PORT || 7070

const app = require('./app')

const server = app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`)
    await connect()
})

function shutdown() {
    disconnect()
    server.close(() => {
        console.log('Server closed')
    })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
