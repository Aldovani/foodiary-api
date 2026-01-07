import { Controller } from '@application/contracts/controller';
import { ForgotPasswordUseCase } from '@application/use-cases/auth/forgot-password-use-case';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';
import { ForgotPasswordSchema, forgotPasswordSchema } from './schemas/forgot-password-schema';

@Injectable()
@Schema(forgotPasswordSchema)
export class ForgotPasswordController extends Controller<'public', ForgotPasswordController.Response> {
  constructor(private readonly forgotPasswordUseCase: ForgotPasswordUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.Request<'public', ForgotPasswordSchema>): Promise<
    Controller.Response<ForgotPasswordController.Response>
  > {
    try {

      const { email } = body;

      await this.forgotPasswordUseCase.execute(
        { email },
      );

    } catch {
      //
    }
    return {
      statusCode: 204,
    };

  }
}

export namespace ForgotPasswordController {
  export type Response = void;
}
