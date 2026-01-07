import 'reflect-metadata';

import { SignInController } from '@application/controllers/auth/sign-in-controller';
import { Register } from '@kernel/di/register';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

const controller = Register.getInstance().resolve(SignInController);
export const handler = lambdaHttpAdapter(controller);
