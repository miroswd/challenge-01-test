export enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
  RECEIVED = 'received'
}

export enum UserEntity {
  SENDER = 'sender',
  RECIPIENT = 'recipient'
}
interface ICreateStatementDTO{
  user_id: string;
  description: string;
  amount: number;
  type: OperationType;
  entity?: UserEntity;
}

export { ICreateStatementDTO }
