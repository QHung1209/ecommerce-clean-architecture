import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BRAND_REPOSITORY } from 'src/brand/brand.constants';
import type { IBrandRepository } from 'src/brand/domain/interfaces/brand-repository.interface';

@Injectable()
export class GetBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
  ) {}
  async execute(id: number, languageCode?: string) {
    const brand = await this.brandRepository.findByCondition({id}, languageCode);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }
}
