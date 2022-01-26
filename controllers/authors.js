const authorsRouter = require('express').Router()
const { sequelize } = require('../models/blog')
const { Blog } = require('../models/models')

authorsRouter.get('/', async (req, res, next) => {
  const author = req.body.author
  try {
    const authors = await Blog.findAll({ 
      group: 'author',
      attributes: [
        'author', 
        [sequelize.fn('SUM', sequelize.col('likes')), 'total_likes'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'articles']
      ] 
    })
    res.status(200).send(authors)  
  } catch(err) {
    next(err)
  }
})

module.exports = authorsRouter