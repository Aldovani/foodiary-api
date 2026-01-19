import 'reflect-metadata';

import { ListMealsByDayController } from '@application/controllers/meals/list-meals-by-day-controller';
import { Register } from '@kernel/di/register';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

const controller = Register.getInstance().resolve(ListMealsByDayController);
export const handler = lambdaHttpAdapter(controller);
