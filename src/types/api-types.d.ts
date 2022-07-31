export type Product = {
  id: string;
  title: string;
  description: string;
  count: number;
  price: number;
  image_url: string;
};

export type ProductPostBody = {
  title: string;
  description: string;
  count: number;
  price: number;
  image_url: string;
};

export type ProductList = Product[];

export type Stock = {
  product_id: string;
  count: number;
};
