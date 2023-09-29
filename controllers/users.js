const bcrypt = require('bcrypt')
const router = require('express').Router()

const { User, Metronome } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Metronome,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const { username, password } = req.body

  if (password.length < 3) {
    const error = new Error('Password too short or missing')
    error.name = 'PWError'
    error.status = 400
    return next(error)
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({
    username,
    passwordHash,
  })

  const userWithoutPasswordHash = {
    id: user.id,
    username: user.username,
    disabled: user.disabled,
    // Add any other properties you want to include in the response
  };

  res.status(201).json(userWithoutPasswordHash)
})

router.get('/:id', async (req, res) => {
  let where = {}
  if (req.query.read === 'true' || req.query.read === 'false') {
    where.read = req.query.read === 'true';
  } else {
    return res.status(400).json({ error: 'read query may only be true or false' })
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['passwordHash'] },
    include: [
      //patterns submitted by user:
      {
        model: Metronome,
        attributes: { exclude: ['userId'] }
      },
      //patterns on user's reading list:
      // {
      //   model: Pattern,
      //   as: 'readings',
      //   attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      //   through: {
      //     attributes: ['id', 'read'], //leave as empty array to prevent readingList from populating at all
      //     where,
      //   }
      // },
    ]
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  const username = req.params.username
  const newUsername = req.body.username
  const user = await User.findOne({ 
    where: { username },     
    attributes: { exclude: ['passwordHash'] },
})
  if (user) {
    await user.update({ username: newUsername })
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router