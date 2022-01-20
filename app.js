const config = require('./utils/config')
const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const cors = require('cors')
const logger = require('./utils/logger')
const Blog = require('./models/blog')
const { Sequelize, QueryTypes, DataTypes, Model } = require('sequelize')


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

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    // const blogs = await Blog.findAll()
    // blogs.forEach(blog => {
    //   console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    // })
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()



app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
// eslint-disable-next-line no-undef
// if (process.env.NODE_ENV === 'test') {
//   const testingRouter = require('./controllers/testing')
//   app.use('/api/testing', testingRouter)
// }


module.exports = app