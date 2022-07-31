import { IsInt, Length, IsUrl, IsOptional, Min } from 'class-validator';

export class Product {
  constructor({
    title,
    description = null,
    count = null,
    price = null,
    image_url = null,
  }) {
    this.title = title;
    this.description = description;
    this.count = count;
    this.price = price;
    this.image_url = image_url;
  }

  @Length(1, 55)
  title: string;

  @Length(1, 255)
  description: string;

  @IsInt()
  @Min(0)
  count: number;

  @IsInt()
  @Min(0)
  price: number;

  @IsOptional()
  @IsUrl()
  image_url?: string;
}
