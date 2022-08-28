import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: [
    'serverless-auto-swagger',
    'serverless-esbuild',
    'serverless-offline',
  ],
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    'serverless-offline': {
      httpPort: 8000,
    },
    autoswagger: {
      apiType: 'http',
      basePath: '/${self:provider.stage}',
      title: 'RS-AWS Product Shop API',
    },
  },
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
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [
          {
            'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
          },
        ],
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: [
          {
            Ref: 'createProductTopic',
          },
        ],
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PG_HOST: process.env.PG_HOST,
      PG_PORT: process.env.PG_PORT,
      PG_DATABASE: process.env.PG_DATABASE,
      PG_USERNAME: process.env.PG_USERNAME,
      PG_PASSWORD: process.env.PG_PASSWORD,
      SNS_TOPIC_ARN: {
        Ref: 'createProductTopic',
      },
    },
  },
  functions: {
    getProduct: {
      handler: 'src/handler.getProduct',
      events: [
        {
          http: {
            method: 'get',
            path: '/products/{productId}',
            cors: true,
            summary: 'Get product by productId',
            description: 'Get product by productId',
            pathParams: [
              {
                name: 'productId',
                description: 'Product identifier',
              },
            ],
            responseData: {
              200: {
                description: 'Succesfull product item response',
                bodyType: 'Product',
              },
              404: {
                description: 'Product not found',
              },
              500: {
                description: 'Service error',
              },
            },
          } as any,
        },
      ],
    },
    getProducts: {
      handler: 'src/handler.getProducts',
      events: [
        {
          http: {
            method: 'get',
            path: '/products',
            cors: true,
            summary: 'Get all products',
            description: 'Get all products',
            responseData: {
              200: {
                description: 'Succesfull product list response',
                bodyType: 'ProductList',
              },
              500: {
                description: 'Service error',
              },
            },
          } as any,
        },
      ],
    },
    createProduct: {
      handler: 'src/handler.createProduct',
      events: [
        {
          http: {
            method: 'post',
            path: '/products',
            cors: true,
            bodyType: 'ProductPostBody',
            responseData: {
              201: {
                description: 'Succesfull product creation',
                bodyType: 'Product',
              },
              400: {
                description:
                  'Something went wrong. Invalid product parameters.',
              },
              500: {
                description: 'Service error',
              },
            },
          } as any,
        },
      ],
    },
    catalogBatchProcess: {
      handler: 'src/handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 5,
            maximumBatchingWindow: 60,
            arn: {
              'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
            },
          } as any,
        },
      ],
    },
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        },
      },
      createProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          Endpoint: 'mvedataydin@gmail.com',
          TopicArn: {
            Ref: 'createProductTopic',
          },
        },
      },
      createProductOverstockSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          Endpoint: 'mvedataydin@hotmail.com',
          TopicArn: {
            Ref: 'createProductTopic',
          },
          FilterPolicy: {
            overstock: ['true'],
          },
        },
      },
    },
    Outputs: {
      sqsURL: {
        Value: {
          Ref: 'catalogItemsQueue',
        },
      },
      sqsArn: {
        Value: {
          'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
        },
      },
    },
  },
  package: { individually: true },
};

module.exports = serverlessConfiguration;
