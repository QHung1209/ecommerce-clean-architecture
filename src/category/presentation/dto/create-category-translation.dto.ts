import { IsNumber, IsString } from 'class-validator';

export class CreateCategoryTranslationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  languageCode: string;

  @IsNumber()
  categoryId: number;

  @IsString()
  slug: string;
}
