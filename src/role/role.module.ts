import { Module } from '@nestjs/common';
import { ROLE_REPOSITORY } from './role.constants';
import { PrismaRoleRepository } from './infrastructure/repositories/prisma/prisma-role.repository';
import { RoleController } from 'src/role/presentation/controllers/role.controller';
import { CreateRoleUseCase } from './application/use-case/create-role.use-case';
import { UpdateRoleUseCase } from './application/use-case/update-role.use-case';
import { DeleteRoleUseCase } from './application/use-case/delete-role.use-case';
import { GetRoleUseCase } from './application/use-case/get-role.use-case';
import { ListRolesUseCase } from './application/use-case/list-roles.use-case';

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
