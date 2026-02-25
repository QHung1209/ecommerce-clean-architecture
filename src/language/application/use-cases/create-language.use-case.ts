import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Language } from 'src/language/domain/entities/language.entity';
import type { ILanguageRepository } from 'src/language/domain/interfaces/language-repository.interface';
import { LANGUAGE_REPOSITORY } from 'src/language/language.constants';

type CreateLanguageCommand = {
  name: string;
  code: string;
};
@Injectable()
export class CreateLanguageUseCase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: ILanguageRepository,
  ) {}

  async execute(data: CreateLanguageCommand) {
    let language = await this.languageRepository.findByCode(data.code);
    if (language) {
      throw new ConflictException('Language already exists');
    }
    const dataLanguage = {
      ...data,
    };
    language = Language.create(dataLanguage);
    return await this.languageRepository.save(language);
  }
}
