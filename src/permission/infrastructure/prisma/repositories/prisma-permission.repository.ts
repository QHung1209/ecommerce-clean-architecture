import { Injectable } from '@nestjs/common';
import {
  Permission,
  PermissionProps,
} from 'src/permission/domain/entities/permission.entity';
import { IPermissionRepository } from 'src/permission/domain/interfaces/permission-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { PrismaPermissionMapper } from '../mappers/prisma-permission.mapper';
import { ListPermissionsDto } from 'src/permission/presentation/dto/get-permission.dto';

@Injectable()
export class PrismaPermissionRepository implements IPermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(permission: Permission, changeById: number): Promise<Permission> {
    const persistenceData = PrismaPermissionMapper.toPersistence(
      permission.getProps(),
      permission.getId(),
    );
    const savedPermission = permission.hasId()
      ? await this.prisma.permission.update({
          where: { deletedAt: null, id: permission.getId() },
          data: { ...persistenceData, updatedById: changeById },
        })
      : await this.prisma.permission.create({
          data: {
            ...persistenceData,
            createdById: changeById,
          },
        });
    return PrismaPermissionMapper.toDomain(savedPermission);
  }

  async findById(id: number): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { deletedAt: null, id },
    });
    return permission ? PrismaPermissionMapper.toDomain(permission) : null;
  }

  async findAll(query: ListPermissionsDto): Promise<Permission[]> {
    const { limit, page, search } = query;
    const permissions = await this.prisma.permission.findMany({
      where: {
        deletedAt: null,
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

  async findAllByIds(ids: number[]): Promise<Permission[]> {
    const permissions = await this.prisma.permission.findMany({
      where: {
        deletedAt: null,
        id: {
          in: ids,
        },
      },
    });
    return permissions.map(PrismaPermissionMapper.toDomain);
  }

  async count(): Promise<number> {
    return this.prisma.permission.count();
  }

  async delete(id: number): Promise<void> {
    await this.prisma.permission.delete({ where: { deletedAt: null, id } });
  }
}
