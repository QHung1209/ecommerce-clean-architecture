import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { BRAND_REPOSITORY } from 'src/brand/brand.constants';
import { Brand } from 'src/brand/domain/entities/brand.entity';
import type { IBrandRepository } from 'src/brand/domain/interfaces/brand-repository.interface';

type CreateBrandCommand = {
  logo: string;
  name: string;
  description: string;
};

@Injectable()
export class CreateBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
  ) {}
  async execute(brand: CreateBrandCommand, createdById: number) {
    const brandEntity = Brand.create(brand);
    return this.brandRepository.save(brandEntity, createdById);
  }
}
