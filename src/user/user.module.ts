import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/infrastructure/database/prisma/prisma.module';
import { PrismaUserRepository } from './infrastructure/repositories/prisma/prisma-user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UserController } from './presentation/controllers/user.controller';
import { USER_REPOSITORY } from './user.constants';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    // Repository implementation
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    // Application Use Cases
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ListUsersUseCase,
  ],
  exports: [
    USER_REPOSITORY, // Export repository token for other modules
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ListUsersUseCase,
  ],
})
export class UserModule {}
