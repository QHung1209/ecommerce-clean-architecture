import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserProps } from 'src/user/domain/entities/user.entity';
import { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';
import { PrismaUserMapper } from '../../mappers/prisma-user.mapper';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { PASSWORD_HASHER } from 'src/shared/shared.constants';
import { Inject } from '@nestjs/common';
import { BcryptPasswordHasher } from 'src/shared/infrastructure/securities/bcrypt-password-hasher.service';
import { Password } from 'src/shared/domain/value-objects/password.vo';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: BcryptPasswordHasher,
  ) {}

  async save(user: User): Promise<User> {
    const persistenceData = PrismaUserMapper.toPersistence(
      user.getProps(),
      user.getId(),
    );
    const savedUser = user.hasId()
      ? await this.prisma.user.update({
          where: { id: user.getId() },
          data: persistenceData,
        })
      : await this.prisma.user.create({ data: persistenceData });
    return PrismaUserMapper.toDomain(savedUser);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => PrismaUserMapper.toDomain(user));
  }

  async findByRoleId(roleId: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({ where: { roleId } });
    return users.map((user) => PrismaUserMapper.toDomain(user));
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async getTokenVersionByUserId(id: number): Promise<number | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return user.tokenVersion;
  }

  async count(): Promise<number> {
    return await this.prisma.user.count();
  }
}
