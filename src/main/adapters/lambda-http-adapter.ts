import { Controller } from '@application/contracts/controller';
import { ApplicationError } from '@application/errors/application/application-error';
import { ErrorCode } from '@application/errors/error-code';
import { HttpError } from '@application/errors/http/http-error';
import { Register } from '@kernel/di/register';
import { lambdaBodyParser } from '@main/utils/lambda-body-parser';
import { lambdaErrorResponse } from '@main/utils/lambda-error-response';
import { Constructor } from '@shared/types/constructor';
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { ZodError } from 'zod';

type Event = APIGatewayProxyEventV2 | APIGatewayProxyEventV2WithJWTAuthorizer;

export function lambdaHttpAdapter(
  controllerImpl: Constructor<Controller<any, unknown>>,
) {
  return async (event: Event): Promise<APIGatewayProxyResultV2> => {
    try {
      const controller = Register.getInstance().resolve(controllerImpl);

      const body = lambdaBodyParser(event.body);
      const param = event.pathParameters ?? {};
      const queryParams = event.queryStringParameters ?? {};
      const accountId =
        'authorizer' in event.requestContext
          ? (event.requestContext.authorizer.jwt.claims['internalId'] as string)
          : null;

      const response = await controller.execute({
        body,
        params: param,
        queryParams: queryParams,
        accountId,
      });

      return {
        statusCode: response.statusCode,
        body: response.body ? JSON.stringify(response.body) : undefined,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return lambdaErrorResponse({
          statusCode: 400,
          code: ErrorCode.VALIDATION,
          message: error.issues.map((issue) => ({
            filed: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }

      if (error instanceof HttpError) {
        return lambdaErrorResponse(error);
      }

      if (error instanceof ApplicationError) {
        return lambdaErrorResponse({
          statusCode: error.statusCode ?? 400,
          code: error.code,
          message: error.message,
        });
      }

      // eslint-disable-next-line no-console
      console.error(error);

      return lambdaErrorResponse({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  };
}
