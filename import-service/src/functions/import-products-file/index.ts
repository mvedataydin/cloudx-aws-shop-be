import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: {
                required: true,
              },
            },
          },
        },
        authorizer: {
          name: 'tokenAuthorizer',
          arn: 'arn:aws:lambda:${self:provider.region}:${aws:accountId}:function:authorization-service-dev-basicAuthorizer',
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        },
      },
    },
  ],
};
