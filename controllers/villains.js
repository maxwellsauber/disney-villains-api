const models = require('../models')
const villainAttributes = ['name', 'movie', 'slug']

const getAllVillains = async (request, response) => {
  try {
    const villains = await models.villains
      .findAll({ attributes: villainAttributes })

    return response.send(villains)
  }
  catch (error) {
    return response.status(500).send('He\'s a 500 Error! They\'re all the same')
  }
}

const getVillainBySlug = async (request, response) => {
  try {
    const { slug } = request.params

    const matchingVillains = await models.villains
      .findOne({ where: { slug }, attributes: villainAttributes })

    return matchingVillains
      ? response.send(matchingVillains)
      : response.status(404)
        .send(`You poor, simple fool. Thinking you could request "${slug}" from me. Me! The mistress of all evil!`)
  }
  catch (error) {
    return response.status(500).send('Off with their 500 errors!')
  }
}

const createNewVillain = async (request, response) => {
  try {
    const { name, movie, slug } = request.body

    if (!name || !movie || !slug) {
      return response
        .status(400)
        .send(`O Queen, here art the fairest required fields in the land: ${villainAttributes.join(', ')}`)
    }

    const newVillain = await models.villains.create({
      name, movie, slug
    })

    return response.status(201).send(newVillain)
  }
  catch (error) {
    return response.status(500).send('A 500 error am I? Perhaps you\'d like to see how 500 error like I can be!')
  }
}

module.exports = { getAllVillains, getVillainBySlug, createNewVillain }
