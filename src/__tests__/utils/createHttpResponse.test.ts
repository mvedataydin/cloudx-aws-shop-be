import http2 from 'http2';
import {
  createHttpResponse,
  CORS_HEADERS,
} from '../../utils/createHttpResponse';

describe('createHttpResponse', () => {
  it('should return proper http response', async () => {
    const payload = [] as any;
    const response = createHttpResponse(
      http2.constants.HTTP_STATUS_OK,
      payload,
    );

    expect(response).toEqual({
      statusCode: http2.constants.HTTP_STATUS_OK,
      headers: CORS_HEADERS,
      body: JSON.stringify(payload, null, 2),
    });
  });
});
