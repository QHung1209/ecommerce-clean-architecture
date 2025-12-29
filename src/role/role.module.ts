import { Module } from '@nestjs/common';
import { ROLE_REPOSITORY } from './role.constants';
import { PrismaRoleRepository } from './infrastructure/repositories/prisma/prisma-role.repository';
import { RoleController } from 'src/role/presentation/controllers/role.controller';
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';
import { UpdateRoleUseCase } from './application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from './application/use-cases/delete-role.use-case';
import { GetRoleUseCase } from './application/use-cases/get-role.use-case';
import { ListRolesUseCase } from './application/use-cases/list-roles.use-case';

@Module({
  providers: [
    {
      provide: ROLE_REPOSITORY,
      useClass: PrismaRoleRepository,
    },
    CreateRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    GetRoleUseCase,
    ListRolesUseCase,
  ],
  exports: [ROLE_REPOSITORY],
  controllers: [RoleController],
})
export class RoleModule {}
