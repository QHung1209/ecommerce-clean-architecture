import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { SharedQueryDto } from 'src/shared/presentation/dto/shared.dto';

export class ListCategoryTranslationDto extends SharedQueryDto {
  @IsNumber()
  @Type(() => Number)
  categoryId: number;
}
