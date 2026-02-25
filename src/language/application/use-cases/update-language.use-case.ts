import { Inject, NotFoundException } from '@nestjs/common';
import type { ILanguageRepository } from 'src/language/domain/interfaces/language-repository.interface';
import { LANGUAGE_REPOSITORY } from 'src/language/language.constants';

type UpdateLanguageCommand = {
  name?: string;
  code?: string;
};

export class UpdateLanguageUseCase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: ILanguageRepository,
  ) {}

  async execute(id: number, data: UpdateLanguageCommand) {
    const language = await this.languageRepository.findById(id);
    if (!language) {
      throw new NotFoundException('Language not found');
    }
    language.update(data);
    return await this.languageRepository.save(language);
  }
}
