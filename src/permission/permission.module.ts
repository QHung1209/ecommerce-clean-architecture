import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/infrastructure/prisma.module';
import { PERMISSION_REPOSITORY } from './permission.constants';
import { PrismaPermissionRepository } from './infrastructure/repositories/prisma/prisma-permission.repository';
import { CreatePermissionUseCase } from './application/user-case/create-permission.use-case';
import { DeletePermissionUseCase } from './application/user-case/delete-permission.use-case';
import { UpdatePermissionUseCase } from './application/user-case/update-permission.use-case';
import { GetPermissionUseCase } from './application/user-case/get-permission.use-case';
import { ListPermissionsUseCase } from './application/user-case/list-permissions.use-case';
import { PermissionController } from './presentation/controllers/permission.controller';

@Module({
  imports: [PrismaModule],
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
