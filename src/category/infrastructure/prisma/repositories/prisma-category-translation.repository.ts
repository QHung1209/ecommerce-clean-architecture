import { Injectable } from '@nestjs/common';
import { CategoryTranslation } from 'src/category/domain/entities/category.translation.entity';
import { ICategoryTranslationRepository } from 'src/category/domain/interfaces/category-translation-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { PrismaCategoryTranslationMapper } from '../mappers/prisma-category-translation.mapper';

@Injectable()
export class PrismaCategoryTranslationRepository implements ICategoryTranslationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    entity: CategoryTranslation,
    createdById: number,
  ): Promise<CategoryTranslation> {
    const savedCategoryTranslation = entity.hasId()
      ? await this.prisma.categoryTranslation.update({
          where: {
            deletedAt: null,
            id: entity.getId(),
          },
          data: {
            name: entity.getName(),
            description: entity.getDescription(),
            slug: entity.getSlug(),
            languageCode: entity.getLanguageCode(),
            categoryId: entity.getCategoryId(),
            updatedById: createdById,
          },
        })
      : await this.prisma.categoryTranslation.create({
          data: {
            name: entity.getName(),
            description: entity.getDescription(),
            slug: entity.getSlug(),
            createdById: createdById,
            categoryId: entity.getCategoryId(),
            languageCode: entity.getLanguageCode(),
          },
        });
    return PrismaCategoryTranslationMapper.toDomain(savedCategoryTranslation);
  }
  async findById(id: number): Promise<CategoryTranslation | null> {
    const categoryTranslation =
      await this.prisma.categoryTranslation.findUnique({
        where: {
          deletedAt: null,
          id: id,
        },
      });
    return categoryTranslation
      ? PrismaCategoryTranslationMapper.toDomain(categoryTranslation)
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
  }): Promise<CategoryTranslation[] | []> {
    const categoryTranslations = await this.prisma.categoryTranslation.findMany(
      {
        where: {
          deletedAt: null,
          ...(search && { name: { contains: search } }),
        },
        take: limit,
        skip: (+page - 1) * +limit,
        orderBy: {
          name: 'desc',
        },
      },
    );
    return categoryTranslations.map((categoryTranslation) =>
      PrismaCategoryTranslationMapper.toDomain(categoryTranslation),
    );
  }

  async delete(id: number, deletedById): Promise<void> {
    await this.prisma.categoryTranslation.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedById: deletedById,
        deletedAt: new Date(),
      },
    });
  }
  async count(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async findByCategoryId(
    categoryId: number,
    { limit, page }: { limit: number; page: number },
  ): Promise<CategoryTranslation[] | []> {
    const categoryTranslations = await this.prisma.categoryTranslation.findMany(
      {
        where: {
          deletedAt: null,
          categoryId: categoryId,
        },
        take: limit,
        skip: (+page - 1) * +limit,
        orderBy: {
          name: 'desc',
        },
      },
    );
    return categoryTranslations.map((categoryTranslation) =>
      PrismaCategoryTranslationMapper.toDomain(categoryTranslation),
    );
  }

  async countByCategoryId(categoryId: number): Promise<number> {
    return this.prisma.categoryTranslation.count({
      where: {
        deletedAt: null,
        categoryId: categoryId,
      },
    });
  }

  async deleteByCategoryId(
    categoryId: number,
    updatedById: number,
  ): Promise<void> {
    await this.prisma.categoryTranslation.updateMany({
      where: {
        deletedAt: null,
        categoryId: categoryId,
      },
      data: {
        deletedAt: new Date(),
        updatedById: updatedById,
      },
    });
  }
}
