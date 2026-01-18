import 'reflect-metadata';

import { GetMeController } from '@application/controllers/accounts/get-me-controller';
import { Register } from '@kernel/di/register';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

const controller = Register.getInstance().resolve(GetMeController);
export const handler = lambdaHttpAdapter(controller);
