import { HTTPMethod } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  path: string;

  @IsString()
  method: HTTPMethod;
}
