import { getRepository, Repository } from "typeorm";
import { ITransfersBetweenUsers } from "../dtos/ITransfersBetweenUser";
import { TransfersBetweenUsers } from "../entities/TransfersBetweenUsers";
import { ITransfersBetweenUsersRepository } from "./ITransfersBetweenUsersRepository";


class TransfersBetweenUsersRepository implements ITransfersBetweenUsersRepository{
  private repository: Repository<TransfersBetweenUsers>;

  constructor () {
    this.repository = getRepository(TransfersBetweenUsers)
  }

  async create({ amount, description, sender_user_id, recipient_user_id }: ITransfersBetweenUsers): Promise<TransfersBetweenUsers> {
    const transferBetweenUsers = this.repository.create({
      amount,
      description,
      recipient_user_id,
      sender_user_id,
    })

    await this.repository.save(transferBetweenUsers)

    return transferBetweenUsers;
  }


}


export {TransfersBetweenUsersRepository}
