import { PublishCommand } from '@aws-sdk/client-sns';
import { catalogBatchProcess } from '@functions/catalog-batch-process';
import { createProduct } from '@services/product.service';
import { SQSEvent } from 'aws-lambda';

const MOCK_EVENT = {
  Records: [
    {
      body: JSON.stringify({
        title: 'Mock product 1 title',
        description: 'Mock product 1 description',
        price: '11',
        count: '111',
      }),
    },
    {
      body: JSON.stringify({
        title: 'Mock product 2 title',
        description: 'Mock product 2 description',
        price: '22',
        count: '222',
      }),
    },
  ],
} as SQSEvent;

jest.mock('@services/product.service', () => {
  return {
    createProduct: jest.fn(record => ({ ...record, id: new Date().getTime() })),
  };
});

jest.mock('@aws-sdk/client-sns', () => ({
  PublishCommand: jest.fn(() => undefined),
  SNSClient: jest.fn(() => ({
    send: jest.fn(() => Promise.resolve()),
  })),
}));

describe('catalog batch process', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute PublishCommand successfully', async () => {
    await catalogBatchProcess(MOCK_EVENT);
    expect(PublishCommand).toHaveBeenCalled();

    expect(createProduct).toBeCalledTimes(MOCK_EVENT.Records.length);
  });

  it('should not execute PublishCommand on invalid event payload', async () => {
    await catalogBatchProcess({ Records: [] } as any);

    expect(PublishCommand).not.toHaveBeenCalled();
    expect(createProduct).not.toHaveBeenCalled();
  });

  it('should not execute PublishCommand on product creation failure', async () => {
    (createProduct as jest.Mock).mockReturnValue(Promise.resolve());

    await catalogBatchProcess(MOCK_EVENT);

    expect(PublishCommand).not.toHaveBeenCalled();
    expect(createProduct).toBeCalledTimes(MOCK_EVENT.Records.length);
  });
});
