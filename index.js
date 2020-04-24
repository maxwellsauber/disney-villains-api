const express = require('express')
const bodyParser = require('body-parser')
const { getAllVillains, getVillainBySlug, createNewVillain } = require('./controllers/villains')

const app = express()

app.get('/villains', getAllVillains)

app.get('/villains/:slug', getVillainBySlug)

app.post('/villains', bodyParser.json(), createNewVillain)

app.listen(9000, () => {
  console.log('Listening on port 9000...') // eslint-disable-line no-console
})
