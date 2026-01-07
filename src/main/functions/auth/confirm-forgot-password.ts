import 'reflect-metadata';

import { ConfirmForgotPasswordController } from '@application/controllers/auth/confirm-forgot-password-controller';
import { Register } from '@kernel/di/register';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

const controller = Register.getInstance().resolve(ConfirmForgotPasswordController);
export const handler = lambdaHttpAdapter(controller);
