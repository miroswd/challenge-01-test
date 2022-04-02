import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"


let getBalanceUseCase: GetBalanceUseCase
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
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory)
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
  })


  it("should be able to show balance", async () => {
    const user: ICreateUserDTO = {
      email: "email@email.com",
      name:"John Doe",
      password: "senha123"
    }

    const createdUser = await createUserUseCase.execute(user)

    let balance;
    const amount = 50
    if (createdUser.id){
      await createStatementUseCase.execute({user_id: createdUser.id, amount, description: "Teste", type: OperationType.DEPOSIT  })
      balance = await getBalanceUseCase.execute({user_id: createdUser.id})
    }

    expect(balance).toHaveProperty('balance')
    expect(balance?.balance).toEqual(amount)
  })


  it("should not be able to show balance to nonexist user",  () => {
    expect(async () => {
    await getBalanceUseCase.execute({user_id: 'user'})
    }).rejects.toBeInstanceOf(AppError)
  })

})
