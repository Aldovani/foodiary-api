import { Controller } from '@application/contracts/controller';
import { SignUpUseCase } from '@application/use-cases/auth/sign-up-use-case';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';
import { SignUpSchema, signUpSchema } from './schemas/sign-up-schema';

@Injectable()
@Schema(signUpSchema)
export class SignUpController extends Controller<'public', SignUpController.Response> {
  constructor(private readonly signUpUseCase: SignUpUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.Request<'public', SignUpSchema>): Promise<
    Controller.Response<SignUpController.Response>
  > {
    const { account } = body;

    const { accessToken, refreshToken } = await this.signUpUseCase.execute(
      account,
    );

    return {
      statusCode: 201,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export namespace SignUpController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
