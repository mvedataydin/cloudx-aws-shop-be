import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { HttpCode } from '@utils/http.utils';
import * as productService from '@services/product.service';
import { getProducts } from '@functions/get-products';

jest.mock('@services/product.service');

const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Chevrolet',
    description: 'Corvette',
    count: 100,
    price: 95,
    imageUrl: 'http://dummyimage.com/100x100.png/cc0000/ffffff',
  },
  {
    id: '2',
    title: 'GMC',
    description: 'Yukon',
    count: 92,
    price: 27,
    imageUrl: 'http://dummyimage.com/100x100.png/dddddd/000000',
  },
];

describe('Get Products Handler', () => {
  it('should return 200 status code and product list', async () => {
    const MOCK_EVENT = {} as unknown as APIGatewayProxyEvent;

    (productService.getProducts as any).mockImplementation(() =>
      Promise.resolve(MOCK_PRODUCTS),
    );

    const response = (await getProducts(MOCK_EVENT)) as APIGatewayProxyResult;

    expect(productService.getProducts).toBeCalled();

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(MOCK_PRODUCTS);
  });

  it('should return 500 status code for unknown error', async () => {
    const MOCK_EVENT = {} as unknown as APIGatewayProxyEvent;
    const MOCK_ERROR = new Error('Unknown Error');

    (productService.getProducts as any).mockImplementation(() =>
      Promise.reject(MOCK_ERROR),
    );

    const response = (await getProducts(MOCK_EVENT)) as APIGatewayProxyResult;

    expect(productService.getProducts).toBeCalled();

    expect(response.statusCode).toBe(HttpCode.SERVER_ERROR);
    expect(JSON.parse(response.body)).toEqual({
      statusCode: HttpCode.SERVER_ERROR,
      message: MOCK_ERROR.message,
    });
  });
});
