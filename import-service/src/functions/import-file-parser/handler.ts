import 'source-map-support/register';
import type { Handler, S3Event } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const importFileParser: Handler = async (event: S3Event) => {};

export const main = middyfy(importFileParser);
