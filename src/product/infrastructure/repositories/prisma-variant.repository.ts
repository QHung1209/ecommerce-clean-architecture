import { Injectable, Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { IVariantRepository } from 'src/product/domain/interfaces/variant-repository.interface';
import { Variant } from 'src/product/domain/entities/variant.entity';
import { PrismaVariantMapper } from '../mappers/prisma-variant.mapper';

@Injectable()
export class PrismaVariantRepository implements IVariantRepository {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService | Prisma.TransactionClient,
  ) {}
  async save(entity: Variant, id: number): Promise<Variant> {
    const client = this.prisma;
    const savedVariant = entity.hasId()
      ? await client.variant.update({
          where: {
            deletedAt: null,
            id: entity.getId(),
          },
          data: {
            name: entity.getName(),
            productId: entity.getProductId(),
            updatedById: id,
          },
          include: { variantOptions: true },
        })
      : await client.variant.create({
          data: {
            name: entity.getName(),
            productId: entity.getProductId(),
            createdById: id,
          },
          include: { variantOptions: true },
        });
    return PrismaVariantMapper.toDomain(savedVariant);
  }

  async findMany(conditions: any) {
    const client = this.prisma;
    const variants = await client.variant.findMany({
      where: conditions,
      include: {
        variantOptions: true,
      },
    });
    return variants.map((variant) =>
      PrismaVariantMapper.toDomainWithOption(variant),
    );
  }
  async deleteMany(ids: number[], deletedById: number): Promise<void> {
    const client = this.prisma;
    await client.variant.updateMany({
      where: {
        deletedAt: null,
        id: { in: ids },
      },
      data: {
        deletedAt: new Date(),
        deletedById,
      },
    });
  }
  async findAllVariants(languageCode?: string): Promise<Variant[]> {
    throw new Error('Method not implemented.');
  }
  async findByCondition(
    condition: any,
    languageCode?: string,
  ): Promise<Variant | null> {
    throw new Error('Method not implemented.');
  }
  async detail(id: number, languageCode?: string): Promise<Variant | null> {
    throw new Error('Method not implemented.');
  }
  async findById(id: number): Promise<Variant | null> {
    throw new Error('Method not implemented.');
  }
  async delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<Variant[]> {
    throw new Error('Method not implemented.');
  }
  async count(): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
