import { APIGatewayProxyEvent } from 'aws-lambda';
import type { S3Event } from 'aws-lambda';

import { HttpCode } from './http.utils';
import logger from './logger.utils';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

/* Helper to handle base lambda logic */
export const lambdaHandler =
  (
    controllerCallback: (event: APIGatewayProxyEvent | S3Event) => Promise<any>,
  ) =>
  async (event: APIGatewayProxyEvent | S3Event) => {
    const { Records } = event as S3Event;
    const { body, pathParameters, queryStringParameters } =
      event as APIGatewayProxyEvent;

    let statusCode: HttpCode;
    let result: any;

    try {
      logger.log('REQ ===>', {
        pathParameters,
        queryStringParameters,
        body,
        Records,
      });

      result = await controllerCallback(event);
      statusCode = HttpCode.OK;

      logger.log(`RES <=== [${statusCode}]`, body);
    } catch (err) {
      statusCode = err.statusCode || HttpCode.SERVER_ERROR;

      result = {
        statusCode,
        message: err.message,
      };

      logger.error(`ERR <=== [${statusCode}] `, err.message, err.stack);
    } finally {
      return {
        statusCode,
        headers: CORS_HEADERS,
        body: JSON.stringify(result),
      };
    }
  };
