import { PutCommandInput, TransactWriteCommand, TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamo-client';

export abstract class UnitOfWork {

  private transactsItems: NonNullable<TransactWriteCommandInput['TransactItems']> = [];

  protected addPut(putItem: PutCommandInput) {
    this.transactsItems.push({ Put: putItem });
  }

  protected async commit() {
    const command = new TransactWriteCommand({
      TransactItems: this.transactsItems,
    });

    await dynamoClient.send(command);
  }
}
