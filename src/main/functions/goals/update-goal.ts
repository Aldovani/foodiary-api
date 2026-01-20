import 'reflect-metadata';

import { UpdateGoalsController } from '@application/controllers/goals/update-goal-controller';
import { Register } from '@kernel/di/register';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

const controller = Register.getInstance().resolve(UpdateGoalsController);
export const handler = lambdaHttpAdapter(controller);
