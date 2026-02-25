import { ILanguageRepository } from 'src/language/domain/interfaces/language-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { Language } from 'src/language/domain/entities/language.entity';
import { PrismaLanguageMapper } from '../mappers/prisma-language.mapper';
import { ISharedQuery } from 'src/shared/domain/interfaces/query.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaLanguageRepository implements ILanguageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(language: Language, createdById?: number): Promise<Language> {
    const savedLanguage = language.hasId()
      ? await this.prisma.language.update({
          where: { deletedAt: null, id: language.getId() },
          data: {
            ...PrismaLanguageMapper.toUpdatePersistence(
              language,
              language.getId(),
            ),
            updatedById: createdById,
          },
        })
      : await this.prisma.language.create({
          data: {
            ...PrismaLanguageMapper.toCreatePersistence(language),
            createdById,
          },
        });
    return PrismaLanguageMapper.toDomain(savedLanguage);
  }

  async findById(id: number): Promise<Language | null> {
    const language = await this.prisma.language.findUnique({
      where: { deletedAt: null, id },
    });
    return language ? PrismaLanguageMapper.toDomain(language) : null;
  }

  async findByCode(code: string): Promise<Language | null> {
    const language = await this.prisma.language.findUnique({
      where: { deletedAt: null, code },
    });
    return language ? PrismaLanguageMapper.toDomain(language) : null;
  }

  async findAll(query: ISharedQuery): Promise<Language[]> {
    const languages = await this.prisma.language.findMany({
      take: query.limit,
      skip: (query.page - 1) * query.limit,
      orderBy: {
        name: 'desc',
      },
    });
    console.log(languages);
    return languages.map((language) => PrismaLanguageMapper.toDomain(language));
  }

  async count(): Promise<number> {
    return this.prisma.language.count();
  }

  async delete(id: number): Promise<void> {
    await this.prisma.language.delete({
      where: { deletedAt: null, id },
    });
  }
}
