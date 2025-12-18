import { Injectable } from '@nestjs/common';
import { User, UserProps } from 'src/user/domain/entities/user.entity';
import { UserRepositoryInterface } from 'src/user/domain/interfaces/user-repository.interface';
import { PrismaUserMapper } from './prisma-user.mapper';
import { PrismaService } from 'src/shared/infrastructure/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: UserProps): Promise<User> {
    const user = await this.prisma.user.create({
      data,
    });
    return PrismaUserMapper.toDomain(user);
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

  async update(id: number, user: UserProps): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: user,
    });
    return PrismaUserMapper.toDomain(updatedUser);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
