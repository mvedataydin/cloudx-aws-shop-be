import { lambdaHandler } from '../utils/handler.utils';
import * as productService from '../services/product.service';
import { SQSEvent } from 'aws-lambda';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

export const catalogBatchProcess = lambdaHandler(async (event: SQSEvent) => {
  const snsClient = new SNSClient({ region: 'eu-west-1' });
  const records = event.Records.map(({ body }) => JSON.parse(body));

  for (const record of records) {
    const product = await productService.createProduct(record);
    if (product) {
      const input = {
        Subject: 'New product added to Database',
        Message: JSON.stringify(product),
        TopicArn: process.env.SNS_TOPIC_ARN,
        MessageAttributes: {
          overstock: {
            DataType: 'String',
            StringValue: +product.count >= 100 ? 'true' : 'false',
          },
        },
      };

      const command = new PublishCommand(input);
      await snsClient.send(command);
    }
  }
  return records;
});
