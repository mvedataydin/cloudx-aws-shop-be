import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { s3Client } from '@libs/s3-client';
import { lambdaHandler } from '@utils/handler.utils';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const importProductsFile = lambdaHandler(
  async (event: APIGatewayProxyEvent) => {
    const { name } = event.queryStringParameters;
    const { BUCKET_NAME, S3_UPLOADED_FOLDER } = process.env;
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${S3_UPLOADED_FOLDER}${name}`,
      ContentType: 'text/csv',
    };
    const command = new PutObjectCommand(params);

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return { url: signedUrl };
  },
);

export const main = middyfy(importProductsFile);
