const Pattern = require('./pattern')
const User = require('./user')
const Session = require('./session')

//defining one to many relationship here, so no need to define in the Model classes 
User.hasMany(Pattern)
Pattern.belongsTo(User)

//don't use these if using migrations
User.sync({ alter: true })
Pattern.sync({ alter: true })
Session.sync({ alter: true })

module.exports = {
  Pattern, User, Session
}