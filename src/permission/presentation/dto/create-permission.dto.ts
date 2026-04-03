import { HTTPMethod } from 'src/shared/domain/enums/http-method.enum';
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
