import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { lambdaHandler } from '@utils/handler.utils';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const importProductsFile = lambdaHandler(
  async (event: APIGatewayProxyEvent) => {
    const s3Client = new S3Client({ region: 'eu-west-1' });
    const { name } = event.queryStringParameters;
    const { BUCKET_NAME, S3_UPLOAD_FOLDER } = process.env;
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${S3_UPLOAD_FOLDER}${name}`,
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
