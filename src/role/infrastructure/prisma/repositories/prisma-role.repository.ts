import { Role } from 'src/role/domain/entities/role.entity';
import { IRoleRepository } from 'src/role/domain/interfaces/role-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { SharedQueryDto } from 'src/shared/presentation/dto/shared.dto';
import { Injectable } from '@nestjs/common';
import { HTTPMethod } from '@prisma/client';
import { PrismaRoleMapper } from '../mappers/prisma-role.mapper';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(role: Role, createdById: number): Promise<Role> {
    const savedRole = role.hasId()
      ? await this.prisma.role.update({
          where: { id: role.getId() },
          data: {
            ...PrismaRoleMapper.toUpdatePersistence(
              role.getProps(),
              role.getId(),
            ),
            updatedById: createdById,
          },
        })
      : await this.prisma.role.create({
          data: {
            ...PrismaRoleMapper.toCreatePersistence(
              role.getProps(),
              role.getId(),
            ),
            createdById,
          },
        });
    return PrismaRoleMapper.toDomain(savedRole);
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
    });
    return roles.map((role) => PrismaRoleMapper.toDomain(role));
  }

  async count(): Promise<number> {
    return this.prisma.role.count();
  }

  async getPermissionsByRoleId(
    roleId: number,
  ): Promise<{ path: string; method: HTTPMethod }[] | null> {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      select: {
        permissions: {
          select: {
            method: true,
            path: true,
          },
        },
      },
    });
    return role?.permissions ?? null;
  }

  async getRolesByPermissionId(permissionId: number): Promise<Role[] | []> {
    const roles = await this.prisma.role.findMany({
      where: {
        permissions: {
          some: {
            id: permissionId,
          },
        },
      },
    });
    return roles.map((role) => PrismaRoleMapper.toDomain(role));
  }
}
