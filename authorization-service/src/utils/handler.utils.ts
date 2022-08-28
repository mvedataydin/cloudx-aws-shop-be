import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from 'aws-lambda';

import logger from './logger.utils';

/* Helper to handle base lambda logic */
export const lambdaHandler =
  (
    controllerCallback: (
      event: APIGatewayTokenAuthorizerEvent,
    ) => Promise<APIGatewayAuthorizerResult>,
  ) =>
  async (event: APIGatewayTokenAuthorizerEvent) => {
    try {
      logger.log('REQ ===>', event);

      return await controllerCallback(event);
    } catch (err) {
      logger.error(`ERR <===`, err.statusCode, err.message, err.stack);
    }
  };
