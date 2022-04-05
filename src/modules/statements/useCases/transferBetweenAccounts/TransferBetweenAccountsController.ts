import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import { TransferBetweenAccountsUseCase } from "./TransferBetweenAccountsUseCase";


class TransferBetweenAccountsController {
  async execute(request: Request, response: Response): Promise<Response> {

    const {id: user_id} = request.user
    const {id: recipient_user_id} = request.params
    const {amount, description} = request.body

    const transferBetweenAccountsUseCase = container.resolve(TransferBetweenAccountsUseCase)

    await transferBetweenAccountsUseCase.execute({
      amount,
      description,
      recipient_user_id,
      user_id
    })

    return response.send()
  }
}

export {TransferBetweenAccountsController}
