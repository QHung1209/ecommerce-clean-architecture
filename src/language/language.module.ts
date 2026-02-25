import { Module } from '@nestjs/common';
import { LanguageController } from './presentation/controllers/language.controller';
import { CreateLanguageUseCase } from './application/use-cases/create-language.use-case';
import { GetLanguageUseCase } from './application/use-cases/get-language.use-case';
import { ListLanguagesUseCase } from './application/use-cases/list-languages.use-case';
import { UpdateLanguageUseCase } from './application/use-cases/update-language.use-case';
import { LANGUAGE_REPOSITORY } from './language.constants';
import { PrismaLanguageRepository } from './infrastructure/prisma/repositories/prisma-language.repository';

@Module({
  imports: [],
  providers: [
    {
      useClass: PrismaLanguageRepository,
      provide: LANGUAGE_REPOSITORY,
    },
    CreateLanguageUseCase,
    GetLanguageUseCase,
    ListLanguagesUseCase,
    UpdateLanguageUseCase,
  ],
  exports: [],
  controllers: [LanguageController],
})
export class LanguageModule {}
