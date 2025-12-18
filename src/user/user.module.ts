import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/infrastructure/prisma.module';
import { PrismaUserRepository } from './infrastructure/repositories/prisma/prisma-user.repository';
import { CreateUserUseCase } from './application/use-case/create-user.use-case';
import { USER_REPOSITORY } from './user.constants';

@Module({
  imports: [PrismaModule],
  controllers: [
    // TODO: Add controllers here when created
  ],
  providers: [
    // Repository implementation
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    // Application Use Cases
    CreateUserUseCase,
  ],
  exports: [
    USER_REPOSITORY, // Export repository token for other modules
    CreateUserUseCase,
  ],
})
export class UserModule {}
