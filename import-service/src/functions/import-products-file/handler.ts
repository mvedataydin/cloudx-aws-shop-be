import 'source-map-support/register';
import { middyfy } from '@libs/lambda';

const importProductsFile = async event => {};

export const main = middyfy(importProductsFile);
