import { Role } from 'src/role/domain/entities/role.entity';
import { RoleResponseDto } from '../dto/role-response.dto';

export class RoleResponseMapper {
  static toResponse(role: Role): RoleResponseDto {
    return {
      id: role.getId(),
      name: role.getName(),
      description: role.getDescription(),
      isActive: role.getIsActive(),
      ...(role.getPermissions().length > 0 && {
        permissions: role.getPermissions().map((permission) => ({
          id: permission.getId(),
          name: permission.getName(),
          method: permission.getMethod(),
          path: permission.getPath(),
        })),
      }),
    };
  }
}
