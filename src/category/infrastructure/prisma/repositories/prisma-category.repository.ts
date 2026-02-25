import { Category } from 'src/category/domain/entities/category.entity';
import { ICategoryRepository } from 'src/category/domain/interfaces/category-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { PrismaCategoryMapper } from '../mappers/prisma-category.mapper';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(category: Category, createdById: number): Promise<Category> {
    const savedCategory = category.hasId()
      ? await this.prisma.category.update({
          where: {
            deletedAt: null,
            id: category.getId(),
          },
          data: {
            name: category.getName(),
            description: category.getDescription(),
            slug: category.getSlug(),
            logo: category.getLogo(),
            parentCategoryId: category.getParentCategoryId(),
            updatedById: createdById,
          },
        })
      : await this.prisma.category.create({
          data: {
            name: category.getName(),
            description: category.getDescription(),
            slug: category.getSlug(),
            logo: category.getLogo(),
            parentCategoryId: category.getParentCategoryId(),
            createdById: createdById,
          },
        });
    return PrismaCategoryMapper.toDomain(savedCategory);
  }
  async findById(id: number): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        deletedAt: null,
        id,
      },
    });
    return category ? PrismaCategoryMapper.toDomain(category) : null;
  }
  async findByCondition(
    condition: any,
    languageCode?: string,
  ): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        deletedAt: null,
        ...condition,
      },
      ...(languageCode && {
        include: {
          categoryTranslations: {
            where: {
              deletedAt: null,
              languageCode,
            },
          },
        },
      }),
    });
    return category ? PrismaCategoryMapper.toDomain(category) : null;
  }
  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany();
    return categories.map((category) =>
      PrismaCategoryMapper.toDomain(category),
    );
  }

  async findAllCategories({
    languageCode,
  }: {
    languageCode?: string;
  }): Promise<Category[] | []> {
    const categories = await this.prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      ...(languageCode && {
        include: {
          categoryTranslations: {
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
    return categories.map((category) =>
      PrismaCategoryMapper.toDomain(category),
    );
  }

  async delete(id: number, updatedById: number): Promise<void> {
    await this.prisma.category.update({
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

  async getCategoriesByParentCategoryId(
    parentCategoryId: number,
    languageCode?: string,
  ): Promise<Category[] | []> {
    const categories = await this.prisma.category.findMany({
      where: {
        deletedAt: null,
        parentCategoryId,
      },
      ...(languageCode && {
        include: {
          categoryTranslations: {
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
    return categories.map((category) =>
      PrismaCategoryMapper.toDomain(category),
    );
  }

  async count(): Promise<number> {
    return this.prisma.category.count();
  }
}
