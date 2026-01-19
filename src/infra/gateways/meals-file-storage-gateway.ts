import { Meal } from '@application/entities/meal';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { s3Client } from '@infra/clients/s3-client';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';
import { minutesToSeconds } from '@shared/utils/miutes-to-second';
import ksuid from 'ksuid';

@Injectable()
export class MealsFileStorageGateway {
  constructor(private readonly appConfig: AppConfig) { }

  static generateFileKey({
    accountId,
    inputType,
  }: MealsFileStorageGateway.GenerateFileKeyParams): string {
    const extension = inputType === Meal.InputType.AUDIO ? 'm4a' : 'jpg';

    const filename = `${ksuid.randomSync()}.${extension}`;

    const fileKey = `${accountId}/${filename}`;

    return fileKey;
  }

  async createPOST({
    file,
    mealId,
  }: MealsFileStorageGateway.CreatePOSTParams): Promise<MealsFileStorageGateway.CreatePOSTResult> {
    const bucket = this.appConfig.storage.mealsBucket;
    const contentType =
      file.inputType === Meal.InputType.AUDIO ? 'audio/m4a' : 'image/jpeg';

    const { fields, url } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: file.key,
      Expires: minutesToSeconds(5),
      Conditions: [
        { bucket },
        ['eq', '$key', file.key],
        ['eq', '$Content-Type', contentType],
        ['content-length-range', file.size, file.size],
      ],
      Fields: {
        'x-amz-meta-mealid': mealId,
      },
    });

    const uploadSignature = Buffer.from(
      JSON.stringify({
        url,
        fields: {
          ...fields,
          'Content-Type': contentType,
        },
      }),
    ).toString('base64');

    return { uploadSignature };
  }
}

export namespace MealsFileStorageGateway {
  export type GenerateFileKeyParams = {
    accountId: string;
    inputType: Meal.InputType;
  };

  export type CreatePOSTParams = {
    mealId: string;
    file: {
      key: string;
      size: number;
      inputType: Meal.InputType;
    };
  };

  export type CreatePOSTResult = {
    uploadSignature: string;
  };
}
