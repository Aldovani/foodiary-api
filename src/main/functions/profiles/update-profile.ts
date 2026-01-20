import 'reflect-metadata';

import { UpdateProfilesController } from '@application/controllers/profiles/update-profiles-controller';
import { Register } from '@kernel/di/register';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

const controller = Register.getInstance().resolve(UpdateProfilesController);
export const handler = lambdaHttpAdapter(controller);
