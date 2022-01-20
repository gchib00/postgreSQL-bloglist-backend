// eslint-disable-next-line no-unused-vars
const http = require('http')
const app = require('./app')
const config = require('./utils/config')

console.log('starting the application..')
const server = http.createServer(app)

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})