import { Controller } from "@application/contracts/controller";
import { ErrorCode } from "@application/errors/error-code";
import { HttpError } from "@application/errors/http/http-error";
import { lambdaBodyParser } from "@main/utils/lambda-body-parser";
import { lambdaErrorResponse } from "@main/utils/lambda-error-response";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ZodError } from "zod";

export function lambdaHttpAdapter(controller: Controller<unknown>) {
  return async (
    event: APIGatewayProxyEventV2
  ): Promise<APIGatewayProxyResultV2> => {
    try {
      const body = lambdaBodyParser(event.body);
      const param = event.pathParameters ?? {};
      const queryParams = event.queryStringParameters ?? {};

      const response = await controller.execute({
        body,
        params: param,
        query: queryParams,
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
            filed: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      if (error instanceof HttpError) {
        return lambdaErrorResponse(error);
      }

      return lambdaErrorResponse({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        statusCode: 500,
        message: "Internal server error",
      });
    }
  };
}
