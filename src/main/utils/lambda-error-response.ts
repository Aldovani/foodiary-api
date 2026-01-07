import { ErrorCode } from '@application/errors/error-code';

interface ILambdaErrorResponse {
  statusCode: number;
  code: ErrorCode;
  message: any;
}

export function lambdaErrorResponse({
  code,
  message,
  statusCode,
}: ILambdaErrorResponse) {
  return {
    statusCode,
    code,
    body: JSON.stringify({
      message,
    }),
  };
}
