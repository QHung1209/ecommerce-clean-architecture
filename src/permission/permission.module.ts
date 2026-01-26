import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/infrastructure/databases/prisma/prisma.module';
import { PERMISSION_REPOSITORY } from './permission.constants';
import { PrismaPermissionRepository } from './infrastructure/repositories/prisma/prisma-permission.repository';
import { CreatePermissionUseCase } from './application/use-cases/create-permission.use-case';
import { DeletePermissionUseCase } from './application/use-cases/delete-permission.use-case';
import { UpdatePermissionUseCase } from './application/use-cases/update-permission.use-case';
import { GetPermissionUseCase } from './application/use-cases/get-permission.use-case';
import { ListPermissionsUseCase } from './application/use-cases/list-permissions.use-case';
import { PermissionController } from './presentation/controllers/permission.controller';
import { RoleModule } from 'src/role/role.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => RoleModule)],
  providers: [
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PrismaPermissionRepository,
    },
    CreatePermissionUseCase,
    DeletePermissionUseCase,
    UpdatePermissionUseCase,
    GetPermissionUseCase,
    ListPermissionsUseCase,
  ],
  exports: [PERMISSION_REPOSITORY],
  controllers: [PermissionController],
})
export class PermissionModule {}
