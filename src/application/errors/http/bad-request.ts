import { ErrorCode } from '../error-code';
import { HttpError } from './http-error';

export class BadRequest extends HttpError {
  public override statusCode: number;
  public override code: ErrorCode;

  constructor(message?: any, code?: ErrorCode) {
    super();

    this.statusCode = 400;

    this.code = code ?? ErrorCode.BAD_REQUEST;
    this.message = message ?? 'Bad request';
    this.name = 'BadRequestError';
  }
}
