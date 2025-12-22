import { Role } from 'src/role/domain/entities/role.entity';
import { RoleResponseDto } from '../dto/role-response.dto';

export class RoleResponseMapper {
  static toResponse(role: Role): RoleResponseDto {
    return {
      id: role.id,
      name: role.getName(),
      description: role.getDescription(),
      isActive: role.getIsActive(),
      permissions: role.getPermissions().map((permission) => ({
        id: permission.id,
        name: permission.getName(),
        method: permission.getMethod(),
        path: permission.getPath(),
      })),
    };
  }
}
