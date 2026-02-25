import { IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  logo: string;

  @IsString()
  name: string;

  @IsString()
  description: string;
}
