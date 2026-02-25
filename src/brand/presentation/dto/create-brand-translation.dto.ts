import { IsNumber, IsString } from 'class-validator';

export class CreateBrandTranslationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  languageCode: string;

  @IsString()
  logo: string;

  @IsNumber()
  brandId: number;
}
