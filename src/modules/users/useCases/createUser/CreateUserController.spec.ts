import  request  from "supertest"
import { Connection } from "typeorm"
import { app } from "../../../../app"

import createConnection from '../../../../database'
import { ICreateUserDTO } from "./ICreateUserDTO"

let connection: Connection
describe ("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
     await connection.dropDatabase();
    await connection.close()
  })


  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      email: "user@email.com",
      name: "John Doe",
      password: "pass123"
    }

    const response = await request(app).post('/api/v1/users').send(user);

    expect(response.status).toBe(201)
  })

  it("should not be able to create a new user with email already existing", async () => {
    const user: ICreateUserDTO = {
      email: "user@email.com",
      name: "John Doe",
      password: "pass123"
    }

    const response = await request(app).post('/api/v1/users').send(user);

    expect(response.status).toBe(400)
  })
})
