import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BRAND_REPOSITORY } from 'src/brand/brand.constants';
import type { IBrandRepository } from 'src/brand/domain/interfaces/brand-repository.interface';

type UpdateBrandCommand = {
  logo?: string;
};

@Injectable()
export class UpdateBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
  ) {}
  async execute(id: number, data: UpdateBrandCommand, updatedById: number) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    brand.update(data);
    return this.brandRepository.save(brand, updatedById);
  }
}
