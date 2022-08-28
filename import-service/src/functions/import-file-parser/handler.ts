import type { Handler, S3Event } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { s3Client } from '@libs/s3-client';
import { FileService } from '@services/file-service';
import { lambdaHandler } from '@utils/handler.utils';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import logger from '@utils/logger.utils';

const importFileParser: Handler = lambdaHandler(async (event: S3Event) => {
  for (const record of event.Records) {
    const { object, bucket } = record.s3;
    const params = {
      Bucket: bucket.name,
      Key: object.key,
    };

    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    const parsedCSV = await FileService.parseCSV(response.Body);

    logger.log('[import-file-parser] parsed csv:', parsedCSV);

    const success = await FileService.copyToParsed(bucket, object);

    if (success) {
      await FileService.delete(bucket, object);
    }
  }
});

export const main = middyfy(importFileParser);
