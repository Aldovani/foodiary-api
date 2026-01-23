import 'reflect-metadata';

import { UpdateProfilesController } from '@application/controllers/profiles/update-profiles-controller';
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter';

export const handler = lambdaHttpAdapter(UpdateProfilesController);
