import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSkuDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  value: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsArray()
  images: string[];

  @IsArray()
  options: {
    name: string;
    value: string;
  }[];
}

export class UpdateVariantDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  name: string;

  @IsArray()
  options: string[];
}

export class UpdateProductDto {
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
  variants: UpdateVariantDto[];

  @IsArray()
  skus: UpdateSkuDto[];
}
