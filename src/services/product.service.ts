import { Product, ProductPostBody, Stock } from '../types/api-types';

import db from '@database/database';
import { HttpCode, HttpError } from '../utils/http.utils';

export async function getProducts(): Promise<Product[]> {
  const queryText = `
    SELECT id, title, description, price, count
    FROM products p
    LEFT JOIN stocks s 
    ON p.id = s.product_id 
  `;

  const { rows } = await db.query(queryText);

  return rows;
}

export async function getProduct(productId: string): Promise<Product> {
  const queryText = `
    SELECT p.*, s."count"
    FROM products p
    JOIN stocks s ON p.id = s.product_id AND p.id = $1;
  `;
  const values = [productId];

  const { rows } = await db.query(queryText, values);

  if (!rows[0]) {
    throw new HttpError(
      HttpCode.NOT_FOUND,
      `Product with id: ${productId} was not found`,
    );
  }

  return rows[0];
}

export async function createProduct(body: ProductPostBody): Promise<Product> {
  const { count, description, image_url, price, title } = body;
  const createProductQueryText = `
    INSERT INTO products (title, description, price, image_url) VALUES
    ($1, $2, $3, $4)
    RETURNING *;
  `;
  const createStockQueryText = `
    INSERT INTO stocks (product_id, count) VALUES
    ($1, $2)
    RETURNING *;
  `;
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const { rows: productRows } = await db.query<Product>(
      createProductQueryText,
      [title, description, price, image_url],
    );
    const product = productRows[0];

    const { rows: stockRows } = await db.query<Stock>(createStockQueryText, [
      product.id,
      count,
    ]);

    await client.query('COMMIT');

    return { ...product, count: stockRows[0]?.count || null };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
