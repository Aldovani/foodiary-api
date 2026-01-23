import 'reflect-metadata';

import { UpdateGoalsController } from '@application/controllers/goals/update-goal-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

export const handler = lambdaHttpAdapter(UpdateGoalsController);
