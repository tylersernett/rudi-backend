const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  const token = authorization.substring(7)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(token, SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

//separate from the above to allow disabled users to logout
const userValidator = async (req, res, next) => {
  const authorization = req.get('authorization')
  const token = authorization.substring(7)
  const decodedToken = req.decodedToken
  const user = await User.findByPk(decodedToken.id)
  if (user.disabled) {
    return res.status(403).json({ error: 'user is disabled' })
  }

  const session = await Session.findOne({
    where: { userId: user.id, token }, //check for token here -- otherwise, an old token could be used
  })
  if (!session) {
    return res.status(401).json({ error: "Session is not active" })
  }

  req.user = user
  next()
}

module.exports = {
  tokenExtractor, userValidator
}