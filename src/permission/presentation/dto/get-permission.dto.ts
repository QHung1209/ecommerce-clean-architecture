import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetPermissionDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}

export class ListPermissionsDto {
  @Type(() => Number)
  @IsInt()
  limit: number;

  @Type(() => Number)
  @IsInt()
  page: number;
  
  @IsString()
  @IsOptional()
  search?: string;
}
