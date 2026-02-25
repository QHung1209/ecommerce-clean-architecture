import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ILanguageRepository } from 'src/language/domain/interfaces/language-repository.interface';
import { LANGUAGE_REPOSITORY } from 'src/language/language.constants';

@Injectable()
export class GetLanguageUseCase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: ILanguageRepository,
  ) {}

  async execute(id: number) {
    const language = await this.languageRepository.findById(id);
    if (!language) {
      throw new NotFoundException('Language not found');
    }
    return language;
  }
}
