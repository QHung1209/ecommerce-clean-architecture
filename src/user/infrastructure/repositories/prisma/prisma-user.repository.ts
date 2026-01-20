import { Injectable } from '@nestjs/common';
import { User, UserProps } from 'src/user/domain/entities/user.entity';
import { UserRepositoryInterface } from 'src/user/domain/interfaces/user-repository.interface';
import { PrismaUserMapper } from './prisma-user.mapper';
import { PrismaService } from 'src/shared/infrastructure/database/prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

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
