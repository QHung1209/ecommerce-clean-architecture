import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';
import { HTTPMethod } from 'src/shared/domain/enums/http-method.enum';
import { PERMISSION_CACHE_SERVICE } from 'src/auth/auth.constants';
import type { IPermissionCacheService } from 'src/auth/domain/interfaces/permission-cache.service.interface';
import { IS_SKIP_PERMISSION_KEY } from '../decorators/skip-permission.decorator';
import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    @Inject(PERMISSION_CACHE_SERVICE)
    private readonly permissionCacheService: IPermissionCacheService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    if (this.isPublic(context) || this.isSkipPermission(context)) {
      return true;
    }
    if (isRabbitContext(context)) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }

    const permissions = await this.permissionCacheService.getPermissionsByUser(
      user.id,
      user.roleId,
    );

    return !!permissions && this.hasPermission(request, permissions);
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private isSkipPermission(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_SKIP_PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private hasPermission(
    request: Request,
    permissions: { path: string; method: HTTPMethod }[],
  ) {
    const url = request.route.path;
    const method = request.method as HTTPMethod;
    return permissions.some(
      (permission) => permission.path === url && permission.method === method,
    );
  }
}
