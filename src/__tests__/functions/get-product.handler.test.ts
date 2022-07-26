import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { HttpCode, HttpError } from '@utils/http.utils';
import * as productService from '@services/product.service';
import { getProduct } from '@functions/get-product';

jest.mock('@services/product.service');

const MOCK_PRODUCT = {
  id: '1',
  title: 'GMC',
  description: 'Yukon',
  count: 92,
  price: 27,
  imageUrl: 'http://dummyimage.com/100x100.png/dddddd/000000',
};

describe('Get Product Handler', () => {
  it('should return 200 status code and specified product', async () => {
    const productId = '1';
    const MOCK_EVENT = {
      pathParameters: {
        productId,
      },
    } as unknown as APIGatewayProxyEvent;

    (productService.getProduct as any).mockImplementation(() =>
      Promise.resolve(MOCK_PRODUCT),
    );

    const response = (await getProduct(MOCK_EVENT)) as APIGatewayProxyResult;

    expect(productService.getProduct).toBeCalledWith(productId);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(MOCK_PRODUCT);
  });

  it('should return 404 status code if product was not found', async () => {
    const productId = 'NOT FOUND';
    const MOCK_EVENT = {
      pathParameters: {
        productId,
      },
    } as unknown as APIGatewayProxyEvent;
    const MOCK_ERROR = new HttpError(HttpCode.NOT_FOUND, 'Not found');

    (productService.getProduct as any).mockImplementation(() =>
      Promise.reject(MOCK_ERROR),
    );

    const response = (await getProduct(MOCK_EVENT)) as APIGatewayProxyResult;

    expect(productService.getProduct).toBeCalledWith(productId);

    expect(response.statusCode).toBe(MOCK_ERROR.statusCode);
    expect(JSON.parse(response.body)).toEqual({
      statusCode: MOCK_ERROR.statusCode,
      message: MOCK_ERROR.message,
    });
  });

  it('should return 500 status code for unknown error', async () => {
    const productId = '1';
    const MOCK_EVENT = {
      pathParameters: {
        productId,
      },
    } as unknown as APIGatewayProxyEvent;
    const MOCK_ERROR = new Error('Unknown Error');

    (productService.getProduct as any).mockImplementation(() =>
      Promise.reject(MOCK_ERROR),
    );

    const response = (await getProduct(MOCK_EVENT)) as APIGatewayProxyResult;

    expect(productService.getProduct).toBeCalledWith(productId);

    expect(response.statusCode).toBe(HttpCode.SERVER_ERROR);
    expect(JSON.parse(response.body)).toEqual({
      statusCode: HttpCode.SERVER_ERROR,
      message: MOCK_ERROR.message,
    });
  });
});
