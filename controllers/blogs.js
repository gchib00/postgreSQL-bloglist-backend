/* eslint-disable no-undef */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    blogs.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
    res.status(200).send(blogs)
  } catch (err) {
    res.status(400).send(err)
  }
}) 
blogsRouter.delete('/:id/', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    blog.destroy()
    res.status(200).send(blog)
  } catch (err) {
    res.status(400).send(err)
  }
}) 
blogsRouter.post('/', async (req, res) => {
  const newBlog = Blog.build(req.body)
  try {
    await newBlog.save()
    res.status(201).send(newBlog)
  } catch (err) {
    res.status(400).send(err)
  }
})
blogsRouter.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    blog.set({likes: req.body.likes})
    await blog.save()
    res.status(200).send(blog)
  } catch (err) {
    res.status(400).send(err)
  }
})


module.exports = blogsRouter