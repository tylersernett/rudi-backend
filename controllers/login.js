const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  //use hardcoded password "secret"
  const passwordCorrect = body.password === 'secret'

  // if (!(user && passwordCorrect)) {
    if (!user) {
    return response.status(401).json({
      error: 'invalid username'
    })
  } else if (!passwordCorrect) {
    return response.status(401).json({
      error: 'invalid password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  await Session.destroy({ where: { userId: user.id } }) //clear out any old sessions from same user
  await Session.create({ userId: user.id, token })

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router