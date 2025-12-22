import { ListPermissionsDto } from "src/permission/presentation/dto/get-permission.dto";
import { Permission, PermissionProps } from "../entities/permission.entity";

export interface PermissionRepositoryInterface {
  create(permission: PermissionProps, createdById: number): Promise<Permission>;
  findById(id: number): Promise<Permission | null>;
  findAll(query: ListPermissionsDto): Promise<Permission[]>;
  update(id: number, permission: Partial<PermissionProps>, updatedById: number): Promise<Permission>;
  delete(id: number): Promise<void>;
  count(): Promise<number>;
}
