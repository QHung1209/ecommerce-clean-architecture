import { Permission } from 'src/permission/domain/entities/permission.entity';
import { PaginatedResult } from 'src/shared/presentation/mappers/pagination.interface';

export class PermissionResponseMapper {
  static toResponse(permission: Permission) {
    return {
      id: permission.getId(),
      name: permission.getName(),
      description: permission.getDescription(),
      path: permission.getPath(),
      method: permission.getMethod(),
    };
  }

  static toResponseList(permissions: Permission[]) {
    return permissions.map((permission) => this.toResponse(permission));
  }

  static toPaginatedResponse(result: PaginatedResult<Permission>) {
    return {
      permissions: this.toResponseList(result.data),
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    };
  }
}
