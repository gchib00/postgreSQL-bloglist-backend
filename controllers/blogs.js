/* eslint-disable no-undef */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { Sequelize } = require('sequelize')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  console.log('authorization:', authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

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


blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const updatedBlog = {
    user: body.user,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const blog = await Blog.findOneAndUpdate({title: body.title}, updatedBlog, {new: true})
  response.json(blog)
  response.status(200).end()
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


module.exports = blogsRouter