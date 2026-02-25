import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  BRAND_REPOSITORY,
  BRAND_TRANSLATION_REPOSITORY,
} from 'src/brand/brand.constants';
import type { IBrandRepository } from 'src/brand/domain/interfaces/brand-repository.interface';
import type { IBrandTranslationRepository } from 'src/brand/domain/interfaces/brand-translation-repository.interface';

@Injectable()
export class DeleteBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
    @Inject(BRAND_TRANSLATION_REPOSITORY)
    private readonly brandTranslationRepository: IBrandTranslationRepository,
  ) {}
  async execute(id: number, deletedById: number) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    await this.brandTranslationRepository.deleteByBrandId(id, deletedById);
    await this.brandRepository.delete(id, deletedById);
  }
}
