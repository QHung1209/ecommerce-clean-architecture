import { Role, RoleProps } from 'src/role/domain/entities/role.entity';
import { RoleRepositoryInterface } from 'src/role/domain/interfaces/role-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/prisma.service';
import { PrismaRoleMapper } from './prisma-role.mapper';
import { SharedQueryDto } from 'src/shared/presentation/dto/shared.dto';
import { CreateRoleDto } from 'src/role/presentation/dto/create-role.dto';
import { Injectable } from '@nestjs/common';
import { UpdateRoleDto } from 'src/role/presentation/dto/update-role.dto';

@Injectable()
export class PrismaRoleRepository implements RoleRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(role: CreateRoleDto, createdById: number): Promise<Role> {
    const roleCreated = await this.prisma.role.create({
      data: {
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        permissions: {
          connect: role.permissions.map((permission) => ({
            id: permission,
          })),
        },
        createdById,
      },
      include: {
        permissions: true,
      },
    });
    return PrismaRoleMapper.toDomain(roleCreated, roleCreated.permissions);
  }

  async update(id: number, role: UpdateRoleDto, updatedById: number): Promise<Role> {
    const roleUpdated = await this.prisma.role.update({
      where: { id: id },
      data: {
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        permissions: {
          set: role.permissions?.map((permission) => ({
            id: permission,
          })),
        },
        updatedById,
      },
      include: {
        permissions: true,
      },
    });
    return PrismaRoleMapper.toDomain(roleUpdated, roleUpdated.permissions);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.role.delete({
      where: { id },
    });
  }

  async findById(id: number): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
      },
    });
    return role ? PrismaRoleMapper.toDomain(role, role.permissions) : null;
  }

  async findAll(queryDto: SharedQueryDto): Promise<Role[]> {
    const { limit, page, search } = queryDto;
    const roles = await this.prisma.role.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        name: 'desc',
      },
      include: {
        permissions: true,
      },
    });
    return roles.map((role) =>
      PrismaRoleMapper.toDomain(role, role.permissions),
    );
  }

  async count(): Promise<number> {
    return this.prisma.role.count();
  }
}
