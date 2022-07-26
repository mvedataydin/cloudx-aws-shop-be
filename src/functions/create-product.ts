import { APIGatewayProxyEvent } from 'aws-lambda';
import { Product } from '@models/Product';
import { validateOrReject } from 'class-validator';
import { lambdaHandler } from '../utils/handler.utils';
import * as productService from '../services/product.service';
import { HttpCode, HttpError } from '../utils/http.utils';

export const createProduct = lambdaHandler(
  async (event: APIGatewayProxyEvent) => {
    const payload = JSON.parse(event.body);
    const product = new Product(payload);

    try {
      await validateOrReject(product);
    } catch (err) {
      throw new HttpError(HttpCode.BAD_REQUEST, `Something went wrong: ${err}`);
    }

    return productService.createProduct(payload);
  },
);
