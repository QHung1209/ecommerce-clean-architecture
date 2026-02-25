import { Role } from 'src/role/domain/entities/role.entity';
import { RoleResponseDto } from '../dto/role-response.dto';
import { PaginatedResult } from 'src/shared/presentation/mappers/pagination.interface';

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

  static toResponseList(roles: Role[]) {
    return roles.map((role) => ({
      id: role.getId(),
      name: role.getName(),
      description: role.getDescription(),
      isActive: role.getIsActive(),
    }));
  }

  static toPaginatedResponse(result: PaginatedResult<Role>) {
    return {
      data: this.toResponseList(result.data),
      meta: {
        total: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      },
    };
  }
}
