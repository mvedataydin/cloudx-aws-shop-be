CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    price integer
);

CREATE TABLE IF NOT EXISTS stocks (
    product_id uuid,
    count int,
    FOREIGN KEY ("product_id") REFERENCES "products" ("id")
);

INSERT INTO
    products (title, description, price)
VALUES
    ('GMC', 'Yukon', 33000),
    ('Isuzu', 'i-Series', 24599),
    ('Mazda', 'MX-5', 29900)
INSERT INTO
    stocks (product_id, count)
VALUES
    ('b0f324b2-8ce4-45ec-8baa-176ed5174857', 4),
    ('edcec9db-158d-43d0-a27a-babdc4e634b8', 2),
    ('76c36267-a73a-45ad-815e-a7f8787879c8', 5)