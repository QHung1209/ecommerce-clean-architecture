import { Injectable } from '@nestjs/common';
import { BrandTranslation } from 'src/brand/domain/entities/brand.translation.entity';
import { IBrandTranslationRepository } from 'src/brand/domain/interfaces/brand-translation-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { PrismaBrandTranslationMapper } from '../mappers/prisma-brand-translation.mapper';

@Injectable()
export class PrismaBrandTranslationRepository implements IBrandTranslationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    entity: BrandTranslation,
    createdById: number,
  ): Promise<BrandTranslation> {
    const savedBrandTranslation = entity.hasId()
      ? await this.prisma.brandTranslation.update({
          where: {
            deletedAt: null,
            id: entity.getId(),
          },
          data: {
            name: entity.getName(),
            description: entity.getDescription(),
            languageCode: entity.getLanguageCode(),
            brandId: entity.getBrandId(),
            updatedById: createdById,
            logo: entity.getLogo(),
          },
        })
      : await this.prisma.brandTranslation.create({
          data: {
            name: entity.getName(),
            description: entity.getDescription(),
            createdById: createdById,
            brandId: entity.getBrandId(),
            languageCode: entity.getLanguageCode(),
            logo: entity.getLogo(),
          },
        });
    return PrismaBrandTranslationMapper.toDomain(savedBrandTranslation);
  }

  async findById(id: number): Promise<BrandTranslation | null> {
    const brandTranslation = await this.prisma.brandTranslation.findUnique({
      where: {
        deletedAt: null,
        id,
      },
    });
    return brandTranslation
      ? PrismaBrandTranslationMapper.toDomain(brandTranslation)
      : null;
  }

  async findAll({
    limit,
    page,
    search,
  }: {
    limit: number;
    page: number;
    search?: string;
  }): Promise<BrandTranslation[]> {
    const brandTranslations = await this.prisma.brandTranslation.findMany({
      where: {
        deletedAt: null,
        ...(search && { name: { contains: search } }),
      },
      take: limit,
      skip: (+page - 1) * +limit,
      orderBy: {
        name: 'desc',
      },
    });
    return brandTranslations.map((bt) =>
      PrismaBrandTranslationMapper.toDomain(bt),
    );
  }

  async delete(id: number, deletedById: number): Promise<void> {
    await this.prisma.brandTranslation.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedById,
        deletedAt: new Date(),
      },
    });
  }

  async count(): Promise<number> {
    return this.prisma.brandTranslation.count();
  }

  async findByBrandId(
    brandId: number,
    { limit, page }: { limit: number; page: number },
  ): Promise<BrandTranslation[]> {
    const brandTranslations = await this.prisma.brandTranslation.findMany({
      where: {
        deletedAt: null,
        brandId,
      },
      take: limit,
      skip: (+page - 1) * +limit,
      orderBy: {
        name: 'desc',
      },
    });
    return brandTranslations.map((bt) =>
      PrismaBrandTranslationMapper.toDomain(bt),
    );
  }

  async countByBrandId(brandId: number): Promise<number> {
    return this.prisma.brandTranslation.count({
      where: {
        deletedAt: null,
        brandId,
      },
    });
  }

  async deleteByBrandId(brandId: number, updatedById: number): Promise<void> {
    await this.prisma.brandTranslation.updateMany({
      where: {
        deletedAt: null,
        brandId,
      },
      data: {
        deletedAt: new Date(),
        updatedById,
      },
    });
  }
}
