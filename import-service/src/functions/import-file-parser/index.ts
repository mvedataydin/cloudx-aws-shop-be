import { handlerPath } from '@libs/handler-resolver';
import 'dotenv/config';

const { BUCKET_NAME, S3_UPLOADED_FOLDER } = process.env;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: S3_UPLOADED_FOLDER,
          },
        ],
        existing: true,
      },
    },
  ],
};
