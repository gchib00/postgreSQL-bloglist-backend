const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res, next) => {
  try {
    const allUsers = await User.findAll()
    res.status(200).send(allUsers)
  } catch(err) {
    next(err)
  } 
})
usersRouter.post('/', async (req, res, next) => {
  try {
    const newUser = User.build({
      username: req.body.username,
      name: req.body.name
    })
    await newUser.save()
    res.status(200).send(newUser)
  } catch(err) {
    next(err)
  }
})
usersRouter.put('/:username', async (req, res, next) => {
  const username = req.params.username
  const newUsername = req.body.username
  try {
    const user = await User.findOne({username: username})
    user.set({username: newUsername})
    await user.save()
    res.status(200).send(user)
  } catch(err) {
    next(err)
  }
})

module.exports = usersRouter