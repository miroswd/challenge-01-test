import request from 'supertest'
import { Connection } from "typeorm"
import { app } from '../../../../app'

import createConnection from '../../../../database'
import { ICreateUserDTO } from '../createUser/ICreateUserDTO'

let connection: Connection
describe('Show User Controller', () => {

  let token: string;
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()

    // create user and auth to use this controller

    const user: ICreateUserDTO = {
      email: "user@email.com",
      name: "John Doe",
      password: "pass123"
    }

    await request(app).post('/api/v1/users').send(user)
    const responseAuth =  await request(app).post('/api/v1/sessions').send({email: user.email, password: user.password})

    token = responseAuth.body.token
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })


  it ("should be able to show profile", async () => {
    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
  })

  it ("should not be able to show profile if user is not authenticated", async () => {
    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer token`
    })

    expect(response.status).toBe(401)
    expect(response.body.message).toEqual('JWT invalid token!')
  })
})
