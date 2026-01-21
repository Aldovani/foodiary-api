import { MealUploadedFileEventHandler } from '@application/events/files/meal-uploaded-file-event-handler';
import { Register } from '@kernel/di/register';
import { lambdaS3Adapter } from '@main/adapters/lambda-s3-adapter';
import 'reflect-metadata';

const eventHandler = Register.getInstance().resolve(
  MealUploadedFileEventHandler,
);

export const handler = lambdaS3Adapter(eventHandler);
