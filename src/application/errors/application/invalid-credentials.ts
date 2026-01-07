import { ErrorCode } from '../error-code';
import { ApplicationError } from './application-error';

export class InvalidCredentials extends ApplicationError {
  public override statusCode = 401;
  public override code: ErrorCode;

  constructor(message?: any, code?: ErrorCode) {
    super();

    this.code = code ?? ErrorCode.INVALID_CREDENTIALS;
    this.message = message ?? 'Invalid credentials';
    this.name = 'InvalidCredentialsError';
  }
}
