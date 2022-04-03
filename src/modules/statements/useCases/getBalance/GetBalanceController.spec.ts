import request from 'supertest'
import { Connection } from "typeorm"
import { app } from '../../../../app'

import createConnection from '../../../../database'
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO'

let AMOUNT = 50;

let connection: Connection
describe('Create Statement Controller', () => {

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

    await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: AMOUNT,
        description: "Test"
      })
      .set({ Authorization: `Bearer ${token}` })


  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })


  it("should be able to show balance", async () => {
    const response = await request(app)
      .get('/api/v1/statements/balance')
      .set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('balance')
    expect(response.body.balance).toEqual(AMOUNT)
    expect(response.body).toHaveProperty('statement')
    expect(response.body.statement.length).toEqual(1)
  })

  it("should not be able to show balance to unauthenticated user", async () => {
    const response = await request(app)
      .get('/api/v1/statements/balance')
      .set({ Authorization: `Bearer invalid_token` })

    expect(response.status).toBe(401)
    expect(response.body.message).toEqual("JWT invalid token!")
  })


})
