import 'reflect-metadata';

import { SignUpController } from '@application/controllers/auth/sign-up-controller';
import { Register } from '@kernel/di/register';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

const controller = Register.getInstance().resolve(SignUpController);
export const handler = lambdaHttpAdapter(controller);
