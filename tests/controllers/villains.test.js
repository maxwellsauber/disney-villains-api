/* eslint-disable max-len */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const {
  after, afterEach, before, beforeEach, describe, it
} = require('mocha')
const { villainsList, matchingVillain, newVillain } = require('../mocks/villains')
const { getAllVillains, getVillainBySlug, createNewVillain } = require('../../controllers/villains.js')

const villainAttributes = ['name', 'movie', 'slug']

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - villains', () => {
  let response
  let sandbox
  let stubbedCreate
  let stubbedFindAll
  let stubbedFindOne
  let stubbedSend
  let stubbedSendStatus
  let stubbedStatus
  let stubbedStatusDotSend

  before(() => {
    sandbox = sinon.createSandbox()

    stubbedCreate = sandbox.stub(models.villains, 'create')
    stubbedFindAll = sandbox.stub(models.villains, 'findAll')
    stubbedFindOne = sandbox.stub(models.villains, 'findOne')

    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedStatus = sandbox.stub()

    stubbedStatusDotSend = sandbox.stub()

    response = {
      send: stubbedSend,
      status: stubbedStatus,
      sendStatus: stubbedSendStatus,
    }
  })

  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusDotSend })
  })

  afterEach(() => {
    sandbox.reset()
  })

  after(() => {
    sandbox.restore()
  })

  describe('getAllVillains', () => {
    it('retrieves a list of villains from the database and calls response.send() with the list.', async () => {
      stubbedFindAll.returns(villainsList)

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedFindAll).to.have.been.calledWith({ attributes: villainAttributes })
      expect(stubbedSend).to.have.been.calledWith(villainsList)
    })

    it('returns a 500 status when an error occurs retrieving all villians', async () => {
      stubbedFindAll.throws('ERROR!')

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('He\'s a 500 Error! They\'re all the same')
    })
  })

  describe('getVillainBySlug', () => {
    it('retrieves the villain associated with the provided slug from the database and calls response.send() with it', async () => {
      const request = { params: { slug: 'gaston' } }

      stubbedFindOne.returns(matchingVillain)

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'gaston' }, attributes: villainAttributes })
      expect(stubbedSend).to.have.been.calledWith(matchingVillain)
    })

    it('returns a 404 status when no villian is found', async () => {
      const request = { params: { slug: 'not-found' } }

      stubbedFindOne.returns(null)

      await getVillainBySlug(request, response)

      expect(stubbedStatusDotSend).to.have.been.calledWith('You poor, simple fool. Thinking you could request "not-found" from me. Me! The mistress of all evil!')
    })

    it('returns a 500 status when an error occurs retrieving a villain by slug', async () => {
      const request = { params: { slug: 'error-not-found' } }

      stubbedFindOne.throws('ERROR!')

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'error-not-found' }, attributes: villainAttributes })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Off with their 500 errors!')
    })
  })

  describe('createNewVillain', () => {
    it('accepts new villain details and saves them as a new villain in the database, returning the saved record with a 201 status', async () => {
      const request = { body: newVillain }

      stubbedCreate.returns(newVillain)

      await createNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith(newVillain)
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedStatusDotSend).to.have.been.calledWith(newVillain)
    })

    it('returns a 400 status when not all required fields are provided (Example: missing required "name")', async () => {
      const { movie, slug } = newVillain
      const request = { body: { movie, slug } }

      await createNewVillain(request, response)

      expect(stubbedCreate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(400)
      expect(stubbedStatusDotSend).to.have.been.calledWith('O Queen, here art the fairest required fields in the land: name, movie, slug')
    })

    it('returns a 500 status when an error occurs saving a new villain', async () => {
      const request = { body: newVillain }

      stubbedCreate.throws('ERROR!')

      await createNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith(newVillain)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('A 500 error am I? Perhaps you\'d like to see how 500 error like I can be!')
    })
  })
})
