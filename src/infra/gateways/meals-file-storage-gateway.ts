import { Meal } from '@application/entities/meal';
import { HeadObjectCommand } from '@aws-sdk/client-s3';
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

  getFileUrl(fileKey: string): string {
    return `https://${this.appConfig.cdn.mealCDN}/${fileKey}`;
  }

  async createPOST({
    file,
    mealId,
    accountId,
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
        'x-amz-meta-accountId': accountId,
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

  async getFileMetadata({
    fileKey,
  }: MealsFileStorageGateway.GetFileMetadataParams): Promise<MealsFileStorageGateway.GetFileMetadataResult> {
    const command = new HeadObjectCommand({
      Bucket: this.appConfig.storage.mealsBucket,
      Key: fileKey,
    });
    const { Metadata = {} } = await s3Client.send(command);

    if (!Metadata.mealid || !Metadata.accountid) {
      throw new Error(`[getFileMetadata] Cannot process file "${fileKey}"`);
    }

    return {
      mealId: Metadata.accountid,
      accountId: Metadata.accountid,
    };
  }
}

export namespace MealsFileStorageGateway {
  export type GenerateFileKeyParams = {
    accountId: string;
    inputType: Meal.InputType;
  };

  export type CreatePOSTParams = {
    mealId: string;
    accountId: string;
    file: {
      key: string;
      size: number;
      inputType: Meal.InputType;
    };
  };

  export type CreatePOSTResult = {
    uploadSignature: string;
  };
  export type GetFileMetadataParams = {
    fileKey: string;
  };

  export type GetFileMetadataResult = {
    mealId: string;
    accountId: string;
  };
}
