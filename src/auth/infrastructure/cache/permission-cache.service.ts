import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/shared/infrastructure/cache/redis/redis.service';
import { Inject } from '@nestjs/common';
import { ROLE_REPOSITORY } from 'src/role/role.constants';
import type { RoleRepositoryInterface } from 'src/role/domain/interfaces/role-repository.interface';
import { HTTPMethod } from '@prisma/client';
import { PermissionCacheServiceInterface } from 'src/auth/domain/interfaces/permission-cache.service.interface';

@Injectable()
export class PermissionCacheService implements PermissionCacheServiceInterface {
  constructor(
    private readonly redisService: RedisService,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  async getPermissionsByUser(userId: number, roleId: number): Promise<{ path: string; method: HTTPMethod }[] | null> {
    const cachedPermissions = await this.redisService.getOrSet(
      `permissions:user:${userId}`,
      () => this.roleRepository.getPermissionsByRoleId(roleId),
      3600,
    );
    return cachedPermissions;
  }

  async cachePermissionsByUser(userId: number, roleId: number) {
    const permissions =
      await this.roleRepository.getPermissionsByRoleId(roleId);
    await this.redisService.set(
      `permissions:user:${userId}`,
      permissions,
      3600,
    );
  }
}
