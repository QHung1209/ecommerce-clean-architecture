import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetUserDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}
