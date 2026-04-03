import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  basePrice: number;

  @IsNumber()
  virtualPrice: number;

  @IsNumber()
  brandId: number;

  @IsArray()
  images: string[];

  @IsArray()
  categoryIds: number[];

  @IsArray()
  variants: {
    name: string;
    options: string[];
  }[];

  @IsArray()
  skus: {
    value: string;
    price: number;
    stock: number;
    images: string[];
    options: {
      name: string;
      value: string;
    }[];
  }[];
}
