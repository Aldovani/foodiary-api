import { Controller } from '@application/contracts/controller';
import { BadRequest } from '@application/errors/http/bad-request';
import { ConfirmForgotPasswordUseCase } from '@application/use-cases/auth/confirm-forgot-password-use-case';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';
import { ConfirmForgotPasswordSchema } from './schemas/confirm-forgot-password-schema';

@Injectable()
@Schema(ConfirmForgotPasswordSchema)
export class ConfirmForgotPasswordController extends Controller<'public', ConfirmForgotPasswordController.Response> {
  constructor(private readonly confirmForgotPasswordUseCase: ConfirmForgotPasswordUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.Request<'public', ConfirmForgotPasswordSchema>): Promise<
    Controller.Response<ConfirmForgotPasswordController.Response>
  > {
    try {

      const { email, confirmationCode, password } = body;

      await this.confirmForgotPasswordUseCase.execute(
        { email, confirmationCode, password },
      );

      return {
        statusCode: 204,
      };
    }
    catch {
      throw new BadRequest('Failed to confirm forgot password');
    }
  }
}
export namespace ConfirmForgotPasswordController {
  export type Response = void;
}
