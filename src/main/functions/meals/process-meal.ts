import 'reflect-metadata';
import { MealsQueueConsumer } from '@application/queues/meals-queue-consumer';
import { Register } from '@kernel/di/register';
import { lambdaSQSAdapter } from '@main/adapters/lambda-sqs-adapter';

const consumer = Register.getInstance().resolve(MealsQueueConsumer);
export const handler = lambdaSQSAdapter(consumer);
