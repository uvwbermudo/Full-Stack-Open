const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () =>{
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('creating users', () => {
  test('less than length 3 username not created and returns 400', async () => {
    const usersAtStart = helper.usersInDb()

    const newUser = {
      username: 'us',
      name: 'john',
      password: 'validPasword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = helper.usersInDb()

    expect(usersAtEnd).toEqual(usersAtStart)
    expect(result.body.error).toContain('username or password must be at least 3 characters long.')
  }, 10000)

  test('less than length 3 password not created and returns 400', async () => {
    const usersAtStart = helper.usersInDb()

    const newUser = {
      username: 'validUsername',
      name: 'john',
      password: 'xx'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = helper.usersInDb()

    expect(usersAtEnd).toEqual(usersAtStart)
    expect(result.body.error).toContain('username or password must be at least 3 characters long.')
  }, 10000)

  test('missing password not created and returns 400', async () => {
    const usersAtStart = helper.usersInDb()

    const newUser = {
      username: 'validUsername',
      name: 'john',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = helper.usersInDb()

    expect(usersAtEnd).toEqual(usersAtStart)
    expect(result.body.error).toContain('username and password is required.')
  }, 10000)

  test('already taken username is not created and responds with 400', async() => {
    const usersAtStart = await helper.usersInDb()
    const usersAtStartId = usersAtStart.map(user => user.id)

    const newUser = {
      username: "root",
      name: "root",
      password: "validPassword"
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    const usersAtEndId = usersAtEnd.map(user => user.id)
    expect(usersAtEndId).toEqual(usersAtStartId)

  }, 10000)


})


afterAll(async () => {
  mongoose.connection.close()
})