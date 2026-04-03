import { Injectable, Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ISkuRepository } from 'src/product/domain/interfaces/sku-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { Sku } from 'src/product/domain/entities/sku.entity';
import { PrismaSkuMapper } from '../mappers/prisma-sku.mapper';

@Injectable()
export class PrismaSkuRepository implements ISkuRepository {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService | Prisma.TransactionClient,
  ) {}
  async save(entity: Sku, id: number): Promise<Sku> {
    const client = this.prisma;
    const savedSku = entity.hasId()
      ? await client.sKU.update({
          where: {
            deletedAt: null,
            id: entity.getId(),
          },
          data: {
            value: entity.getValue(),
            productId: entity.getProductId(),
            price: entity.getPrice(),
            stock: entity.getStock(),
            images: entity.getImages(),
            variantOptions: {
              set: entity.getVariantOptionIds().map((id) => ({
                id,
              })),
            },
            updatedById: id,
          },
          include: {
            variantOptions: true,
          },
        })
      : await client.sKU.create({
          data: {
            value: entity.getValue(),
            productId: entity.getProductId(),
            price: entity.getPrice(),
            stock: entity.getStock(),
            images: entity.getImages(),
            variantOptions: {
              connect: entity.getVariantOptionIds().map((id) => ({
                id,
              })),
            },
            createdById: id,
          },
          include: {
            variantOptions: true,
          },
        });
    return PrismaSkuMapper.toDomain(savedSku);
  }

  async findMany(conditions: any) {
    const client = this.prisma;
    const skus = await client.sKU.findMany({
      where: conditions,
      include: {
        variantOptions: {
          include: {
            variant: true,
          },
        },
      },
    });
    return skus.map((sku) => PrismaSkuMapper.toDomainWithOption(sku));
  }
  async deleteMany(ids: number[], deletedById: number): Promise<void> {
    const client = this.prisma;
    await client.sKU.updateMany({
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
  async findAllSkus(languageCode?: string): Promise<Sku[]> {
    throw new Error('Method not implemented.');
  }
  async findByCondition(
    condition: any,
    languageCode?: string,
  ): Promise<Sku | null> {
    throw new Error('Method not implemented.');
  }
  async detail(id: number, languageCode?: string): Promise<Sku | null> {
    throw new Error('Method not implemented.');
  }
  async findById(id: number): Promise<Sku | null> {
    throw new Error('Method not implemented.');
  }
  async delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<Sku[]> {
    throw new Error('Method not implemented.');
  }
  async count(): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
