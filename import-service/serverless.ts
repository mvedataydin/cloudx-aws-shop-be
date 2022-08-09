import type { AWS } from '@serverless/typescript';

import importFileParser from '@functions/import-file-parser';
import importProductsFile from '@functions/import-products-file';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-dotenv-plugin',
    'serverless-offline',
  ],
  configValidationMode: 'error',
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    stage: 'dev',
    region: 'eu-west-1',
    profile: 'vedataydin_epam',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:ListBucket'],
            Resource: [`arn:aws:s3:::${process.env.BUCKET_NAME}`],
          },
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: [`arn:aws:s3:::${process.env.BUCKET_NAME}/*`],
          },
        ],
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { importFileParser, importProductsFile },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    'serverless-offline': {
      httpPort: 8000,
    },
  },
};

module.exports = serverlessConfiguration;
