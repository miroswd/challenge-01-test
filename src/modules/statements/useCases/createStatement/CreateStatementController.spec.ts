import request from 'supertest'
import { Connection } from "typeorm"
import { app } from '../../../../app'

import createConnection from '../../../../database'
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO'


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
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })


  it("should be able to create a deposit", async () => {
    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 50,
        description: "Test"
      })
      .set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it("should not be able to create a deposit to unauthenticated user", async () => {
    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 50,
        description: "Test"
      })
      .set({ Authorization: `Bearer Invalid Token` })

    expect(response.status).toBe(401)
    expect(response.body.message).toEqual("JWT invalid token!")
  })


  it("should be able to create a withdraw", async () => {
    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 10,
        description: "Test"
      })
      .set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it("should not be able to create a withdraw if not have funds", async () => {
    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 100,
        description: "Test"
      })
      .set({ Authorization: `Bearer ${token}` })



    expect(response.status).toBe(400)
    expect(response.body.message).toEqual('Insufficient funds')
  })

  it("should not be able to create a withdraw to unauthenticated user", async () => {
    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 50,
        description: "Test"
      })
      .set({ Authorization: `Bearer Invalid Token` })

    expect(response.status).toBe(401)
    expect(response.body.message).toEqual("JWT invalid token!")
  })


})
