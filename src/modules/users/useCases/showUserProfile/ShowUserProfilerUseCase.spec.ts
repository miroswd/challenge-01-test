import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


let usersRepositoryInMemory: InMemoryUsersRepository
let showUserProfileUseCase:ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase

describe("Show user profile", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })


  it("should be able to show user profile", async () => {

    const user: ICreateUserDTO = {
       email: "email@email.com",
       name: "John Doe",
       password: "senha123"
    }

    const createdUser = await createUserUseCase.execute(user)

    let userProfile;
    if (createdUser.id) {
      userProfile = await showUserProfileUseCase.execute(createdUser.id)
    }

    expect(userProfile).toHaveProperty('id')

  })

  it("should not be to show a nonexistent profile", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('user_id')
    }).rejects.toBeInstanceOf(AppError)
  })
})
