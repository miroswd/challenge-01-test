import { AppError } from "../../../../shared/errors/AppError";

namespace GetTransferBetweenUsersError {
 export class SenderUserDoesNotExists extends AppError {
    constructor(){
      super('User does not exists', 404)
    }
  }

  export class RecipientUserDoesNotExists extends AppError {
    constructor() {
      super("Recipient user does not exists", 404)
    }
  }
}

export {GetTransferBetweenUsersError}
