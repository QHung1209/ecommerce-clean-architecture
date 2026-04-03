import { HTTPMethod } from 'src/shared/domain/enums/http-method.enum';

export interface IPermissionCacheService {
  getPermissionsByUser(
    userId: number,
    roleId: number | null,
  ): Promise<{ path: string; method: HTTPMethod }[] | null>;
  cachePermissionsByUser(userId: number, roleId: number | null): Promise<void>;
}
