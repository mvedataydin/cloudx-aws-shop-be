import http2 from 'http2';
import { createHttpResponse } from '../../utils/createHttpResponse';
import { getProductsById } from '../../handlers/getProductsById';
import { PRODUCTS } from '../../mocks/products';

const WRONG_ID = {
  pathParameters: { productId: 'invalid_product_id' },
};
const PROD_ID = {
  pathParameters: { productId: PRODUCTS[0].id },
};
const PROD_TITLE = PRODUCTS[0].title;

describe('getProductsById', () => {
  it('should return http status not found if there is no match', async () => {
    const { body, statusCode } = await getProductsById(WRONG_ID as any);
    const result = JSON.parse(body);

    expect(result.error).not.toBe(undefined);
    expect(statusCode).toBe(http2.constants.HTTP_STATUS_NOT_FOUND);
  });

  it('should return product with matched id', async () => {
    const { body, statusCode } = await getProductsById(PROD_ID as any);
    const result = JSON.parse(body);

    expect(result.title).toEqual(PROD_TITLE);
    expect(result.error).toBe(undefined);
    expect(statusCode).toBe(http2.constants.HTTP_STATUS_OK);
  });

  it('should return http internal server error response on error', async () => {
    const errorMessage = 'sample_error_message';
    const err = new Error(errorMessage);

    (createHttpResponse as jest.Mock).mockImplementationOnce(() => {
      throw err;
    });

    const { body, statusCode } = await getProductsById(PROD_ID as any);
    const result = JSON.parse(body);

    expect(result).toEqual({ error: errorMessage });
    expect(createHttpResponse).toHaveBeenCalledWith(
      http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      { error: errorMessage },
    );
    expect(statusCode).toBe(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  });
});
