import http2 from 'http2';
import { createHttpResponse } from '../../utils/createHttpResponse';
import { getProductsList } from '../../handlers/getProductsList';
import { PRODUCTS } from '../../mocks/products';

describe('getProductsList', () => {
  it('should return full array of products', async () => {
    const { body, statusCode } = await getProductsList();
    const result = JSON.parse(body);

    expect(result).toEqual(PRODUCTS);
    expect(createHttpResponse).toHaveBeenCalledWith(
      http2.constants.HTTP_STATUS_OK,
      PRODUCTS,
    );
    expect(statusCode).toBe(http2.constants.HTTP_STATUS_OK);
  });

  it('should return http internal server error response on error', async () => {
    const errorMessage = 'sample_error_message';
    const err = new Error(errorMessage);

    (createHttpResponse as jest.Mock).mockImplementationOnce(() => {
      throw err;
    });

    const { body, statusCode } = await getProductsList();
    const result = JSON.parse(body);

    expect(result).toEqual({ error: errorMessage });
    expect(createHttpResponse).toHaveBeenCalledWith(
      http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      { error: errorMessage },
    );
    expect(statusCode).toBe(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  });
});
