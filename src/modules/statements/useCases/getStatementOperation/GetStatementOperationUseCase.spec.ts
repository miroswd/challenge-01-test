import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"


let getStatementOperationUseCase: GetStatementOperationUseCase
let usersRepositoryInMemory: InMemoryUsersRepository
let statementsRepositoryInMemory: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe('Create Statement', () => {


  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
  })


  it("should be able to show balance", async () => {
    const user: ICreateUserDTO = {
      email: "email@email.com",
      name:"John Doe",
      password: "senha123"
    }

    const createdUser = await createUserUseCase.execute(user)

    let operation;
    const amount = 50
    if (createdUser.id){
      const statement = await createStatementUseCase.execute({user_id: createdUser.id, amount, description: "Teste", type: OperationType.DEPOSIT  })

      if (statement.id) {
        operation = await getStatementOperationUseCase.execute({user_id: createdUser.id, statement_id: statement.id})
      }
    }

    expect(operation).toHaveProperty('id')
    expect(operation?.amount).toEqual(amount)
  })

  it("should not be able to show balance to nonexist user",  () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "email@email.com",
        name:"John Doe",
        password: "senha123"
      }

      const createdUser = await createUserUseCase.execute(user)

      let operation;
      const amount = 50
      if (createdUser.id){
        const statement = await createStatementUseCase.execute({user_id: createdUser.id, amount, description: "Teste", type: OperationType.DEPOSIT  })

        if (statement.id) {
          operation = await getStatementOperationUseCase.execute({user_id: 'user', statement_id: statement.id})
        }
      }
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should not be able to show balance to nonexist statement",  () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "email@email.com",
        name:"John Doe",
        password: "senha123"
      }

      const createdUser = await createUserUseCase.execute(user)

      if (createdUser.id){
          await getStatementOperationUseCase.execute({user_id: createdUser.id, statement_id: 'statement'})
      }
    }).rejects.toBeInstanceOf(AppError)
  })




})
