import { User } from 'src/user/domain/entities/user.entity';
import { AuthResponseDto } from '../dto/auth-response.dto';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export class AuthResponseMapper {
  static toResponse(authData: AuthResponse): AuthResponseDto {
    return {
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      user: {
        id: authData.user.getId(),
        email: authData.user.getEmail().getValue(),
        name: authData.user.getName(),
        roleId: authData.user.getRoleId(),
      },
    };
  }
}
