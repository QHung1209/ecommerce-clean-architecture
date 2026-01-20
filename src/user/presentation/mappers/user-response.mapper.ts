import { User } from 'src/user/domain/entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

export class UserResponseMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.getId(),
      email: user.getEmail().getValue(),
      name: user.getName(),
      phoneNumber: user.getPhoneNumber(),
      avatar: user.getAvatar(),
      status: user.getStatus(),
      roleId: user.getRoleId() || null,
    };
  }
}
