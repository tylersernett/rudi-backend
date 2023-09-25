const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, res) => {
  const session = await Session.findOne({
    where: {
      userId: req.decodedToken.id
    }
  })
  if (session) {
    await session.destroy()
  } else {
    return res.status(404).json({ error: 'cannot find session' })
  }
  res.status(200).json({ message: 'Logout successful' });
})

module.exports = router