const express = require('express')
const cors = require('cors');
require('express-async-errors')
const app = express()

const { PORT, CORS_ORIGIN } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const corsOptions = {
  origin: CORS_ORIGIN, // Replace with the actual origin of your frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If you need to include credentials (cookies, HTTP authentication)
};

app.use(cors(corsOptions));

const patternsRouter = require('./controllers/patterns')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const metronomeRouter = require('./controllers/metronomes')

app.use(express.json())

app.use('/api/patterns', patternsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/metronomes', metronomeRouter)

//add error handling LAST
app.use((err, req, res, next) => {
  console.error(err) // Log the error for debugging purposes
  if (err.name.startsWith('Sequelize')) {
    return res.status(400).send({ error: err.errors[0].message });
  } else if (err.name.startsWith('PWError') ) {
    res.status(400).send({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' })
  }
  //this is now handled by the sequelize error message above
  // if (err.name === 'SequelizeValidationError') {
  //   if (err.errors[0].message === 'Validation isEmail on username failed') {
  //     return res.status(400).send({ error: 'username must be an email address' })
  //   }
  // } else if (err.name === 'SequelizeUniqueConstraintError') {
  //   return res.status(400).send({ error: err.errors[0].message })
  // }
  next(err)
})

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()

module.exports = { app }
// const main = async () => {
//   try {
//     await sequelize.authenticate()
//     console.log('Connection has been established successfully.')
//     sequelize.close()
//   } catch (error) {
//     console.error('Unable to connect to the database:', error)
//   }
// }

// main()