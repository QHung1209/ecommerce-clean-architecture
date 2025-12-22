import { Injectable } from '@nestjs/common';
import {
  Permission,
  PermissionProps,
} from 'src/permission/domain/entities/permission.entity';
import { PermissionRepositoryInterface } from 'src/permission/domain/interfaces/permission-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/prisma.service';
import { PrismaPermissionMapper } from './prisma-permission.mapper';
import { ListPermissionsDto } from 'src/permission/presentation/dto/get-permission.dto';

@Injectable()
export class PrismaPermissionRepository implements PermissionRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    permission: PermissionProps,
    createdById: number,
  ): Promise<Permission> {
    const permissionCreated = await this.prisma.permission.create({
      data: {
        ...permission,
        createdById,
      },
    });
    return PrismaPermissionMapper.toDomain(permissionCreated);
  }

  async findById(id: number): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    return permission ? PrismaPermissionMapper.toDomain(permission) : null;
  }

  async findAll(query: ListPermissionsDto): Promise<Permission[]> {
    const { limit, page, search } = query;
    const permissions = await this.prisma.permission.findMany({
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
    return permissions.map(PrismaPermissionMapper.toDomain);
  }

  async count(): Promise<number> {
    return this.prisma.permission.count();
  }

  async update(
    id: number,
    permission: PermissionProps,
    updatedById: number,
  ): Promise<Permission> {
    const permissionUpdated = await this.prisma.permission.update({
      where: { id },
      data: { ...permission, updatedById },
    });
    return PrismaPermissionMapper.toDomain(permissionUpdated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.permission.delete({ where: { id } });
  }
}
