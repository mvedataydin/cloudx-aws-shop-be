import { APIGatewayProxyResult } from 'aws-lambda';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { HttpCode } from '@utils/http.utils';
import { main as importProductsFile } from '@functions/import-products-file/handler';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const MOCK_URL = 'https://mock-url';

jest.mock('@aws-sdk/s3-request-presigner');
jest.mock('@aws-sdk/client-s3');

describe('[functions.import-products-file]', () => {
  it('should get signed url successfully', async () => {
    const MOCK_EVENT = { queryStringParameters: { name: 'mock.csv' } } as any;
    const { BUCKET_NAME, S3_UPLOADED_FOLDER } = process.env;
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${S3_UPLOADED_FOLDER}${MOCK_EVENT.queryStringParameters.name}`,
      ContentType: 'text/csv',
    };

    (getSignedUrl as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(MOCK_URL),
    );

    const response = (await importProductsFile(
      MOCK_EVENT,
      null,
    )) as APIGatewayProxyResult;

    expect(getSignedUrl).toHaveBeenCalledTimes(1);
    expect(PutObjectCommand).toHaveBeenCalledWith(params);
    expect(response.statusCode).toEqual(HttpCode.OK);
    expect(JSON.parse(response.body)).toEqual({ url: MOCK_URL });
  });
});
