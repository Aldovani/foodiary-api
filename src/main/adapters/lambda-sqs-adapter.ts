import { IQueueConsumer } from '@application/contracts/IQueue-consumer';
import { Register } from '@kernel/di/register';
import { Constructor } from '@shared/types/constructor';
import { SQSHandler } from 'aws-lambda';

export function lambdaSQSAdapter(consumer: Constructor<IQueueConsumer<any>>): SQSHandler {

  const consumerInstance = Register.getInstance().resolve(consumer);

  return async (event) => {
   await Promise.all(
      event.Records.map(async (record) => {
        const message = JSON.parse(record.body);

        await consumerInstance.process(message);
      }),
    );
  };
}
