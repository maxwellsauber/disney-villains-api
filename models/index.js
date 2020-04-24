const Sequelize = require('sequelize')
const villainsModel = require('./villains')

const connection = new Sequelize('disney', 'disneyvillains', 'S0EV1L!', {
  host: 'localhost', dialect: 'mysql'
})

const villains = villainsModel(connection, Sequelize)

module.exports = { villains }
