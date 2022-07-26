import { IsInt, Length, IsUrl, IsOptional } from 'class-validator';

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

  @IsOptional()
  @Length(1, 255)
  description?: string;

  @IsOptional()
  @IsInt()
  count?: number;

  @IsOptional()
  @IsInt()
  price?: number;

  @IsOptional()
  @IsUrl()
  image_url?: string;
}
