import { Inject, Injectable } from '@nestjs/common';
import { BRAND_REPOSITORY } from 'src/brand/brand.constants';
import type { IBrandRepository } from 'src/brand/domain/interfaces/brand-repository.interface';
import { ISharedQuery } from 'src/shared/domain/interfaces/query.interface';

@Injectable()
export class ListBrandsUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
  ) {}
  async execute(query: ISharedQuery, languageCode?: string) {
    const brands = await this.brandRepository.findAllBrands(languageCode);
    const total = await this.brandRepository.count();
    return {
      data: brands,
      total,
      totalPages: Math.ceil(total / +query.limit),
      currentPage: +query.page,
    };
  }
}
