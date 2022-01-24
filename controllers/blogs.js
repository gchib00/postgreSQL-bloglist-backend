const blogsRouter = require('express').Router()
const { Blog, User } = require('../models/models')
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken')

//middleware that checks if user is logged in:
const isAuthenticated = (req, res, next) => {
  const token = req.get('Authorization')
  if (token && token.toLowerCase().startsWith('bearer')) {
    try {
      //jwt for user is created using an object that contains username+id, so decoding the token will give us that original object:
      req.loggedUser = jwt.verify(token.substring(7), process.env.SECRET)
    } catch(err) {
      next(err)
    }
  } else {
    res.status(401).send('you need to be authorized in order to perform this action')
  }
  next()
}
blogsRouter.get('/', async (req, res, next) => {
  let where = {}
  const searchedStr = req.query.search
  if (searchedStr) {
    where = {
      [Op.or]: [
        { title: {[Op.iLike]: '%'+searchedStr+'%'} },
        { author: {[Op.iLike]: '%'+searchedStr+'%'} }
      ]
    }
  }
  try {
    const blogs = await Blog.findAll({where})
    blogs.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
    return res.status(200).send(blogs)
  } catch (err) {
    next(err)
  }       
})  

blogsRouter.delete('/:id/', isAuthenticated, async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (blog.userId !== req.loggedUser.id) {
      return res.status(401).send(`You may not delete this blog because it doesn't belong to user ${req.loggedUser.username}`)
    }
    blog.destroy()
    res.status(200).send(blog)
  } catch (err) {
    next(err)
  }
}) 
blogsRouter.post('/', async (req, res, next) => {
  try {
    let newBlog = Blog.build(req.body)
    const createdByUser = await User.findOne({where: {username: "TestUser333"}})
    newBlog.userId = createdByUser.id
    await newBlog.save()
    res.status(201).send(newBlog)
  } catch (err) {
    next(err)
  }
})
blogsRouter.put('/:id', async (req, res, next) => {
  if (!req.body.likes || typeof req.body.likes !== 'number') {
    res.status(400).send('Value is missing or is of wrong type')
  }
  const blog = await Blog.findByPk(req.params.id)
  try {
    blog.set({likes: req.body.likes})
    await blog.save()
    res.status(200).send(blog)
  } catch (err) {
    next(err)
  }
})


module.exports = blogsRouter