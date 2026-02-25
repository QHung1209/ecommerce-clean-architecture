import { Inject, Injectable } from '@nestjs/common';
import { BRAND_TRANSLATION_REPOSITORY } from 'src/brand/brand.constants';
import type { IBrandTranslationRepository } from 'src/brand/domain/interfaces/brand-translation-repository.interface';

@Injectable()
export class DeleteBrandTranslationUseCase {
  constructor(
    @Inject(BRAND_TRANSLATION_REPOSITORY)
    private readonly brandTranslationRepository: IBrandTranslationRepository,
  ) {}
  async execute(id: number, deletedById: number) {
    await this.brandTranslationRepository.delete(id, deletedById);
  }
}
