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

INSERT INTO products (title, description, price) VALUES
    ('Range Rover', 'Vestibulum quam sapien, varius ut, blandit non.', 220500),
    ('Spectra5', 'Cum sociis natoque penatibus et magnis.', 540250),
    ('Caliber', 'Lorem ipsum dolor sit amet, consectetuer adipiscing.', 300000)


INSERT INTO stocks (product_id, count) VALUES
    ('111a4310-e598-4f86-bfaf-e4f30fab9f12', 32),
    ('f7525f04-85ac-4382-abd5-5e446ab89b1a', 50),
    ('a7542aab-ba3b-48f8-8a67-14f0aef3e577', 17)
