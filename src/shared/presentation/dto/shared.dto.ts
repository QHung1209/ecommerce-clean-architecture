import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SharedQueryDto {
  @Type(() => Number)
  @IsNumber()
  limit: number;

  @Type(() => Number)
  @IsNumber()
  page: number;

  @IsString()
  @IsOptional()
  search: string;
}
