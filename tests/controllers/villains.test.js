/* eslint-disable max-len */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const {
  after, afterEach, before, beforeEach, describe, it
} = require('mocha')
const { villainsList, matchingVillain } = require('../mocks/villains')
const { getAllVillains, getVillainBySlug, createNewVillain } = require('../../controllers/villains.js')

const villainAttributes = ['name', 'movie', 'slug']

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - villains', () => {
  let sandbox
  let stubbedFindAll
  let stubbedFindOne
  let stubbedCreate
  let stubbedSend
  let response
  let stubbedSendStatus
  let stubbedStatusDotSend
  let stubbedStatus

  before(() => {
    sandbox = sinon.createSandbox()

    stubbedFindAll = sandbox.stub(models.villains, 'findAll')
    stubbedFindOne = sandbox.stub(models.villains, 'findOne')
    stubbedCreate = sandbox.stub(models.villains, 'create')

    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedStatusDotSend = sandbox.stub()
    stubbedStatus = sandbox.stub()

    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus,
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
    it('Retrieves a list of villains from the database and calls response.send() with the list.', async () => {
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
      expect(stubbedStatusDotSend).to.have.been.calledWith('GET ALL 500 ERROR')
    })
  })

  describe('getVillainBySlug', () => {
    it('retrieves the villian associated with the provided slug from the database and calls response.send() with it', async () => {
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

    it('returns a 500 status when an error occurs retrieving a villian by slug', async () => {
      const request = { params: { slug: 'error-not-found' } }

      stubbedFindOne.throws('ERROR!')

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'error-not-found' }, attributes: villainAttributes })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('GET BY SLUG 500 ERROR')
    })
  })

  // AT BAT! CREATE THE NEW VILLAIN TESTS
  describe('createNewVillain', () => {

  })
})
