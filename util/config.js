require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.NODE_ENV === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
  CORS_ORIGIN: process.env.NODE_ENV === 'production' ? process.env.PROD_ORIGIN : process.env.DEV_ORIGIN,
}