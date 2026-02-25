import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { SharedQueryDto } from 'src/shared/presentation/dto/shared.dto';

export class ListBrandTranslationDto extends SharedQueryDto {
  @IsNumber()
  @Type(() => Number)
  brandId: number;
}
