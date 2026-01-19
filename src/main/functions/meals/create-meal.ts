import 'reflect-metadata';

import { Register } from '@kernel/di/register';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';
import { CreateMealController } from '@application/controllers/meals/create-meal-controller';

const controller = Register.getInstance().resolve(CreateMealController);
export const handler = lambdaHttpAdapter(controller);
