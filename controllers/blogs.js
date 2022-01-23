const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
    
blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll()
    blogs.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
    res.status(200).send(blogs)
  } catch (err) {
    next(err)
  } 
}) 
blogsRouter.delete('/:id/', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    blog.destroy()
    res.status(200).send(blog)
  } catch (err) {
    next(err)
  }
}) 
blogsRouter.post('/', async (req, res, next) => {
  const newBlog = Blog.build(req.body)
  try {
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