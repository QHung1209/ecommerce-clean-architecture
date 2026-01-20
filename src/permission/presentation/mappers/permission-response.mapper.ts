import { Permission } from 'src/permission/domain/entities/permission.entity';

export interface PaginatedPermissionResult {
  permissions: Permission[];
  total: number;
  totalPage: number;
  page: number;
}

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

  static toPaginatedResponse(result: PaginatedPermissionResult) {
    return {
      permissions: this.toResponseList(result.permissions),
      total: result.total,
      totalPage: result.totalPage,
      page: result.page,
    };
  }
}
