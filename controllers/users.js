const bcrypt = require('bcrypt')
const router = require('express').Router()

const { User, Metronome } = require('../models')

// router.get('/', async (req, res) => {
//   const users = await User.findAll({
//     attributes: { exclude: ['passwordHash'] },
//     include: {
//       model: Metronome,
//       attributes: { exclude: ['userId'] }
//     }
//   })
//   res.json(users)
// })

router.post('/', async (req, res, next) => {
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

// router.put('/:username', async (req, res) => {
//   const username = req.params.username
//   const newUsername = req.body.username
//   const user = await User.findOne({ 
//     where: { username },     
//     attributes: { exclude: ['passwordHash'] },
// })
//   if (user) {
//     await user.update({ username: newUsername })
//     res.json(user)
//   } else {
//     res.status(404).end()
//   }
// })

module.exports = router