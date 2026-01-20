import { Permission } from '../entities/permission.entity';
import { BaseRepositoryInterface } from 'src/shared/domain/interfaces/base-repository.interface';

export interface PermissionRepositoryInterface extends BaseRepositoryInterface<
  Permission,
  number
> {
  save(permission: Permission, createdById: number): Promise<Permission>;
  findAllByIds(ids: number[]): Promise<Permission[]>;
  count(): Promise<number>;
}
