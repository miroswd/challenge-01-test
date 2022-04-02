import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO"



let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create User", () => {


  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })


  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      email: "email@email.com",
      name: "John Doe",
      password: "senha123"
    }

    const result = await createUserUseCase.execute(user)

    expect(result).toHaveProperty('id')
  })

  it("should not be able to create a new user with email that already exists", async () => {
    const user: ICreateUserDTO = {
      email: "email@email.com",
      name: "John Doe",
      password: "senha123"
    }

    expect(async () => {
      await createUserUseCase.execute(user)
      await createUserUseCase.execute(user)
    }).rejects.toBeInstanceOf(AppError)
  })

})
