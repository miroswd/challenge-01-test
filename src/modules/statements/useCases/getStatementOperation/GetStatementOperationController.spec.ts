import request from 'supertest'
import { Connection } from "typeorm"
import { v4 } from 'uuid'
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
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })


  it("should be able to get statement operation", async () => {
    const deposit = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: AMOUNT,
        description: "Test"
      })
      .set({ Authorization: `Bearer ${token}` })

      const { id: statement_id } = deposit.body

    const response = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .set({ Authorization: `Bearer ${token}` })

   expect(response.status).toBe(200)
   expect(response.body).toHaveProperty('id')
   expect(response.body.id).toEqual(statement_id)
  })

  it("should not be able to get statement operation to unauthenticated user", async () => {
    const response = await request(app)
      .get('/api/v1/statements/statement_id')
      .set({ Authorization: `Bearer invalid_token` })

    expect(response.status).toBe(401)
    expect(response.body.message).toEqual("JWT invalid token!")
  })

  it("should not be able to get statement operation with invalid statement id", async () => {

    const statement_id = v4()

    const response = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .set({ Authorization: `Bearer ${token}` })

    expect(response.status).toBe(404)
    expect(response.body.message).toEqual("Statement not found")
  })


})
