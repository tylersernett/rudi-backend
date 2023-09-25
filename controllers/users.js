const router = require('express').Router()

const { User, Pattern } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Pattern,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.get('/:id', async (req, res) => {
  let where = {}
  if (req.query.read === 'true' || req.query.read === 'false') {
    where.read = req.query.read === 'true';
  } else {
    return res.status(400).json({ error: 'read query may only be true or false' })
  }

  const user = await User.findByPk(req.params.id, {
    include: [
      //patterns submitted by user:
      {
        model: Pattern,
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
  const user = await User.findOne({ where: { username } })
  if (user) {
    await user.update({ username: newUsername })
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router