import http2 from 'http2';
import { PRODUCTS } from '../mocks/products';
import { createHttpResponse } from '../utils/createHttpResponse';
import { APIGatewayProxyResult } from 'aws-lambda';

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  try {
    const productList = PRODUCTS;
    return createHttpResponse(http2.constants.HTTP_STATUS_OK, productList);
  } catch (error: any) {
    return createHttpResponse(
      http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      {
        error: error?.message,
      },
    );
  }
};
