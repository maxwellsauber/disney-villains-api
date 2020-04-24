const models = require('../models')

const getAllVillains = async (request, response) => {
  const villains = await models.villains.findAll({ attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } })

  return response.send(villains)
}

const getVillainBySlug = async (request, response) => {
  const { slug } = request.params

  const matchingVillains = await models.villains.findOne({ where: { slug }, attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } })

  return matchingVillains
    ? response.send(matchingVillains)
    : response.sendStatus(404)
}

const createNewVillain = async (request, response) => {
  const { name, movie, slug } = request.body

  if (!name || !movie || !slug) {
    return response
      .status(400)
      .send('The following fields are required: name, movie, slug')
  }

  const newVillain = await models.villains.create({
    name, movie, slug
  })

  // Example Test Data:  { "name" : "Bob", "movie" : "The BOB attacks 3D", "slug" : "bob" }

  return response.status(201).send(newVillain)
}

module.exports = { getAllVillains, getVillainBySlug, createNewVillain }

