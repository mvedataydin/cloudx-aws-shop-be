import { lambdaHandler } from '../utils/handler.utils';
import * as productService from '../services/product.service';
import { SQSEvent } from 'aws-lambda';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import logger from '@utils/logger.utils';

export const catalogBatchProcess = lambdaHandler(async (event: SQSEvent) => {
  const snsClient = new SNSClient({ region: 'eu-west-1' });
  const records = event.Records.map(({ body }) => JSON.parse(body));

  for (const record of records) {
    const product = await productService.createProduct(record);
    if (product) {
      const message = JSON.stringify(product);
      const messageAttributes = {
        overstock: {
          DataType: 'String',
          StringValue: +product.count >= 100 ? 'true' : 'false',
        },
      };
      const input = {
        Subject: 'New product added to Database',
        Message: message,
        TopicArn: process.env.SNS_TOPIC_ARN,
        MessageAttributes: messageAttributes,
      };

      logger.log(
        'Sending notification:',
        message,
        'with attributes:',
        messageAttributes,
      );

      const command = new PublishCommand(input);
      await snsClient.send(command);
    }
  }
  return records;
});
