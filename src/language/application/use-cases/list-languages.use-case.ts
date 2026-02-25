import { Inject, Injectable } from '@nestjs/common';
import { LANGUAGE_REPOSITORY } from 'src/language/language.constants';
import type { ILanguageRepository } from 'src/language/domain/interfaces/language-repository.interface';

type ListLanguagesQuery = {
  page: number;
  limit: number;
};

@Injectable()
export class ListLanguagesUseCase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: ILanguageRepository,
  ) {}

  async execute(query: ListLanguagesQuery) {
    const languages = await this.languageRepository.findAll(query);
    const total = await this.languageRepository.count();
    return {
      languages,
      total,
      totalPages: Math.ceil(total / query.limit),
      currentPage: +query.page,
    };
  }
}
