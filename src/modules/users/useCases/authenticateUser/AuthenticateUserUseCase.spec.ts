import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"


let authenticateUserUseCase: AuthenticateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

/**
 * 1 - preciso ter um usuário criado
 * 2 - preciso fazer o login
 * 3 - o retorno do login deve ser o token
 */


describe('Authenticate User', () => {

    beforeEach(() => {
      usersRepositoryInMemory = new InMemoryUsersRepository()
      authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
      createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    })

    it("should be able to generate token", async () => {
      const user: ICreateUserDTO = {
        email: "email@email.com",
        name: "John Doe",
        password: "senha123"
      }

      await createUserUseCase.execute(user)

      const result = await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password
      })

      expect(result).toHaveProperty('token')
    })

    it("should not be able to generate token to invalid password", async () => {
      const user: ICreateUserDTO = {
        email: "email@email.com",
        name: "John Doe",
        password: "senha123"
      }

      await createUserUseCase.execute(user)

      expect(async () => {
        await authenticateUserUseCase.execute({
          email: user.email,
          password: 'password'
        })
      }).rejects.toBeInstanceOf(AppError)
    })

    it("should not be able to generate token to nonexist user", async () => {
      expect(async () => {
        await authenticateUserUseCase.execute({
          email: 'user@email.com',
          password: 'password'
        })
      }).rejects.toBeInstanceOf(AppError)
    })

})
