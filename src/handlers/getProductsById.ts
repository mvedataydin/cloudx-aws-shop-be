import http2 from 'http2';
import { PRODUCTS } from '../mocks/products';
import { createHttpResponse } from '../utils/createHttpResponse';
import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

export const getProductsById = async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const { productId } = event.pathParameters as any;
    const product = PRODUCTS.find(product => product.id === productId);

    if (!product) {
      return createHttpResponse(http2.constants.HTTP_STATUS_NOT_FOUND, {
        error: `Product with id "${productId}" not found!`,
      });
    }

    return createHttpResponse(http2.constants.HTTP_STATUS_OK, product);
  } catch (error: any) {
    return createHttpResponse(
      http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      {
        error: error?.message,
      },
    );
  }
};
