const express = require('express')
const app = express()
require('dotenv').config()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')

const cors = require('cors')
const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')

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

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })
  
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const start = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations() 
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
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use(errorHandler)

module.exports = app