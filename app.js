const config = require('./utils/config')
const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const cors = require('cors')
const { Sequelize } = require('sequelize')

app.use(cors())
app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const start = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

start()

const errorHandler = (err, req, res, next) => {
  if (err.name === "SequelizeValidationError") {
    res.status(400).send(err.message)
  }
  if (err.message === "Cannot read property 'set' of null") {
    res.status(400).send(err.message)
  }
  if (err.message) {
    res.status(500).send(err.message)
  }
  next(err)
}

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(errorHandler)
module.exports = app