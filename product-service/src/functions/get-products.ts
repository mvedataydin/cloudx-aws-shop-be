import * as productService from '../services/product.service';
import { lambdaHandler } from '../utils/handler.utils';

export const getProducts = lambdaHandler(() => {
  return productService.getProducts();
});
