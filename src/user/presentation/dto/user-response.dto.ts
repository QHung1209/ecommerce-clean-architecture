import { UserStatus } from 'src/user/domain/entities/user.entity';

export class UserResponseDto {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  status: UserStatus;
  roleId: number;
}
