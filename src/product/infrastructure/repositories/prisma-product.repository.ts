import { Injectable, Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Product } from 'src/product/domain/entities/product.entity';
import { IProductRepository } from 'src/product/domain/interfaces/product-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { PrismaProductMapper } from '../mappers/prisma-product.mapper';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService | Prisma.TransactionClient,
  ) {}

  async save(product: Product, createdById: number): Promise<Product> {
    const client = this.prisma;
    const savedProduct = product.hasId()
      ? await client.product.update({
          where: {
            deletedAt: null,
            id: product.getId(),
          },
          data: {
            name: product.getName(),
            basePrice: product.getBasePrice(),
            brandId: product.getBrandId(),
            images: product.getImages(),
            description: product.getDescription(),
            categories: {
              set: product.getCategoryIds().map((id) => ({
                id,
              })),
            },
            updatedById: createdById,
          },
          include: {
            categories: {
              select: {
                id: true,
              },
            },
          },
        })
      : await client.product.create({
          data: {
            name: product.getName(),
            basePrice: product.getBasePrice(),
            virtualPrice: product.getVirtualPrice(),
            brandId: product.getBrandId(),
            images: product.getImages(),
            description: product.getDescription(),
            categories: {
              connect: product.getCategoryIds().map((id) => ({
                id,
              })),
            },
            createdById: createdById,
          },
          include: {
            categories: {
              select: {
                id: true,
              },
            },
          },
        });
    return PrismaProductMapper.toDomain(savedProduct);
  }
  async findAllProducts(languageCode?: string): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
  async findByCondition(
    condition: any,
    languageCode?: string,
  ): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }
  async getProductDetail(id: number, languageCode?: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        deletedAt: null,
        id,
      },
      select: {
        id: true,
        name: true,
        basePrice: true,
        virtualPrice: true,
        images: true,
        description: true,
        productTranslations: {
          where: {
            deletedAt: null,
            languageCode,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            description: true,
            logo: true,
            brandTranslations: {
              where: {
                deletedAt: null,
                languageCode,
              },
              select: {
                id: true,
                name: true,
                description: true,
                languageCode: true,
              },
            },
          },
        },
        categories: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            logo: true,
            categoryTranslations: {
              where: {
                deletedAt: null,
                languageCode,
              },
              select: {
                id: true,
                name: true,
                description: true,
                slug: true,
              },
            },
          },
        },
        variants: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            variantOptions: {
              where: {
                deletedAt: null,
              },
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
      },
    });
    return product;
  }
  async findById(id: number): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        deletedAt: null,
        id,
      },
      include: {
        categories: {
          select: {
            id: true,
          },
        },
      },
    });
    return product ? PrismaProductMapper.toDomain(product) : null;
  }
  async delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
  async count(): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
