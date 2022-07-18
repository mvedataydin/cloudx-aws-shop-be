export const CORS_HEADERS = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,GET',
};

export const createHttpResponse = (
  statusCode: number,
  payload: object | [],
  headers = CORS_HEADERS,
) => ({
  statusCode,
  headers,
  body: JSON.stringify(payload, null, 2),
});
