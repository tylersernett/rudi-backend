const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({
    where: {
      username: username
    }
  })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

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

  const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 * 24 }) //expire in 1 day

  await Session.destroy({ where: { userId: user.id } }) //clear out any old sessions from same user
  await Session.create({ userId: user.id, token })

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router