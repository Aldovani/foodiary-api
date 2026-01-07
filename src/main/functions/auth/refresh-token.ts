import 'reflect-metadata';

import { RefreshTokenController } from '@application/controllers/auth/refresh-token-controller';
import { Register } from '@kernel/di/register';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

const controller = Register.getInstance().resolve(RefreshTokenController);
export const handler = lambdaHttpAdapter(controller);
