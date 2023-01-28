import { HttpResponse, HttpRequest, Controller, EmailValidator, Validation } from './signup-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, serverError, success } from '../../helpers/http-helper'
import { AddAccount } from '../../../domain/usecases/add-account'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation
  constructor (emailValidator: EmailValidator, addaccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addaccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isvalid = this.emailValidator.isValid(email)

      if (!isvalid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return success(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
