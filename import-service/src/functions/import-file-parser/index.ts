import { handlerPath } from '@libs/handler-resolver';

const { BUCKET_NAME, S3_UPLOAD_FOLDER } = process.env;
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: S3_UPLOAD_FOLDER,
          },
        ],
        existing: true,
      },
    },
  ],
};
