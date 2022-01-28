const loginRouter = require('express').Router()
const { User } = require('../models')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res, next) => {
  const passwordIsCorrect = (req.body.password === process.env.SECRET)
  const user = await User.findOne({where :{username: req.body.username}})
  if (user && passwordIsCorrect){
    try {
      const userForToken = {username: user.username, id: user.id}
      const token = jwt.sign(userForToken, process.env.SECRET) 
      res.status(200).json({token: token, user: user})
    } catch(err) {
      next(err)
    }
  } else {
    res.status(400).send('Password or username is incorrect')
  }
})

module.exports = loginRouter