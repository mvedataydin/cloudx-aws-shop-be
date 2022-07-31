import 'source-map-support/register';
import type { Handler, S3Event } from 'aws-lambda';

import { middyfy } from '@libs/lambda';

const importFileParser: Handler = async (event: S3Event) => {};

export const main = middyfy(importFileParser);
