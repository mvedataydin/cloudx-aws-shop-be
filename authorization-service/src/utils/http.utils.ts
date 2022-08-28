export enum HttpCode {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

export class HttpError extends Error {
  constructor(public readonly statusCode: HttpCode, message: string) {
    super(message);
  }
}
