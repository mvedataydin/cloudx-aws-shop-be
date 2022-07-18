jest.mock('../utils/createHttpResponse', () => ({
  createHttpResponse: jest.fn((statusCode, payload) => ({
    body: JSON.stringify(payload, null, 2),
    statusCode,
  })),
}));
