import { container } from 'tsyringe';

import { IUsersRepository } from '../../modules/users/repositories/IUsersRepository';
import { UsersRepository } from '../../modules/users/repositories/UsersRepository';

import { IStatementsRepository } from '../../modules/statements/repositories/IStatementsRepository';
import { StatementsRepository } from '../../modules/statements/repositories/StatementsRepository';
import { ITransfersBetweenUsersRepository } from '../../modules/statements/repositories/ITransfersBetweenUsersRepository';
import { TransfersBetweenUsersRepository } from '../../modules/statements/repositories/TransfersBetweenUsersRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);

container.registerSingleton<IStatementsRepository>(
  'StatementsRepository',
  StatementsRepository
);

container.registerSingleton<ITransfersBetweenUsersRepository>(
  'TransfersBetweenUsersRepository',
  TransfersBetweenUsersRepository
)
