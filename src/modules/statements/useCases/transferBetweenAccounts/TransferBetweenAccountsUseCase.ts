import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { TransfersBetweenUsers } from "../../entities/TransfersBetweenUsers";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransfersBetweenUsersRepository } from "../../repositories/ITransfersBetweenUsersRepository";
import { OperationType, UserEntity } from "../createStatement/ICreateStatementDTO";
import { GetTransferBetweenUsersError } from "./GetTransferBetweenUsersError";

interface IRequest {
  user_id: string;
  recipient_user_id: string;
  amount: number;
  description: string;
}

@injectable()
class TransferBetweenAccountsUseCase {

  constructor(
    @inject("UsersRepository")
    private usersRepository:IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("TransfersBetweenUsersRepository")
    private transfersBetweenUsersRepository: ITransfersBetweenUsersRepository
  ){}

  async execute({ amount, description, recipient_user_id, user_id }: IRequest): Promise<TransfersBetweenUsers> {
    const senderUser = await this.usersRepository.findById(user_id)
    if (!senderUser) throw new GetTransferBetweenUsersError.SenderUserDoesNotExists()

    const recipentUser = await this.usersRepository.findById(recipient_user_id)
    if (!recipentUser) throw new GetTransferBetweenUsersError.RecipientUserDoesNotExists()

    if (user_id === recipient_user_id) throw new AppError('Cannot transfer to the same account')

    const { balance } = await this.statementsRepository.getUserBalance({ user_id })

    if (amount > balance) throw new AppError('Insufficient Funds')

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.TRANSFER,
      user_id,
      entity: UserEntity.SENDER
    })

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.RECEIVED,
      user_id:recipient_user_id,
      entity: UserEntity.RECIPIENT
    })

   const transfered =  await this.transfersBetweenUsersRepository.create({
      amount,
      description,
      recipient_user_id,
      sender_user_id: user_id
    })

    return transfered
  }
}

export { TransferBetweenAccountsUseCase }
