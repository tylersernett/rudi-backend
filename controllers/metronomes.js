const router = require('express').Router()
const { Op } = require('sequelize')
const { tokenExtractor, userValidator } = require('../util/middleware')
const { Metronome, User } = require('../models')

router.get('/', tokenExtractor, userValidator, async (req, res) => {
  const userId = req.decodedToken.id;

  try {
    const metronomes = await Metronome.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['username'],
      },
      where: {
        userId: userId,
      },
    });

    res.json(metronomes);
  } catch (error) {
    console.error('Error fetching metronomes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//MIDDLEWARE
const metronomeFinder = async (req, res, next) => {
  req.metronome = await Metronome.findByPk(req.params.id)
  next()
}

router.post('/', tokenExtractor, userValidator, async (req, res) => {
  console.log('POST CHECK!!!', req.body)
  const user = await User.findByPk(req.decodedToken.id)
  if (user) {
    const metronome = await Metronome.create({ ...req.body, userId: user.id })
    return res.json(metronome)
  } else {
    return res.status(404).json("user not found")
  }
})


router.delete('/:id', tokenExtractor, userValidator, metronomeFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (req.metronome) {
    if (req.metronome.userId === user.id) {
      await req.metronome.destroy()
    } else {
      return res.status(403).json({ error: 'Forbidden: only owner can delete metronome' })
    }
  } else {
    return res.status(404).json({ error: 'cannot find metronome id' })
  }
  res.status(204).end()
})

// router.put('/:id', metronomeFinder, async (req, res) => {
//   if (req.metronome) {
//     req.metronome.likes = req.body.likes
//     await req.metronome.save()
//     res.json(req.metronome)
//   } else {
//     res.status(404).end()
//   }
// })

module.exports = router