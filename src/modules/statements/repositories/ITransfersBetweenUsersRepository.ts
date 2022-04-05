import { ITransfersBetweenUsers } from "../dtos/ITransfersBetweenUser"
import { TransfersBetweenUsers } from "../entities/TransfersBetweenUsers"


interface ITransfersBetweenUsersRepository {
  create({ amount, description, sender_user_id }: ITransfersBetweenUsers): Promise<TransfersBetweenUsers>
}

export {ITransfersBetweenUsersRepository}
