// eslint-disable-next-line no-unused-vars
const http = require('http')
const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')
const { Sequelize, QueryTypes, DataTypes, Model } = require('sequelize')

logger.info('starting the application..')
const server = http.createServer(app)

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
},{
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blogs'
})

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    // const blogs = await sequelize.query('SELECT * FROM blogs', {type: QueryTypes.SELECT})
    const blogs = await Blog.findAll()
    blogs.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})