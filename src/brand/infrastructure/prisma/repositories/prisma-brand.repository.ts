import { Brand } from 'src/brand/domain/entities/brand.entity';
import { IBrandRepository } from 'src/brand/domain/interfaces/brand-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { PrismaBrandMapper } from '../mappers/prisma-brand.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaBrandRepository implements IBrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(brand: Brand, createdById: number): Promise<Brand> {
    const savedBrand = brand.hasId()
      ? await this.prisma.brand.update({
          where: {
            deletedAt: null,
            id: brand.getId(),
          },
          data: {
            logo: brand.getLogo(),
            name: brand.getName(),
            description: brand.getDescription(),
            updatedById: createdById,
          },
        })
      : await this.prisma.brand.create({
          data: {
            logo: brand.getLogo(),
            name: brand.getName(),
            description: brand.getDescription(),
            createdById: createdById,
          },
        });
    return PrismaBrandMapper.toDomain(savedBrand);
  }

  async findById(id: number): Promise<Brand | null> {
    const brand = await this.prisma.brand.findUnique({
      where: {
        deletedAt: null,
        id,
      },
    });
    return brand ? PrismaBrandMapper.toDomain(brand) : null;
  }

  async findByCondition(
    condition: any,
    languageCode?: string,
  ): Promise<Brand | null> {
    const brand = await this.prisma.brand.findFirst({
      where: {
        deletedAt: null,
        ...condition,
      },
      ...(languageCode && {
        include: {
          brandTranslations: {
            where: {
              deletedAt: null,
              languageCode,
            },
          },
        },
      }),
    });
    return brand ? PrismaBrandMapper.toDomain(brand) : null;
  }

  async findAll(): Promise<Brand[]> {
    const brands = await this.prisma.brand.findMany();
    return brands.map((brand) => PrismaBrandMapper.toDomain(brand));
  }

  async findAllBrands(languageCode?: string): Promise<Brand[]> {
    const brands = await this.prisma.brand.findMany({
      where: {
        deletedAt: null,
      },
      ...(languageCode && {
        include: {
          brandTranslations: {
            where: {
              deletedAt: null,
              languageCode,
            },
          },
        },
      }),
      orderBy: {
        createdAt: 'desc',
      },
    });
    return brands.map((brand) => PrismaBrandMapper.toDomain(brand));
  }

  async delete(id: number, updatedById: number): Promise<void> {
    await this.prisma.brand.update({
      where: {
        deletedAt: null,
        id,
      },
      data: {
        deletedAt: new Date(),
        updatedById,
      },
    });
  }

  async count(): Promise<number> {
    return this.prisma.brand.count();
  }
}
