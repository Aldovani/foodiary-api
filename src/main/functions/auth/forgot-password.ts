import 'reflect-metadata';

import { ForgotPasswordController } from '@application/controllers/auth/forgot-password-controller';
import { Register } from '@kernel/di/register';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

const controller = Register.getInstance().resolve(ForgotPasswordController);
export const handler = lambdaHttpAdapter(controller);
