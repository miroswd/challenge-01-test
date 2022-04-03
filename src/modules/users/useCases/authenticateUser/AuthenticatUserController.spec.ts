import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../../../app';

import createConnection from '../../../../database'
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';


let connection: Connection;
describe('Authenticate User Controller', () => {


  beforeAll(async () => {
    // criar usuário para que seja possível autenticar
    connection = await createConnection()
    await connection.runMigrations()

    const user: ICreateUserDTO = {
      name: "Miro",
      email: "miro@email.com",
      password: "senha123"
    }

    await request(app).post('/api/v1/users').send(user)
  })

  afterAll(async () => {
    // deletar o banco
    await connection.dropDatabase()
    await connection.close()
  })

  it ("should be able to auth the user", async () => {
    const credentials = {
      email: "miro@email.com",
      password: "senha123"
    }

    const response = await request(app).post('/api/v1/sessions').send(credentials)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })

  it ("should not be able to auth nonexistent user", async () => {
    const credentials = {
      email: "invalid@email.com",
      password: "senha123"
    }

    const response = await request(app).post('/api/v1/sessions').send(credentials)

    expect(response.status).toBe(401)
    expect(response.body.message).toEqual('Incorrect email or password')
  })

  it ("should not be able to auth user with wrong pass", async () => {
    const credentials = {
      email: "miro@email.com",
      password: "123456"
    }

    const response = await request(app).post('/api/v1/sessions').send(credentials)

    expect(response.status).toBe(401)
    expect(response.body.message).toEqual('Incorrect email or password')
  })

})
