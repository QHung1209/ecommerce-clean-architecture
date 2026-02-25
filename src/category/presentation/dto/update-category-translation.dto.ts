import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryTranslationDto } from './create-category-translation.dto';

export class UpdateCategoryTranslationDto extends PartialType(
  CreateCategoryTranslationDto,
) {}
