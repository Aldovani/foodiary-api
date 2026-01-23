import { IFileEventHandler } from '@application/contracts/IFile-event-handler';
import { Register } from '@kernel/di/register';
import { Constructor } from '@shared/types/constructor';
import { S3Handler } from 'aws-lambda';

export function lambdaS3Adapter(
  eventHandler: Constructor<IFileEventHandler>,
): S3Handler {
  const eventHandlerInstance = Register.getInstance().resolve(eventHandler);

  return async (event) => {
    const responses = await Promise.allSettled(
      event.Records.map((record) =>
        eventHandlerInstance.handle({
          fileKey: record.s3.object.key,
        }),
      ),
    );

    const failedEvents = responses.filter(
      (response) => response.status === 'rejected',
    );

    for (const event of failedEvents) {
      // eslint-disable-next-line no-console
      console.error(JSON.stringify(event.reason, null, 2));
    }
  };
}
