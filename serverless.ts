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
      exclude: ['aws-sdk'],
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
  },
  package: { individually: true },
};

module.exports = serverlessConfiguration;
