const http = require('http')
const app = require('./app')

console.log('starting the application..')
const server = http.createServer(app)

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})