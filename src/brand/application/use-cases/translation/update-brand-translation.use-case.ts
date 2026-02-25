import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BRAND_TRANSLATION_REPOSITORY } from 'src/brand/brand.constants';
import type { IBrandTranslationRepository } from 'src/brand/domain/interfaces/brand-translation-repository.interface';

type UpdateBrandTranslationCommand = {
  name?: string;
  description?: string;
  languageCode?: string;
  brandId?: number;
};

@Injectable()
export class UpdateBrandTranslationUseCase {
  constructor(
    @Inject(BRAND_TRANSLATION_REPOSITORY)
    private readonly brandTranslationRepository: IBrandTranslationRepository,
  ) {}
  async execute(
    id: number,
    data: UpdateBrandTranslationCommand,
    updatedById: number,
  ) {
    const brandTranslation = await this.brandTranslationRepository.findById(id);
    if (!brandTranslation) {
      throw new NotFoundException('Brand translation not found');
    }
    brandTranslation.update(data);
    return this.brandTranslationRepository.save(brandTranslation, updatedById);
  }
}
