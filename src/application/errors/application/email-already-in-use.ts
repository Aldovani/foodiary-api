import { ErrorCode } from '../error-code';
import { ApplicationError } from './application-error';

export class EmailAlreadyInUse extends ApplicationError {
  public override statusCode = 409;
  public override code: ErrorCode;

  constructor(message?: any, code?: ErrorCode) {
    super();

    this.code = code ?? ErrorCode.EMAIL_ALREADY_IN_USE;
    this.message = message ?? 'Email already in use';
    this.name = 'EmailAlreadyInUseError';
  }
}
