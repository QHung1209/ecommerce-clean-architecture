import { Inject, Injectable } from '@nestjs/common';
import { BRAND_TRANSLATION_REPOSITORY } from 'src/brand/brand.constants';
import type { IBrandTranslationRepository } from 'src/brand/domain/interfaces/brand-translation-repository.interface';
import { ISharedQuery } from 'src/shared/domain/interfaces/query.interface';

@Injectable()
export class ListBrandTranslationsUseCase {
  constructor(
    @Inject(BRAND_TRANSLATION_REPOSITORY)
    private readonly brandTranslationRepository: IBrandTranslationRepository,
  ) {}
  async execute(brandId: number, query: ISharedQuery) {
    const translations = await this.brandTranslationRepository.findByBrandId(
      brandId,
      query,
    );
    const total = await this.brandTranslationRepository.countByBrandId(brandId);
    return {
      data: translations,
      total,
      totalPages: Math.ceil(total / +query.limit),
      currentPage: +query.page,
    };
  }
}
