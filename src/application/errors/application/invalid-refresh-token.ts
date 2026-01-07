import { ErrorCode } from '../error-code';
import { ApplicationError } from './application-error';

export class InvalidRefreshToken extends ApplicationError {
  public override statusCode = 401;
  public override code: ErrorCode;

  constructor(message?: any, code?: ErrorCode) {
    super();

    this.code = code ?? ErrorCode.INVALID_REFRESH_TOKEN;
    this.message = message ?? 'Invalid refresh token';
    this.name = 'InvalidRefreshTokenError';
  }
}
