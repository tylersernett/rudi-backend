const { User } = require('../models'); // Import your models

const initialMetronomes = [
  {
    id: 1,
    title: "Metronome A",
    bpm: 80,
    subdivisions: 1,
    blinkToggle: "off",
  },
  {
    id: 2,
    title: "Metronome B",
    bpm: 82,
    subdivisions: 2,
    blinkToggle: "downbeat",
  },
  {
    id: 3,
    title: "Metronome C",
    bpm: 83,
    subdivisions: 3,
    blinkToggle: "all",
  },
]

const usersInDb = async () => {
  const users = await User.findAll(); // Assuming 'User' is your Sequelize model
  return users.map(user => user.toJSON());
}

module.exports = {
  initialMetronomes,
  usersInDb
}