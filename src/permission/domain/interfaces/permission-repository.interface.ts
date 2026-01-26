import { Permission } from '../entities/permission.entity';
import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';

export interface IPermissionRepository extends IBaseRepository<
  Permission,
  number
> {
  save(permission: Permission, createdById: number): Promise<Permission>;
  findAllByIds(ids: number[]): Promise<Permission[]>;
  count(): Promise<number>;
}
