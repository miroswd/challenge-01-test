import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"


let createStatementUseCase: CreateStatementUseCase
let usersRepositoryInMemory: InMemoryUsersRepository
let statementsRepositoryInMemory: InMemoryStatementsRepository

let createUserUseCase: CreateUserUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe('Create Statement', () => {


  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })


  it("should be able to create deposit", async () => {
    const user: ICreateUserDTO = {
      email: "email@email.com",
      name:"John Doe",
      password: "senha123"
    }


    const createdUser = await createUserUseCase.execute(user)


    let statement;
    if (createdUser.id){
      statement = await createStatementUseCase.execute({user_id: createdUser.id,amount: 50, description: "Teste", type: OperationType.DEPOSIT  })
    }

    expect(statement).toHaveProperty('id')
  })

  it("should be able to create withdraw", async () => {
    const user: ICreateUserDTO = {
      email: "email@email.com",
      name:"John Doe",
      password: "senha123"
    }

    const createdUser = await createUserUseCase.execute(user)

    let statement;
    if (createdUser.id){
      await createStatementUseCase.execute({user_id: createdUser.id,amount: 50, description: "Teste", type: OperationType.DEPOSIT  })
      statement = await createStatementUseCase.execute({user_id: createdUser.id, amount: 10, description: "Teste", type: OperationType.WITHDRAW  })
    }

    expect(statement).toHaveProperty('id')
  })

  it("should not be able to create withdraw if not have sufficient funds", async () => {
    expect(async () => {

      const user: ICreateUserDTO = {
        email: "email@email.com",
      name:"John Doe",
      password: "senha123"
    }

    const createdUser = await createUserUseCase.execute(user)

    let statement;
    if (createdUser.id){
      statement = await createStatementUseCase.execute({user_id: createdUser.id, amount: 10, description: "Teste", type: OperationType.WITHDRAW  })
    }

  }).rejects.toBeInstanceOf(AppError)})


  it("should not be able to create withdraw if user does not exists", async () => {
    expect(async () => {

      await createStatementUseCase
      .execute({
        user_id: 'createdUser.id',
        amount: 10,
        description: "Teste",
        type: OperationType.WITHDRAW
      })

    }).rejects.toBeInstanceOf(AppError)
  })

})
