const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Metronome extends Model { }

Metronome.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  bpm: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subdivisions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  blinkToggle: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'metronome',
  // Define a unique constraint for 'title' scoped to 'user_id'
  indexes: [
    {
      unique: true,
      fields: ['title', 'user_id'],
    },
  ],
})

module.exports = Metronome