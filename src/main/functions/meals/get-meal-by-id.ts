import 'reflect-metadata';

import { GetMealByIdController } from '@application/controllers/meals/get-meal-by-id-controller';
import { Register } from '@kernel/di/register';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

const controller = Register.getInstance().resolve(GetMealByIdController);
export const handler = lambdaHttpAdapter(controller);
