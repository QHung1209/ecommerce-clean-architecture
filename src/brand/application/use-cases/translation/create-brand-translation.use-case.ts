import { Inject, Injectable } from '@nestjs/common';
import { BRAND_TRANSLATION_REPOSITORY } from 'src/brand/brand.constants';
import { BrandTranslation } from 'src/brand/domain/entities/brand.translation.entity';
import type { IBrandTranslationRepository } from 'src/brand/domain/interfaces/brand-translation-repository.interface';

type CreateBrandTranslationCommand = {
  name: string;
  description: string;
  languageCode: string;
  brandId: number;
  logo: string;
};

@Injectable()
export class CreateBrandTranslationUseCase {
  constructor(
    @Inject(BRAND_TRANSLATION_REPOSITORY)
    private readonly brandTranslationRepository: IBrandTranslationRepository,
  ) {}
  async execute(data: CreateBrandTranslationCommand, createdById: number) {
    const brandTranslation = BrandTranslation.create(data);
    return this.brandTranslationRepository.save(brandTranslation, createdById);
  }
}
