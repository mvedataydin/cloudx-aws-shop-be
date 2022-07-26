import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
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
    profile: 'mvedataydin_epam',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PG_HOST: process.env.PG_HOST,
      PG_PORT: process.env.PG_PORT,
      PG_DATABASE: process.env.PG_DATABASE,
      PG_USERNAME: process.env.PG_USERNAME,
      PG_PASSWORD: process.env.PG_PASSWORD,
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
            documentation: {
              description: 'Get product by productId',
              pathParams: [
                {
                  name: 'productId',
                  description: 'Product identifier',
                },
              ],
              methodResponses: [
                {
                  statusCode: '200',
                  responseModels: {
                    'application/json': 'Product',
                  },
                },
                {
                  statusCode: '404',
                  responseModels: {
                    'application/json': 'ServiceError',
                  },
                },
                {
                  statusCode: '500',
                  responseModels: {
                    'application/json': 'ServiceError',
                  },
                },
              ],
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
            documentation: {
              description: 'Get all products',
              methodResponses: [
                {
                  statusCode: '200',
                  responseModels: {
                    'application/json': 'ProductList',
                  },
                },
                {
                  statusCode: '500',
                  responseModels: {
                    'application/json': 'ServiceError',
                  },
                },
              ],
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
            documentation: {
              description: 'Create a new product',
              bodyType: 'ProductPostBody',
              methodResponses: [
                {
                  statusCode: '200',
                  description: 'A new product created successfully',
                  responseModels: {
                    'application/json': 'ProductList',
                  },
                },
                {
                  statusCode: '400',
                  description:
                    'Something went wrong while creating a new product',
                },
                {
                  statusCode: '500',
                  description: 'Service error',
                },
              ],
            },
          } as any,
        },
      ],
    },
  },
  package: { individually: true },
};

module.exports = serverlessConfiguration;
