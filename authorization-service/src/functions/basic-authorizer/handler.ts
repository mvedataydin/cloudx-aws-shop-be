import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { lambdaHandler } from '@utils/handler.utils';
import { HttpCode, HttpError } from '@utils/http.utils';
import logger from '@utils/logger.utils';

type AuthorizationEffect = 'Deny' | 'Allow';

const basicAuthorizer = lambdaHandler(
  async (
    event: APIGatewayTokenAuthorizerEvent,
  ): Promise<APIGatewayAuthorizerResult> => {
    if (event.type !== 'TOKEN') {
      throw new HttpError(
        HttpCode.UNAUTHORIZED,
        `Unauthorized. Authorization token is missing.`,
      );
    }

    try {
      const { authorizationToken, methodArn } = event;
      const token = authorizationToken.split(' ')[1];
      const buffer = Buffer.from(token, 'base64');
      const decodedCredentials = buffer.toString('utf-8').split(':');
      const [username, password] = decodedCredentials;
      const storedUserPassword = process.env[username];
      const effect: AuthorizationEffect =
        !storedUserPassword || storedUserPassword !== password
          ? 'Deny'
          : 'Allow';

      logger.log(
        `username: ${username}, password: ${password}, token: ${token}, effect: ${effect}, resource: ${methodArn}`,
      );

      return {
        principalId: token,
        ...generatePolicyDocument(methodArn, effect),
      };
    } catch (error) {
      throw new HttpError(
        HttpCode.FORBIDDEN,
        `Access to the requested resource is forbidden: ${error}`,
      );
    }
  },
);

const generatePolicyDocument = (
  resource: string,
  effect: AuthorizationEffect,
) => {
  return {
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['execute-api:Invoke'],
          Effect: effect,
          Resource: [resource],
        },
      ],
    },
  };
};

export const main = middyfy(basicAuthorizer);
