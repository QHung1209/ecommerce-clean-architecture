import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandTranslationDto } from './create-brand-translation.dto';

export class UpdateBrandTranslationDto extends PartialType(
  CreateBrandTranslationDto,
) {}
